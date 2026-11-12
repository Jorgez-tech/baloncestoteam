const Member = require('../../../../models/member.model');

function requireMemberAccess(req, res, next) {
    const memberId = req.params.memberId || req.params.id;

    if (req.user && req.user.role === 'admin') {
        return next();
    }

    Member.findById(memberId).then(member => {
        if (!member) {
            return res.status(404).json({ success: false, message: 'Socio no encontrado' });
        }
        if (member.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Acceso denegado a este socio' });
        }
        next();
    }).catch(next);
}

module.exports = { requireMemberAccess };
