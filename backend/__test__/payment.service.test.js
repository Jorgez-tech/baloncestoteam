jest.mock('../models/payment_obligation.model');
jest.mock('../models/member.model');
jest.mock('../models/guardian_link.model');
jest.mock('../src/modules/sports/services/sports.service', () => ({
    getActiveRosterBillingSnapshot: jest.fn(),
    getActiveRosterPlayerIds: jest.fn()
}));

const mongoose = require('mongoose');
const paymentService = require('../src/modules/payments/services/payment.service');
const PaymentObligation = require('../models/payment_obligation.model');
const Member = require('../models/member.model');
const GuardianLink = require('../models/guardian_link.model');
const sportsService = require('../src/modules/sports/services/sports.service');

const createLeanQuery = (result) => ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result)
});

describe('PaymentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateBatchMensualidades', () => {
        it('groups active roster dependents by responsible member and multiplies the amount', async () => {
            const memberId = new mongoose.Types.ObjectId();
            const playerOneId = new mongoose.Types.ObjectId();
            const playerTwoId = new mongoose.Types.ObjectId();

            sportsService.getActiveRosterBillingSnapshot.mockResolvedValue({
                season: '2026-2027',
                rosterEntries: [
                    { playerId: playerOneId, teamId: new mongoose.Types.ObjectId(), status: 'Active' },
                    { playerId: playerTwoId, teamId: new mongoose.Types.ObjectId(), status: 'Injured' }
                ]
            });

            GuardianLink.find.mockReturnValue(createLeanQuery([
                { memberId, playerId: playerOneId, isFinancialResponsible: true },
                { memberId, playerId: playerTwoId, isFinancialResponsible: true }
            ]));

            Member.find.mockReturnValue(createLeanQuery([
                { _id: memberId, status: 'active' }
            ]));

            PaymentObligation.insertMany.mockResolvedValue([
                { _id: new mongoose.Types.ObjectId(), memberId, amount: 24000 }
            ]);

            const result = await paymentService.generateBatchMensualidades({
                title: 'Mensualidad Octubre 2026',
                period: '2026-10',
                amount: 12000,
                dueDate: new Date('2026-10-31T00:00:00.000Z')
            });

            expect(sportsService.getActiveRosterBillingSnapshot).toHaveBeenCalledTimes(1);
            expect(PaymentObligation.insertMany).toHaveBeenCalledWith([
                expect.objectContaining({
                    memberId,
                    title: 'Mensualidad Octubre 2026',
                    type: 'mensualidad',
                    period: '2026-10',
                    amount: 24000,
                    unitAmount: 12000,
                    playerCount: 2,
                    status: 'pending'
                })
            ], { ordered: false });
            expect(result).toEqual({
                season: '2026-2027',
                inserted: 1,
                skipped: 0,
                billedMembers: 1,
                billedPlayers: 2
            });
        });

        it('returns an empty result when there is no active roster for billing', async () => {
            sportsService.getActiveRosterBillingSnapshot.mockResolvedValue({
                season: null,
                rosterEntries: []
            });

            const result = await paymentService.generateBatchMensualidades({
                title: 'Mensualidad Noviembre 2026',
                period: '2026-11',
                amount: 12000,
                dueDate: new Date('2026-11-30T00:00:00.000Z')
            });

            expect(GuardianLink.find).not.toHaveBeenCalled();
            expect(Member.find).not.toHaveBeenCalled();
            expect(PaymentObligation.insertMany).not.toHaveBeenCalled();
            expect(result).toEqual({
                season: null,
                inserted: 0,
                skipped: 0,
                billedMembers: 0,
                billedPlayers: 0
            });
        });
    });

    describe('cancelPendingObligations', () => {
        it('cancels only unpaid fees and leaves paid ones untouched', async () => {
            const memberId = new mongoose.Types.ObjectId();
            PaymentObligation.updateMany.mockResolvedValue({ modifiedCount: 2 });

            const modified = await paymentService.cancelPendingObligations(memberId);

            expect(PaymentObligation.updateMany).toHaveBeenCalledWith(
                { memberId, status: { $in: ['pending', 'overdue'] } },
                { $set: { status: 'cancelled' } }
            );
            expect(modified).toBe(2);
        });
    });

    describe('reconcileMemberBilling', () => {
        it('reduces the outstanding fee to the remaining active players', async () => {
            const memberId = new mongoose.Types.ObjectId();
            const stayingPlayerId = new mongoose.Types.ObjectId();
            const leavingPlayerId = new mongoose.Types.ObjectId();

            sportsService.getActiveRosterPlayerIds.mockResolvedValue(
                new Set([stayingPlayerId.toString()])
            );

            GuardianLink.find.mockReturnValue(createLeanQuery([
                { memberId, playerId: stayingPlayerId },
                { memberId, playerId: leavingPlayerId }
            ]));

            const obligation = {
                status: 'pending',
                amount: 24000,
                unitAmount: 12000,
                playerCount: 2,
                save: jest.fn().mockResolvedValue(undefined)
            };
            PaymentObligation.find.mockResolvedValue([obligation]);

            const result = await paymentService.reconcileMemberBilling(memberId);

            expect(PaymentObligation.find).toHaveBeenCalledWith({
                memberId,
                type: 'mensualidad',
                status: { $in: ['pending', 'overdue'] },
                unitAmount: { $ne: null }
            });
            expect(obligation.amount).toBe(12000);
            expect(obligation.playerCount).toBe(1);
            expect(obligation.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ adjusted: 1, cancelled: 0 });
        });

        it('cancels the fee when the member keeps no active players', async () => {
            const memberId = new mongoose.Types.ObjectId();
            const leavingPlayerId = new mongoose.Types.ObjectId();

            sportsService.getActiveRosterPlayerIds.mockResolvedValue(new Set());

            GuardianLink.find.mockReturnValue(createLeanQuery([
                { memberId, playerId: leavingPlayerId }
            ]));

            const obligation = {
                status: 'pending',
                amount: 24000,
                unitAmount: 12000,
                playerCount: 2,
                save: jest.fn().mockResolvedValue(undefined)
            };
            PaymentObligation.find.mockResolvedValue([obligation]);

            const result = await paymentService.reconcileMemberBilling(memberId);

            expect(obligation.status).toBe('cancelled');
            expect(obligation.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ adjusted: 0, cancelled: 1 });
        });

        it('leaves the fee untouched when the amount already matches the active roster', async () => {
            const memberId = new mongoose.Types.ObjectId();
            const playerId = new mongoose.Types.ObjectId();

            sportsService.getActiveRosterPlayerIds.mockResolvedValue(new Set([playerId.toString()]));
            GuardianLink.find.mockReturnValue(createLeanQuery([{ memberId, playerId }]));

            const obligation = {
                status: 'pending',
                amount: 12000,
                unitAmount: 12000,
                playerCount: 1,
                save: jest.fn()
            };
            PaymentObligation.find.mockResolvedValue([obligation]);

            const result = await paymentService.reconcileMemberBilling(memberId);

            expect(obligation.save).not.toHaveBeenCalled();
            expect(result).toEqual({ adjusted: 0, cancelled: 0 });
        });
    });

    describe('reconcileBillingAfterRosterChange', () => {
        it('reconciles each financial responsible member exactly once', async () => {
            const playerId = new mongoose.Types.ObjectId();
            const memberOne = new mongoose.Types.ObjectId();
            const memberTwo = new mongoose.Types.ObjectId();

            GuardianLink.find.mockReturnValue(createLeanQuery([
                { memberId: memberOne, playerId },
                { memberId: memberTwo, playerId },
                { memberId: memberOne, playerId }
            ]));

            const reconcileSpy = jest
                .spyOn(paymentService, 'reconcileMemberBilling')
                .mockResolvedValue({ adjusted: 1, cancelled: 0 });

            const result = await paymentService.reconcileBillingAfterRosterChange(playerId);

            expect(reconcileSpy).toHaveBeenCalledTimes(2);
            expect(result).toEqual({ members: 2, adjusted: 2, cancelled: 0 });

            reconcileSpy.mockRestore();
        });

        it('does nothing when the player has no financial responsible member', async () => {
            GuardianLink.find.mockReturnValue(createLeanQuery([]));

            const reconcileSpy = jest.spyOn(paymentService, 'reconcileMemberBilling');

            const result = await paymentService.reconcileBillingAfterRosterChange(
                new mongoose.Types.ObjectId()
            );

            expect(reconcileSpy).not.toHaveBeenCalled();
            expect(result).toEqual({ members: 0, adjusted: 0, cancelled: 0 });

            reconcileSpy.mockRestore();
        });
    });

    describe('updateStatus', () => {
        it('marks an obligation as paid only when it is still unpaid', async () => {
            const obligationId = new mongoose.Types.ObjectId().toString();
            const paidObligation = {
                _id: obligationId,
                status: 'paid',
                paymentDetails: {
                    paymentMethod: 'mercadopago',
                    transactionId: 'tx-123'
                }
            };

            PaymentObligation.findOneAndUpdate.mockResolvedValue(paidObligation);

            const result = await paymentService.updateStatus(obligationId, 'paid', {
                paymentMethod: 'mercadopago',
                transactionId: 'tx-123'
            });

            expect(PaymentObligation.findOneAndUpdate).toHaveBeenCalledWith(
                {
                    _id: obligationId,
                    status: { $in: ['pending', 'overdue'] }
                },
                {
                    $set: expect.objectContaining({
                        status: 'paid',
                        'paymentDetails.paymentMethod': 'mercadopago',
                        'paymentDetails.transactionId': 'tx-123',
                        'paymentDetails.paidAt': expect.any(Date)
                    })
                },
                { new: true }
            );
            expect(result).toBe(paidObligation);
        });

        it('throws a conflict when the obligation was already paid', async () => {
            const obligationId = new mongoose.Types.ObjectId().toString();

            PaymentObligation.findOneAndUpdate.mockResolvedValue(null);
            PaymentObligation.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    _id: obligationId,
                    status: 'paid'
                })
            });

            await expect(paymentService.updateStatus(obligationId, 'paid', {})).rejects.toMatchObject({
                message: 'La obligación ya fue pagada.',
                statusCode: 409,
                code: 'OBLIGATION_ALREADY_PAID'
            });
        });
    });
});
