import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { playersAPI, usersAPI } from '../api/client';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

/**
 * Panel de Administración Completo
 * Características de seguridad:
 * - Verificación de rol admin
 * - Validación de formularios
 * - Confirmación para acciones destructivas
 * - Logs de auditoría
 * - Manejo de errores robusto
 */
const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const isDevMode = process.env.NODE_ENV !== 'production';
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalPlayers: 0,
        totalUsers: 0,
        activeUsers: 0,
        totalImages: 0
    });

    // Estados para gestión
    const [players, setPlayers] = useState([]);
    const [users, setUsers] = useState([]);
    const [usersError, setUsersError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'player', 'user', 'delete'
    const [editingItem, setEditingItem] = useState(null);

    // Form states
    const [playerForm, setPlayerForm] = useState({
        name: '',
        position: '',
        number: '',
        height: '',
        weight: '',
        age: '',
        team: ''
    });

    const [userForm, setUserForm] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        role: 'user'
    });

    // Verificación de seguridad
    useEffect(() => {
        if (!isAdmin) {
            toast.error('Acceso denegado. Se requieren permisos de administrador.');
            return;
        }
        loadDashboardData();
        logAdminAccess();
    }, [isAdmin]);

    // Log de auditoría para acceso al panel
    const logAdminAccess = () => {
        if (isDevMode) {
            console.info(`[AUDIT] Admin access: ${user?.email} at ${new Date().toISOString()}`);
        }
        // Aquí podrías enviar al backend para logging persistente
    };

    // Carga datos del dashboard
    const loadDashboardData = async () => {
        setLoading(true);
        try {
            setUsersError(null);
            const normalizeCollectionResponse = (response) => {
                if (!response) return [];
                if (Array.isArray(response?.data?.data)) return response.data.data;
                if (Array.isArray(response?.data)) return response.data;
                return [];
            };

            const [playersResult, usersResult] = await Promise.allSettled([
                playersAPI.getAll(),
                usersAPI.getAll()
            ]);

            let playersData = [];
            if (playersResult.status === 'fulfilled') {
                playersData = normalizeCollectionResponse(playersResult.value);
                setPlayers(playersData);
            } else {
                console.error('Error al cargar jugadores:', playersResult.reason);
                toast.error('No se pudieron cargar los jugadores');
            }

            let usersData = [];
            if (usersResult.status === 'fulfilled') {
                usersData = normalizeCollectionResponse(usersResult.value);
                setUsers(usersData);
                setUsersError(null);
            } else {
                if (isDevMode) {
                    console.warn('Gestión de usuarios no disponible:', usersResult.reason);
                }
                setUsers([]);
                if (usersResult.reason?.response?.status === 403) {
                    setUsersError('Tu sesión no tiene permisos para gestionar usuarios.');
                } else {
                    setUsersError('No se pudieron cargar los usuarios. Intenta nuevamente más tarde.');
                    toast.error('No se pudieron cargar los usuarios');
                }
            }

            setStats({
                totalPlayers: playersData.length,
                totalUsers: usersData.length,
                activeUsers: usersData.filter(u => u.isActive).length,
                totalImages: 0
            });
        } catch (error) {
            console.error('Error inesperado al cargar el dashboard:', error);
            toast.error('Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Validaciones de formularios
    const validatePlayerForm = () => {
        const { name, position, number, height, weight } = playerForm;

        if (!name || !position || !number || !height || !weight) {
            toast.error('Todos los campos obligatorios deben completarse');
            return false;
        }

        if (isNaN(number) || number < 1 || number > 99) {
            toast.error('El número debe estar entre 1 y 99');
            return false;
        }

        if (isNaN(height) || height < 150 || height > 230) {
            toast.error('La altura debe estar entre 150 y 230 cm');
            return false;
        }

        if (isNaN(weight) || weight < 50 || weight > 200) {
            toast.error('El peso debe estar entre 50 y 200 kg');
            return false;
        }

        // Verificar número único (usar jersey_number del modelo)
        const numberExists = players.some(p =>
            p.jersey_number === parseInt(number) && p._id !== editingItem?._id
        );
        if (numberExists) {
            toast.error('Ya existe un jugador con ese número');
            return false;
        }

        return true;
    };

    const validateUserForm = () => {
        const { email, username } = userForm;

        if (!email || !username) {
            toast.error('Email y nombre de usuario son obligatorios');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Email no válido');
            return false;
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        if (!usernameRegex.test(username)) {
            toast.error('Username debe tener 3-30 caracteres (solo letras, números y _)');
            return false;
        }

        return true;
    };

    // Mapeo de posiciones español -> inglés
    const mapPositionToEnglish = (position) => {
        const mapping = {
            'Base': 'Point Guard',
            'Escolta': 'Shooting Guard',
            'Alero': 'Small Forward',
            'Ala-Pívot': 'Power Forward',
            'Pívot': 'Center'
        };
        return mapping[position] || position;
    };

    // Handlers para jugadores
    const handleCreatePlayer = async () => {
        if (!validatePlayerForm()) return;

        setLoading(true);
        try {
            const playerData = {
                name: playerForm.name,
                position: mapPositionToEnglish(playerForm.position),
                jersey_number: parseInt(playerForm.number), // Cambiar 'number' a 'jersey_number'
                height: parseFloat(playerForm.height),
                weight: parseFloat(playerForm.weight),
                age: playerForm.age ? parseInt(playerForm.age) : undefined,
                user_id: user._id, // Agregar user_id requerido
                team: playerForm.team || undefined
            };

            const response = await playersAPI.create(playerData);

            if (response.data.success) {
                toast.success('Jugador creado exitosamente');
                logAuditAction('CREATE_PLAYER', playerForm.name);
                setShowModal(false);
                resetPlayerForm();
                loadDashboardData();
            }
        } catch (error) {
            console.error('Error creating player:', error);
            toast.error(error.response?.data?.message || 'Error al crear jugador');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlayer = async () => {
        if (!validatePlayerForm() || !editingItem) return;

        setLoading(true);
        try {
            const playerData = {
                name: playerForm.name,
                position: mapPositionToEnglish(playerForm.position),
                jersey_number: parseInt(playerForm.number), // Cambiar 'number' a 'jersey_number'
                height: parseFloat(playerForm.height),
                weight: parseFloat(playerForm.weight),
                age: playerForm.age ? parseInt(playerForm.age) : undefined,
                team: playerForm.team || undefined
            };

            const response = await playersAPI.update(editingItem._id, playerData);

            if (response.data.success) {
                toast.success('Jugador actualizado exitosamente');
                logAuditAction('UPDATE_PLAYER', playerForm.name);
                setShowModal(false);
                resetPlayerForm();
                loadDashboardData();
            }
        } catch (error) {
            console.error('Error updating player:', error);
            toast.error(error.response?.data?.message || 'Error al actualizar jugador');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlayer = async (player) => {
        if (!window.confirm(`¿Estás seguro de eliminar al jugador ${player.name}?`)) {
            return;
        }

        setLoading(true);
        try {
            await playersAPI.delete(player._id);
            toast.success('Jugador eliminado exitosamente');
            logAuditAction('DELETE_PLAYER', player.name);
            loadDashboardData();
        } catch (error) {
            console.error('Error deleting player:', error);
            toast.error('Error al eliminar jugador');
        } finally {
            setLoading(false);
        }
    };

    // Handlers para usuarios
    const handleUpdateUser = async () => {
        if (!validateUserForm() || !editingItem) return;

        setLoading(true);
        try {
            await usersAPI.update(editingItem._id, userForm);
            toast.success('Usuario actualizado exitosamente');
            logAuditAction('UPDATE_USER', userForm.email);
            setShowModal(false);
            resetUserForm();
            loadDashboardData();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error.response?.data?.message || 'Error al actualizar usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userToDelete) => {
        if (userToDelete._id === user._id) {
            toast.error('No puedes eliminar tu propia cuenta');
            return;
        }

        if (!window.confirm(`¿Estás seguro de eliminar al usuario ${userToDelete.email}?`)) {
            return;
        }

        setLoading(true);
        try {
            await usersAPI.delete(userToDelete._id);
            toast.success('Usuario eliminado exitosamente');
            logAuditAction('DELETE_USER', userToDelete.email);
            loadDashboardData();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Error al eliminar usuario');
        } finally {
            setLoading(false);
        }
    };

    // Utilidades
    const logAuditAction = (action, target) => {
        const auditLog = {
            action,
            target,
            adminUser: user?.email,
            timestamp: new Date().toISOString(),
            ip: 'client-side' // En producción, obtener del backend
        };
        if (isDevMode) {
            console.info('[AUDIT]', auditLog);
        }
        // Enviar al backend para persistir
    };

    const resetPlayerForm = () => {
        setPlayerForm({
            name: '',
            position: '',
            number: '',
            height: '',
            weight: '',
            age: '',
            team: ''
        });
        setEditingItem(null);
    };

    const resetUserForm = () => {
        setUserForm({
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            role: 'user'
        });
        setEditingItem(null);
    };

    // Mapeo de posiciones inglés -> español
    const mapPositionToSpanish = (position) => {
        const mapping = {
            'Point Guard': 'Base',
            'Shooting Guard': 'Escolta',
            'Small Forward': 'Alero',
            'Power Forward': 'Ala-Pívot',
            'Center': 'Pívot'
        };
        return mapping[position] || position;
    };

    const openPlayerModal = (player = null) => {
        if (player) {
            setPlayerForm({
                name: player.name || '',
                position: mapPositionToSpanish(player.position) || '', // Convertir a español
                number: player.jersey_number?.toString() || '', // Usar jersey_number
                height: player.height?.toString() || '',
                weight: player.weight?.toString() || '',
                age: player.age?.toString() || '',
                team: player.team || ''
            });
            setEditingItem(player);
        } else {
            resetPlayerForm();
        }
        setModalType('player');
        setShowModal(true);
    };

    const openUserModal = (userToEdit) => {
        setUserForm({
            email: userToEdit.email || '',
            username: userToEdit.username || '',
            firstName: userToEdit.firstName || '',
            lastName: userToEdit.lastName || '',
            role: userToEdit.role || 'user'
        });
        setEditingItem(userToEdit);
        setModalType('user');
        setShowModal(true);
    };

    // Verificación de acceso
    if (!isAdmin) {
        return (
            <div className="admin-access-denied">
                <h2>🚫 Acceso Denegado</h2>
                <p>Se requieren permisos de administrador para acceder a esta página.</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>🏀 Panel de Administración</h1>
                <p>Bienvenido, {user?.email}</p>
            </div>

            {/* Navegación por pestañas */}
            <nav className="admin-tabs">
                <button
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Resumen
                </button>
                <button
                    className={activeTab === 'players' ? 'active' : ''}
                    onClick={() => setActiveTab('players')}
                >
                    🏀 Jugadores
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Usuarios
                </button>
                <button
                    className={activeTab === 'audit' ? 'active' : ''}
                    onClick={() => setActiveTab('audit')}
                >
                    📝 Auditoría
                </button>
            </nav>

            {/* Contenido del dashboard */}
            <div className="admin-content">
                {loading && <div className="loading-overlay">Cargando...</div>}

                {/* Pestaña de Resumen */}
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <h2>📊 Estadísticas del Sistema</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>👥 Total Usuarios</h3>
                                <p className="stat-number">{stats.totalUsers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>✅ Usuarios Activos</h3>
                                <p className="stat-number">{stats.activeUsers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>🏀 Total Jugadores</h3>
                                <p className="stat-number">{stats.totalPlayers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>📷 Total Imágenes</h3>
                                <p className="stat-number">{stats.totalImages}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña de Jugadores */}
                {activeTab === 'players' && (
                    <div className="players-tab">
                        <div className="tab-header">
                            <h2>🏀 Gestión de Jugadores</h2>
                            <button
                                className="btn-primary"
                                onClick={() => openPlayerModal()}
                            >
                                ➕ Agregar Jugador
                            </button>
                        </div>

                        <div className="players-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Posición</th>
                                        <th>Número</th>
                                        <th>Altura</th>
                                        <th>Peso</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                                {loading ? 'Cargando jugadores...' : 'No hay jugadores registrados'}
                                            </td>
                                        </tr>
                                    ) : (
                                        players.map(player => (
                                            <tr key={player._id}>
                                                <td>{player.name}</td>
                                                <td>{mapPositionToSpanish(player.position)}</td>
                                                <td>#{player.jersey_number ?? 'N/A'}</td>
                                                <td>{player.height != null ? `${player.height} cm` : 'N/D'}</td>
                                                <td>{player.weight != null ? `${player.weight} kg` : 'N/D'}</td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => openPlayerModal(player)}
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDeletePlayer(player)}
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pestaña de Usuarios */}
                {activeTab === 'users' && (
                    <div className="users-tab">
                        <h2>👥 Gestión de Usuarios</h2>

                        {usersError ? (
                            <div className="users-table users-table--empty">
                                <p>{usersError}</p>
                                <button
                                    className="btn-secondary"
                                    type="button"
                                    onClick={loadDashboardData}
                                    style={{ marginTop: '12px' }}
                                >
                                    Reintentar carga
                                </button>
                            </div>
                        ) : (
                            <div className="users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Username</th>
                                            <th>Rol</th>
                                            <th>Estado</th>
                                            <th>Registro</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                                    {loading ? 'Cargando usuarios...' : 'No hay usuarios disponibles'}
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map(userItem => (
                                                <tr key={userItem._id}>
                                                    <td>{userItem.email}</td>
                                                    <td>{userItem.username}</td>
                                                    <td>
                                                        <span className={`role-badge role-${userItem.role}`}>
                                                            {userItem.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${userItem.isActive ? 'active' : 'inactive'}`}>
                                                            {userItem.isActive ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => openUserModal(userItem)}
                                                            title="Editar usuario"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        {userItem._id !== user._id && (
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDeleteUser(userItem)}
                                                                title="Eliminar usuario"
                                                            >
                                                                🗑️ Eliminar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Pestaña de Auditoría */}
                {activeTab === 'audit' && (
                    <div className="audit-tab">
                        <h2>📝 Registro de Auditoría</h2>
                        <p>🚧 Funcionalidad en desarrollo. Los logs se muestran en la consola del navegador.</p>
                        <div className="audit-info">
                            <h3>Acciones registradas:</h3>
                            <ul>
                                <li>✅ Acceso al panel de administración</li>
                                <li>✅ Creación de jugadores</li>
                                <li>✅ Modificación de jugadores</li>
                                <li>✅ Eliminación de jugadores</li>
                                <li>✅ Modificación de usuarios</li>
                                <li>✅ Eliminación de usuarios</li>
                            </ul>
                            <p><strong>Nota:</strong> En producción, estos logs se almacenarían en el backend para análisis de seguridad.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para formularios */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {modalType === 'player'
                                    ? (editingItem ? 'Editar Jugador' : 'Crear Jugador')
                                    : 'Editar Usuario'
                                }
                            </h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ✖
                            </button>
                        </div>

                        <div className="modal-body">
                            {modalType === 'player' && (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    editingItem ? handleUpdatePlayer() : handleCreatePlayer();
                                }}>
                                    <div className="form-grid">
                                        <label>
                                            Nombre *
                                            <input
                                                type="text"
                                                value={playerForm.name}
                                                onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Posición *
                                            <select
                                                value={playerForm.position}
                                                onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
                                                required
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="Base">Base</option>
                                                <option value="Escolta">Escolta</option>
                                                <option value="Alero">Alero</option>
                                                <option value="Ala-Pívot">Ala-Pívot</option>
                                                <option value="Pívot">Pívot</option>
                                            </select>
                                        </label>

                                        <label>
                                            Número *
                                            <input
                                                type="number"
                                                min="1"
                                                max="99"
                                                value={playerForm.number}
                                                onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Altura (cm) *
                                            <input
                                                type="number"
                                                min="150"
                                                max="230"
                                                value={playerForm.height}
                                                onChange={(e) => setPlayerForm({ ...playerForm, height: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Peso (kg) *
                                            <input
                                                type="number"
                                                min="50"
                                                max="200"
                                                value={playerForm.weight}
                                                onChange={(e) => setPlayerForm({ ...playerForm, weight: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Edad
                                            <input
                                                type="number"
                                                min="16"
                                                max="50"
                                                value={playerForm.age}
                                                onChange={(e) => setPlayerForm({ ...playerForm, age: e.target.value })}
                                            />
                                        </label>
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear')}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {modalType === 'user' && (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateUser();
                                }}>
                                    <div className="form-grid">
                                        <label>
                                            Email *
                                            <input
                                                type="email"
                                                value={userForm.email}
                                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Username *
                                            <input
                                                type="text"
                                                value={userForm.username}
                                                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>
                                            Nombre
                                            <input
                                                type="text"
                                                value={userForm.firstName}
                                                onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                                            />
                                        </label>

                                        <label>
                                            Apellido
                                            <input
                                                type="text"
                                                value={userForm.lastName}
                                                onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                                            />
                                        </label>

                                        <label>
                                            Rol
                                            <select
                                                value={userForm.role}
                                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                            >
                                                <option value="user">Usuario</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Guardando...' : 'Actualizar'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
