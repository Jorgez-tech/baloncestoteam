const mongoose = require('mongoose');

jest.mock('../models/member.model');
jest.mock('../models/guardian_link.model');
jest.mock('../models/user.model');
jest.mock('../models/player.model');
jest.mock('../src/modules/sports/services/sports.service');
jest.mock('../src/modules/payments/services/payment.service');

const Member = require('../models/member.model');
const GuardianLink = require('../models/guardian_link.model');
const sportsService = require('../src/modules/sports/services/sports.service');
const paymentService = require('../src/modules/payments/services/payment.service');
const memberService = require('../src/modules/members/services/member.service');

const mockGuardianLinks = (links) => {
    GuardianLink.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(links)
        })
    });
};

describe('MemberService.updateMember pre-flight check', () => {
    const memberId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('blocks deactivation when a dependent still holds an active roster spot', async () => {
        const playerId = new mongoose.Types.ObjectId();
        Member.findById.mockResolvedValue({ _id: memberId, status: 'active' });
        mockGuardianLinks([{ playerId }]);
        sportsService.getActiveRosterPlayerIds.mockResolvedValue(new Set([playerId.toString()]));

        await expect(
            memberService.updateMember(memberId.toString(), { status: 'inactive' })
        ).rejects.toMatchObject({
            statusCode: 409,
            code: 'MEMBER_HAS_ACTIVE_DEPENDENTS'
        });

        expect(Member.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('allows deactivation when no dependent is competing and cancels the pending fees', async () => {
        const playerId = new mongoose.Types.ObjectId();
        const otherPlayerId = new mongoose.Types.ObjectId();
        Member.findById.mockResolvedValue({ _id: memberId, status: 'active' });
        Member.findByIdAndUpdate.mockResolvedValue({ _id: memberId, status: 'inactive' });
        mockGuardianLinks([{ playerId }]);
        sportsService.getActiveRosterPlayerIds.mockResolvedValue(new Set([otherPlayerId.toString()]));

        const result = await memberService.updateMember(memberId.toString(), { status: 'inactive' });

        expect(result.status).toBe('inactive');
        expect(Member.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(paymentService.cancelPendingObligations).toHaveBeenCalledWith(memberId);
    });

    it('skips the pre-flight check when the member is already inactive', async () => {
        Member.findById.mockResolvedValue({ _id: memberId, status: 'inactive' });
        Member.findByIdAndUpdate.mockResolvedValue({ _id: memberId, memberNumber: 'SOC-99' });

        await memberService.updateMember(memberId.toString(), { memberNumber: 'SOC-99' });

        expect(sportsService.getActiveRosterPlayerIds).not.toHaveBeenCalled();
        expect(paymentService.cancelPendingObligations).not.toHaveBeenCalled();
    });

    it('returns null when the member does not exist', async () => {
        Member.findById.mockResolvedValue(null);

        await expect(memberService.updateMember(memberId.toString(), { status: 'inactive' })).resolves.toBeNull();
        expect(Member.findByIdAndUpdate).not.toHaveBeenCalled();
    });
});
