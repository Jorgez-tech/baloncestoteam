const PaymentObligation = require('../../../../models/payment_obligation.model');
const Member = require('../../../../models/member.model');
const GuardianLink = require('../../../../models/guardian_link.model');
const sportsService = require('../../sports/services/sports.service');

const buildServiceError = (message, statusCode, code) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
};

class PaymentService {
    async createObligation(data) {
        const obligation = new PaymentObligation(data);
        return obligation.save();
    }

    async getMemberObligations(memberId, query = {}) {
        const { page, limit, status, type, period } = query;

        const filter = { memberId };
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (period) filter.period = period;

        const findQuery = PaymentObligation.find(filter).sort({ dueDate: -1 });

        // Pagination stays opt-in so existing consumers still receive the full list.
        if (limit) {
            findQuery.skip(((page || 1) - 1) * limit).limit(limit);
        }

        return findQuery;
    }

    async getObligationById(id) {
        return PaymentObligation.findById(id);
    }

    /**
     * Loads a member together with the account holder, restricted to the fields the
     * payments flows actually need (ABAC: never expose full User documents).
     */
    async getMemberWithUser(memberId) {
        return Member.findById(memberId).populate('userId', 'name email');
    }

    /**
     * Cancels every unpaid fee of a member. Financial records are never removed: when a
     * member stops being billed, their pending/overdue fees are cancelled, not deleted.
     * Already paid obligations are left untouched.
     */
    async cancelPendingObligations(memberId) {
        const result = await PaymentObligation.updateMany(
            { memberId, status: { $in: ['pending', 'overdue'] } },
            { $set: { status: 'cancelled' } }
        );

        return result.modifiedCount;
    }

    /**
     * Recomputes a member's outstanding monthly fees against the current active roster.
     * The amount is always `unitAmount * activePlayers`: if none of the member's children
     * remain in the roster the fee is cancelled, otherwise it is adjusted so the member
     * never keeps paying for a player that already left. Records without a billing
     * snapshot (legacy rows) are left untouched because their unit price is unknown.
     */
    async reconcileMemberBilling(memberId) {
        const activePlayerIds = await sportsService.getActiveRosterPlayerIds();
        const links = await GuardianLink.find({ memberId, isFinancialResponsible: true })
            .select('playerId')
            .lean();

        const remainingPlayers = links.filter(link => activePlayerIds.has(link.playerId.toString())).length;

        const obligations = await PaymentObligation.find({
            memberId,
            type: 'mensualidad',
            status: { $in: ['pending', 'overdue'] },
            unitAmount: { $ne: null }
        });

        let adjusted = 0;
        let cancelled = 0;

        for (const obligation of obligations) {
            if (remainingPlayers === 0) {
                obligation.status = 'cancelled';
                await obligation.save();
                cancelled += 1;
                continue;
            }

            const expectedAmount = obligation.unitAmount * remainingPlayers;
            if (obligation.amount !== expectedAmount || obligation.playerCount !== remainingPlayers) {
                obligation.amount = expectedAmount;
                obligation.playerCount = remainingPlayers;
                await obligation.save();
                adjusted += 1;
            }
        }

        return { adjusted, cancelled };
    }

    /**
     * Reconciles the fees of every member financially responsible for a player whose
     * roster spot was released. Invoked by the sports/players domains after a player
     * leaves an active team.
     */
    async reconcileBillingAfterRosterChange(playerId) {
        const links = await GuardianLink.find({ playerId, isFinancialResponsible: true })
            .select('memberId')
            .lean();

        const memberIds = [...new Set(links.map(link => link.memberId.toString()))];

        let adjusted = 0;
        let cancelled = 0;

        for (const memberId of memberIds) {
            const result = await this.reconcileMemberBilling(memberId);
            adjusted += result.adjusted;
            cancelled += result.cancelled;
        }

        return { members: memberIds.length, adjusted, cancelled };
    }

    async updateStatus(id, status, paymentDetails = {}) {
        const updateData = { status };
        if (status === 'paid') {
            updateData['paymentDetails.paidAt'] = new Date();
            if (paymentDetails.paymentMethod) updateData['paymentDetails.paymentMethod'] = paymentDetails.paymentMethod;
            if (paymentDetails.transactionId) updateData['paymentDetails.transactionId'] = paymentDetails.transactionId;

            const obligation = await PaymentObligation.findOneAndUpdate(
                {
                    _id: id,
                    status: { $in: ['pending', 'overdue'] }
                },
                { $set: updateData },
                { new: true }
            );

            if (obligation) {
                return obligation;
            }

            const currentObligation = await PaymentObligation.findById(id).select('_id status');
            if (!currentObligation) {
                return null;
            }

            if (currentObligation.status === 'paid') {
                throw buildServiceError('La obligación ya fue pagada.', 409, 'OBLIGATION_ALREADY_PAID');
            }

            throw buildServiceError(
                `No se puede marcar como pagada una obligación en estado ${currentObligation.status}.`,
                409,
                'INVALID_STATUS_TRANSITION'
            );
        }

        return PaymentObligation.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    }

    /**
     * Generación masiva de mensualidades seguras.
     * Utiliza insertMany con ordered: false para ignorar los duplicados (protección anti-doble clic)
     * basándose en el índice único (memberId, type, period).
     */
    async generateBatchMensualidades({ title, period, amount, dueDate }) {
        const { season, rosterEntries } = await sportsService.getActiveRosterBillingSnapshot();
        if (rosterEntries.length === 0) {
            return { season, inserted: 0, skipped: 0, billedMembers: 0, billedPlayers: 0 };
        }

        const activePlayerIds = [...new Set(rosterEntries.map(entry => entry.playerId.toString()))];
        const guardianLinks = await GuardianLink.find({
            playerId: { $in: activePlayerIds },
            isFinancialResponsible: true
        })
            .select('memberId playerId')
            .lean();

        if (guardianLinks.length === 0) {
            return { season, inserted: 0, skipped: 0, billedMembers: 0, billedPlayers: 0 };
        }

        const responsiblePlayersByMember = guardianLinks.reduce((accumulator, link) => {
            const memberId = link.memberId.toString();
            const playerId = link.playerId.toString();

            if (!accumulator.has(memberId)) {
                accumulator.set(memberId, new Set());
            }

            accumulator.get(memberId).add(playerId);
            return accumulator;
        }, new Map());

        const activeMemberIds = [...responsiblePlayersByMember.keys()];
        const activeMembers = await Member.find({
            _id: { $in: activeMemberIds },
            status: 'active'
        })
            .select('_id')
            .lean();

        if (activeMembers.length === 0) {
            return { season, inserted: 0, skipped: 0, billedMembers: 0, billedPlayers: 0 };
        }

        const obligations = activeMembers.map(member => {
            const playerCount = responsiblePlayersByMember.get(member._id.toString())?.size || 0;

            return {
                memberId: member._id,
                title,
                type: 'mensualidad',
                period,
                amount: amount * playerCount,
                unitAmount: amount,
                playerCount,
                dueDate,
                status: 'pending'
            };
        }).filter(obligation => obligation.amount > 0);

        if (obligations.length === 0) {
            return { season, inserted: 0, skipped: 0, billedMembers: 0, billedPlayers: 0 };
        }

        const billedPlayers = obligations.reduce((sum, obligation) => {
            const playerCount = responsiblePlayersByMember.get(obligation.memberId.toString())?.size || 0;
            return sum + playerCount;
        }, 0);

        try {
            const result = await PaymentObligation.insertMany(obligations, { ordered: false });
            return {
                season,
                inserted: result.length,
                skipped: 0,
                billedMembers: obligations.length,
                billedPlayers
            };
        } catch (error) {
            if (error.code === 11000 || (error.writeErrors && error.writeErrors.some(e => e.code === 11000))) {
                const insertedCount = error.insertedDocs ? error.insertedDocs.length : 0;
                return {
                    season,
                    inserted: insertedCount,
                    skipped: obligations.length - insertedCount,
                    billedMembers: obligations.length,
                    billedPlayers
                };
            }

            throw error;
        }
    }
}

module.exports = new PaymentService();
