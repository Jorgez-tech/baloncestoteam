const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../src/modules/sports/middleware/team.auth'); // Reusando el de sports o podemos importarlo de un common
const { requireMemberAccess } = require('../src/modules/members/middleware/member.auth');
const memberController = require('../src/modules/members/controllers/member.controller');
const {
    createMemberDto,
    updateMemberDto,
    linkDependentDto,
    validateObjectIdParam
} = require('../src/modules/members/dtos/member.dto');

router.use(authMiddleware);

// --- MEMBERS ---
// Solo admin puede crear un nuevo socio (asociar un userId con un memberNumber financiero)
router.post('/', requireAdmin, createMemberDto, memberController.createMember);
router.get('/', requireAdmin, memberController.getMembers);
router.put('/:id', requireAdmin, updateMemberDto, memberController.updateMember);

// --- DEPENDENTS ---
// El socio (o admin) puede ver sus dependientes
router.get('/:memberId/dependents', requireMemberAccess, validateObjectIdParam('memberId'), memberController.getDependents);
// Socio o admin pueden vincular un jugador
router.post('/:memberId/dependents', requireMemberAccess, linkDependentDto, memberController.linkDependent);
// Socio o admin pueden desvincular
router.delete('/:memberId/dependents/:playerId', requireMemberAccess, validateObjectIdParam('memberId'), validateObjectIdParam('playerId'), memberController.unlinkDependent);

module.exports = router;
