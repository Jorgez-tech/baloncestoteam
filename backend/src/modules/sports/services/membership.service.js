const TeamMembership = require('../../../../models/team_membership.model');
const Team = require('../../../../models/team.model');
const User = require('../../../../models/user.model');

class MembershipService {
    /**
     * Asigna un coach o staff a un equipo. Solo el admin puede invocar esto.
     */
    async assignMember(teamId, userId, role, expiresAt = null) {
        const team = await Team.findById(teamId);
        if (!team) throw new Error('Equipo no encontrado');

        const user = await User.findById(userId);
        if (!user || !user.isActive) throw new Error('Usuario no encontrado o inactivo');

        // Upsert: si ya existía, actualiza el rol y status
        const membership = await TeamMembership.findOneAndUpdate(
            { teamId, userId },
            { role, expiresAt, status: 'active' },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return { membership, team, user };
    }

    /**
     * Revoca la membresía de un usuario en un equipo.
     */
    async revokeMember(teamId, userId) {
        const membership = await TeamMembership.findOne({ teamId, userId });
        if (!membership) throw new Error('Membresía no encontrada');
        membership.status = 'suspended';
        return membership.save();
    }

    /**
     * Lista el staff de un equipo.
     */
    async getTeamStaff(teamId) {
        return TeamMembership.find({ teamId })
            .populate('userId', 'name email')
            .sort({ role: 1 });
    }

    /**
     * Retorna los teamIds donde el usuario tiene rol activo de coach/staff.
     * Filtra automáticamente los memberships expirados.
     */
    async getActiveTeamsForUser(userId) {
        const now = new Date();
        const memberships = await TeamMembership.find({
            userId,
            status: 'active',
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: now } }
            ]
        }).select('teamId role');
        return memberships;
    }

    /**
     * Verifica si un usuario tiene un rol de coach (head o asistente) en un equipo específico.
     */
    async isCoachOf(userId, teamId) {
        const now = new Date();
        const m = await TeamMembership.findOne({
            userId,
            teamId,
            role: { $in: ['head_coach', 'asst_coach'] },
            status: 'active',
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
        });
        return !!m;
    }

    /**
     * Verifica si un usuario tiene cualquier membresía activa en un equipo.
     */
    async isMemberOf(userId, teamId) {
        const now = new Date();
        const m = await TeamMembership.findOne({
            userId,
            teamId,
            status: 'active',
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
        });
        return !!m;
    }
}

module.exports = new MembershipService();
