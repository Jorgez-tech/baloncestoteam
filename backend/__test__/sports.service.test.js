jest.mock('../models/team_player.model');
jest.mock('../src/modules/payments/services/payment.service', () => ({
    reconcileBillingAfterRosterChange: jest.fn()
}));

const TeamPlayer = require('../models/team_player.model');
const paymentService = require('../src/modules/payments/services/payment.service');
const sportsService = require('../src/modules/sports/services/sports.service');

describe('SportsService - roster billing reconciliation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('removePlayerFromTeam', () => {
        it('reconciles billing after releasing the roster spot', async () => {
            const teamId = 'team-1';
            const playerId = 'player-1';
            TeamPlayer.findOneAndUpdate.mockResolvedValue({ _id: 'tp-1', teamId, playerId, status: 'Inactive' });

            const result = await sportsService.removePlayerFromTeam(teamId, playerId);

            expect(TeamPlayer.findOneAndUpdate).toHaveBeenCalledWith(
                { teamId, playerId },
                { status: 'Inactive', leftAt: expect.any(Date) },
                { new: true }
            );
            expect(paymentService.reconcileBillingAfterRosterChange).toHaveBeenCalledWith(playerId);
            expect(result.status).toBe('Inactive');
        });

        it('does not reconcile when there was no roster entry to release', async () => {
            TeamPlayer.findOneAndUpdate.mockResolvedValue(null);

            await sportsService.removePlayerFromTeam('team-1', 'player-1');

            expect(paymentService.reconcileBillingAfterRosterChange).not.toHaveBeenCalled();
        });
    });

    describe('updateTeamPlayer', () => {
        it('reconciles billing when a roster entry transitions to Inactive', async () => {
            const teamId = 'team-1';
            const playerId = 'player-1';
            TeamPlayer.findOne.mockResolvedValue({ _id: 'tp-1', teamId, playerId, status: 'Active' });
            TeamPlayer.findByIdAndUpdate.mockResolvedValue({ _id: 'tp-1', status: 'Inactive' });

            await sportsService.updateTeamPlayer(teamId, playerId, { status: 'Inactive' });

            expect(paymentService.reconcileBillingAfterRosterChange).toHaveBeenCalledWith(playerId);
        });

        it('does not reconcile when the roster entry stays active', async () => {
            const teamId = 'team-1';
            const playerId = 'player-1';
            TeamPlayer.findOne.mockResolvedValue({ _id: 'tp-1', teamId, playerId, status: 'Active' });
            TeamPlayer.findByIdAndUpdate.mockResolvedValue({ _id: 'tp-1', status: 'Injured' });

            await sportsService.updateTeamPlayer(teamId, playerId, { status: 'Injured' });

            expect(paymentService.reconcileBillingAfterRosterChange).not.toHaveBeenCalled();
        });
    });
});
