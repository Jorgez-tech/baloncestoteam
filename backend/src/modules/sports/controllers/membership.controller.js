const membershipService = require('../services/membership.service');
const auditService = require('../../audit/services/audit.service');
const mailerService = require('../../notifications/services/mailer.service');

class MembershipController {
    /**
     * POST /sports/teams/:teamId/staff
     * Solo admin puede asignar coaches/staff
     */
    async assignMember(req, res) {
        try {
            const { teamId } = req.params;
            const { userId, role, expiresAt } = req.body;

            const { membership, team, user } = await membershipService.assignMember(teamId, userId, role, expiresAt);

            // Enviar alerta al staff
            await mailerService.sendRoleAssignedAlert(user.email, user.name || 'Staff', role, team.name);

            auditService.logAction({
                actorId: req.user.id,
                actorEmail: req.user.email,
                action: 'MEMBERSHIP_ASSIGNED',
                targetEntity: 'TeamMembership',
                targetId: membership._id.toString(),
                metadata: { teamId, userId, role },
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.status(201).json({
                success: true,
                message: `Usuario asignado como ${role} exitosamente`,
                data: membership
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * DELETE /sports/teams/:teamId/staff/:userId
     * Solo admin puede revocar
     */
    async revokeMember(req, res) {
        try {
            const { teamId, userId } = req.params;

            const membership = await membershipService.revokeMember(teamId, userId);

            auditService.logAction({
                actorId: req.user.id,
                actorEmail: req.user.email,
                action: 'MEMBERSHIP_REVOKED',
                targetEntity: 'TeamMembership',
                targetId: membership._id.toString(),
                metadata: { teamId, userId },
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({
                success: true,
                message: 'Membresía revocada exitosamente',
                data: membership
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * GET /sports/teams/:teamId/staff
     * Admin o cualquier miembro del equipo puede ver el staff
     */
    async getTeamStaff(req, res) {
        try {
            const staff = await membershipService.getTeamStaff(req.params.teamId);
            res.json({ success: true, data: staff });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new MembershipController();
