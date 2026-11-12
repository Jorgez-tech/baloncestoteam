const Member = require('../../../../models/member.model');
const GuardianLink = require('../../../../models/guardian_link.model');
const User = require('../../../../models/user.model');
const Player = require('../../../../models/player.model');
const sportsService = require('../../sports/services/sports.service');
const paymentService = require('../../payments/services/payment.service');

const buildServiceError = (message, statusCode, code) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
};

class MemberService {
    // --- MEMBERS ---
    async createMember(data) {
        // Verificar que el User existe
        const user = await User.findById(data.userId);
        if (!user) throw new Error('Usuario no encontrado');

        const member = new Member(data);
        return member.save();
    }

    async getMembers(query = {}) {
        const { page, limit, ...filter } = query;
        const findQuery = Member.find(filter).populate('userId', 'name email');

        // Pagination stays opt-in so existing consumers still receive the full list.
        if (limit) {
            findQuery.skip(((page || 1) - 1) * limit).limit(limit);
        }

        return findQuery;
    }

    async getMemberById(id) {
        return Member.findById(id).populate('userId', 'name email');
    }

    async updateMember(id, data) {
        const member = await Member.findById(id);
        if (!member) return null;

        const nextStatus = data.status || member.status;
        const isBeingDeactivated = member.status !== 'inactive' && nextStatus === 'inactive';

        if (isBeingDeactivated) {
            await this.assertNoActiveRosterDependents(member._id);
        }

        const updatedMember = await Member.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        // A deactivated member must not keep being billed: cancel the fees that were
        // still unpaid instead of charging someone who no longer belongs to the club.
        if (isBeingDeactivated && updatedMember) {
            await paymentService.cancelPendingObligations(updatedMember._id);
        }

        return updatedMember;
    }

    /**
     * Pre-flight check: a financial responsible member cannot be deactivated while any of
     * its dependents still holds an active roster spot in the current season. Otherwise the
     * club would keep the player competing with nobody left to bill.
     */
    async assertNoActiveRosterDependents(memberId) {
        const links = await GuardianLink.find({ memberId }).select('playerId').lean();
        if (links.length === 0) return;

        const activeRosterPlayerIds = await sportsService.getActiveRosterPlayerIds();
        if (activeRosterPlayerIds.size === 0) return;

        const blockedPlayerIds = links
            .map(link => link.playerId.toString())
            .filter(playerId => activeRosterPlayerIds.has(playerId));

        if (blockedPlayerIds.length > 0) {
            throw buildServiceError(
                `No se puede desactivar al socio: mantiene ${blockedPlayerIds.length} jugador(es) con inscripción activa en un equipo. Retire primero a los jugadores del roster.`,
                409,
                'MEMBER_HAS_ACTIVE_DEPENDENTS'
            );
        }
    }

    // --- DEPENDENTS (Tutor-Menor) ---
    async linkDependent(memberId, data) {
        const member = await Member.findById(memberId);
        if (!member) throw new Error('Socio no encontrado');

        const player = await Player.findById(data.playerId);
        if (!player) throw new Error('Jugador no encontrado');

        const link = new GuardianLink({ ...data, memberId });
        return link.save();
    }

    async getDependents(memberId) {
        return GuardianLink.find({ memberId })
            .populate({
                path: 'playerId',
                select: 'name position avatar',
            });
    }

    async unlinkDependent(memberId, playerId) {
        return GuardianLink.findOneAndDelete({ memberId, playerId });
    }
}

module.exports = new MemberService();
