import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { playersAPI } from '../api/client';
import '../styles/PlayerProfile.css';

const PlayerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Query para obtener los datos del jugador
    const {
        data: playerData,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery(
        ['player', id],
        () => playersAPI.getById(id),
        {
            enabled: !!id,
            retry: 2,
            onError: (error) => {
                console.error('Error fetching player:', error);
            }
        }
    );

    // Estados de carga y error
    if (isLoading) {
        return (
            <div className="player-profile">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando información del jugador...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="player-profile">
                <div className="error-container">
                    <h2>Error al cargar jugador</h2>
                    <p>{error?.response?.data?.message || 'No se pudo cargar la información del jugador'}</p>
                    <div className="error-actions">
                        <button onClick={() => refetch()} className="btn btn-primary">
                            Intentar de nuevo
                        </button>
                        <button onClick={() => navigate('/players')} className="btn btn-secondary">
                            Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const player = playerData?.data?.data;

    if (!player) {
        return (
            <div className="player-profile">
                <div className="error-container">
                    <h2>Jugador no encontrado</h2>
                    <p>El jugador que buscas no existe o ha sido eliminado.</p>
                    <button onClick={() => navigate('/players')} className="btn btn-primary">
                        Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'No especificado';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para formatear altura
    const formatHeight = (height) => {
        if (!height) return 'No especificado';
        return `${height} cm`;
    };

    // Función para formatear peso
    const formatWeight = (weight) => {
        if (!weight) return 'No especificado';
        return `${weight} kg`;
    };

    return (
        <div className="player-profile">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <span onClick={() => navigate('/')} className="breadcrumb-item">
                    🏠 Inicio
                </span>
                <span className="breadcrumb-separator">›</span>
                <span onClick={() => navigate('/players')} className="breadcrumb-item">
                    👥 Jugadores
                </span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">
                    {player ? `👤 ${player.name}` : 'Cargando...'}
                </span>
            </nav>

            {/* Header con navegación */}
            <div className="profile-header">
                <button
                    onClick={() => navigate('/players')}
                    className="btn btn-back"
                >
                    ← Volver a la lista
                </button>
                <h1>Perfil del Jugador</h1>
                <div className="header-actions">
                    <button
                        onClick={() => refetch()}
                        className="btn btn-refresh"
                        title="Actualizar información"
                    >
                        🔄 Actualizar
                    </button>
                </div>
            </div>            {/* Información principal del jugador */}
            <div className="profile-content">
                <div className="profile-main">
                    <div className="player-card">
                        <div className="player-avatar">
                            <img
                                src={player.photo || '/default-avatar.svg'}
                                alt={player.name}
                                onError={(e) => {
                                    e.target.src = '/default-avatar.svg';
                                }}
                            />
                        </div>
                        <div className="player-info">
                            <h2>{player.name}</h2>
                            <p className="player-position">{player.position}</p>
                            {player.user_id && (
                                <div className="user-info">
                                    <span className="user-email">
                                        📧 {player.user_id.email}
                                    </span>
                                    <span className={`user-status ${player.user_id.isActive ? 'active' : 'inactive'}`}>
                                        {player.user_id.isActive ? '🟢 Activo' : '🔴 Inactivo'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información física */}
                    <div className="info-section">
                        <h3>Información Física</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Altura:</label>
                                <span>{formatHeight(player.height)}</span>
                            </div>
                            <div className="info-item">
                                <label>Peso:</label>
                                <span>{formatWeight(player.weight)}</span>
                            </div>
                            <div className="info-item">
                                <label>Fecha de nacimiento:</label>
                                <span>{formatDate(player.birthdate)}</span>
                            </div>
                            <div className="info-item">
                                <label>Número de camiseta:</label>
                                <span>{player.jersey_number || 'No asignado'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    {player.stats && (
                        <div className="info-section">
                            <h3>Estadísticas por Partido</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-value">{player.stats.points_per_game || 0}</span>
                                    <span className="stat-label">Puntos</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{player.stats.rebounds_per_game || 0}</span>
                                    <span className="stat-label">Rebotes</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{player.stats.assists_per_game || 0}</span>
                                    <span className="stat-label">Asistencias</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{player.stats.games_played || 0}</span>
                                    <span className="stat-label">Partidos</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Métricas calculadas */}
                    {player.metrics && (
                        <div className="info-section">
                            <h3>Totales de Temporada</h3>
                            <div className="metrics-grid">
                                <div className="metric-item">
                                    <span className="metric-value">{player.metrics.total_points}</span>
                                    <span className="metric-label">Puntos Totales</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-value">{player.metrics.total_rebounds}</span>
                                    <span className="metric-label">Rebotes Totales</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-value">{player.metrics.total_assists}</span>
                                    <span className="metric-label">Asistencias Totales</span>
                                </div>
                                <div className="metric-item efficiency">
                                    <span className="metric-value">{player.metrics.efficiency}</span>
                                    <span className="metric-label">Eficiencia</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="info-section">
                        <h3>Información Adicional</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Registrado el:</label>
                                <span>{formatDate(player.createdAt)}</span>
                            </div>
                            <div className="info-item">
                                <label>Última actualización:</label>
                                <span>{formatDate(player.updatedAt)}</span>
                            </div>
                            {player.user_id?.createdAt && (
                                <div className="info-item">
                                    <label>Usuario creado:</label>
                                    <span>{formatDate(player.user_id.createdAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfile;
