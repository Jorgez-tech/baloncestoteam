const memberService = require('../services/member.service');
const auditService = require('../../audit/services/audit.service');

class MemberController {
    // --- MEMBERS ---
    async createMember(req, res) {
        try {
            const member = await memberService.createMember(req.body);
            auditService.logAction({ 
                actorId: req.user?.id, 
                action: 'MEMBER_CREATED', 
                targetEntity: 'Member', 
                targetId: member._id.toString() 
            });
            res.status(201).json({ success: true, data: member });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    async getMembers(req, res) {
        try {
            const members = await memberService.getMembers(req.validatedQuery);
            res.json({ success: true, data: members });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }

    async updateMember(req, res) {
        try {
            const member = await memberService.updateMember(req.params.id, req.body);
            if (!member) return res.status(404).json({ success: false, message: 'Not found' });
            auditService.logAction({
                actorId: req.user?.id,
                action: 'MEMBER_UPDATED',
                targetEntity: 'Member',
                targetId: member._id.toString()
            });
            res.json({ success: true, data: member });
        } catch (e) {
            res.status(e.statusCode || 400).json({ success: false, message: e.message });
        }
    }

    // --- DEPENDENTS ---
    async linkDependent(req, res) {
        try {
            const { memberId } = req.params;
            const link = await memberService.linkDependent(memberId, req.body);
            auditService.logAction({ 
                actorId: req.user?.id, 
                action: 'DEPENDENT_LINKED', 
                targetEntity: 'GuardianLink', 
                targetId: link._id.toString(),
                metadata: { memberId, playerId: req.body.playerId }
            });
            res.status(201).json({ success: true, data: link });
        } catch (e) {
            // Manejar error de duplicado
            if (e.code === 11000) {
                return res.status(400).json({ success: false, message: 'El jugador ya está vinculado a este socio' });
            }
            res.status(400).json({ success: false, message: e.message });
        }
    }

    async getDependents(req, res) {
        try {
            const dependents = await memberService.getDependents(req.params.memberId);
            res.json({ success: true, data: dependents });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }

    async unlinkDependent(req, res) {
        try {
            const { memberId, playerId } = req.params;
            const link = await memberService.unlinkDependent(memberId, playerId);
            if (link) {
                auditService.logAction({ 
                    actorId: req.user?.id, 
                    action: 'DEPENDENT_UNLINKED', 
                    targetEntity: 'GuardianLink', 
                    targetId: link._id.toString(),
                    metadata: { memberId, playerId }
                });
            }
            res.json({ success: true, message: 'Vínculo eliminado exitosamente' });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
}

module.exports = new MemberController();
