const Member = require('../../../../models/member.model');
const GuardianLink = require('../../../../models/guardian_link.model');
const User = require('../../../../models/user.model');
const Player = require('../../../../models/player.model');

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
        return Member.find(query).populate('userId', 'name email');
    }

    async getMemberById(id) {
        return Member.findById(id).populate('userId', 'name email');
    }

    async updateMember(id, data) {
        return Member.findByIdAndUpdate(id, data, { new: true });
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
