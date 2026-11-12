/**
 * Middleware ABAC para rutas de equipos.
 *
 * Estrategia:
 *  - Si req.user.role === 'admin' → acceso total (presidente del club).
 *  - Si tiene membresía activa de coach/staff en el teamId del request → acceso.
 *  - En cualquier otro caso → 403 Forbidden.
 */

/**
 * Requiere que el usuario sea admin del club O tenga el rol mínimo indicado en el equipo.
 * @param {'coach' | 'staff' | 'any'} minRole
 *   'coach'  → solo head_coach o asst_coach
 *   'staff'  → cualquier rol (head_coach, asst_coach, staff, scorekeeper)
 *   'any'    → cualquier membresía activa en ese equipo
 */
function requireTeamAccess(minRole = 'any') {
    return async (req, res, next) => {
        try {
            const user = req.user;

            // El admin del club (presidente/delegado) tiene control total
            if (user.role === 'admin') return next();

            const teamId = req.params.teamId || req.params.id || req.body.teamId;

            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo determinar el equipo para verificar permisos'
                });
            }

            const now = new Date();
            const TeamMembership = require('../../../models/team_membership.model');

            const roleFilter = {
                coach: { $in: ['head_coach', 'asst_coach'] },
                staff: { $in: ['head_coach', 'asst_coach', 'staff'] },
                any: { $in: ['head_coach', 'asst_coach', 'staff', 'scorekeeper'] }
            }[minRole] || { $in: ['head_coach', 'asst_coach', 'staff', 'scorekeeper'] };

            const membership = await TeamMembership.findOne({
                userId: user.id,
                teamId,
                role: roleFilter,
                status: 'active',
                $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
            });

            if (!membership) {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. No tienes permisos para operar en este equipo.'
                });
            }

            // Inyectar la membresía activa en el request para uso downstream
            req.teamMembership = membership;
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Requiere que el usuario sea estrictamente admin del club.
 */
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') return next();
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador del club.'
    });
}

module.exports = { requireTeamAccess, requireAdmin };
