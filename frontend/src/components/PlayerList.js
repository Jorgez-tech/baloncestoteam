import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { playersAPI } from '../api/client';

const PlayerList = () => {
    const navigate = useNavigate();
    const {
        data: playersData,
        isLoading,
        error,
        refetch
    } = useQuery('players', () => playersAPI.getAll());

    // Función para navegar al perfil del jugador
    const handlePlayerClick = (playerId) => {
        navigate(`/players/${playerId}`);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando jugadores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>Error al cargar jugadores</h3>
                <p>{error.response?.data?.msg || 'Error desconocido'}</p>
                <button onClick={refetch} className="btn-primary">
                    Reintentar
                </button>
            </div>
        );
    }

    const players = playersData?.data?.data || [];

    return (
        <div className="player-list">
            <div className="player-list-header">
                <h2>Nuestros Jugadores</h2>
                <p>Conoce a los integrantes de nuestro equipo</p>
                <div className="list-stats">
                    <div className="stat-chip">
                        <span className="stat-number">{players.length}</span>
                        <span className="stat-text">Jugadores</span>
                    </div>
                    {playersData?.data?.meta?.total && (
                        <div className="stat-chip">
                            <span className="stat-number">{playersData.data.meta.total}</span>
                            <span className="stat-text">Total</span>
                        </div>
                    )}
                </div>
            </div>

            {players.length === 0 ? (
                <div className="empty-state">
                    <h3>No hay jugadores registrados</h3>
                    <p>Sé el primero en unirte al equipo</p>
                </div>
            ) : (
                <div className="players-grid">
                    {players.map((player) => (
                        <div
                            key={player._id}
                            className="player-card clickable"
                            onClick={() => handlePlayerClick(player._id)}
                            title={`Ver perfil de ${player.name}`}
                        >
                            <div className="player-avatar">
                                <img
                                    src={player.avatar || '/default-avatar.svg'}
                                    alt={`${player.name || 'Jugador'}`}
                                />
                            </div>

                            <div className="player-info">
                                <h3>{player.name || 'Nombre no disponible'}</h3>
                                <p className="player-position">{player.position}</p>

                                <div className="player-stats">
                                    <div className="stat">
                                        <span className="stat-label">Altura:</span>
                                        <span className="stat-value">{player.height} cm</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Peso:</span>
                                        <span className="stat-value">{player.weight} kg</span>
                                    </div>
                                </div>

                                {player.stats && (
                                    <div className="player-performance">
                                        <h4>Estadísticas</h4>
                                        <div className="performance-stats">
                                            <div className="perf-stat">
                                                <span>Partidos:</span>
                                                <span>{player.stats.games_played || 0}</span>
                                            </div>
                                            <div className="perf-stat">
                                                <span>Puntos/Partido:</span>
                                                <span>{player.stats.points_per_game || 0}</span>
                                            </div>
                                            <div className="perf-stat">
                                                <span>Rebotes/Partido:</span>
                                                <span>{player.stats.rebounds_per_game || 0}</span>
                                            </div>
                                            <div className="perf-stat">
                                                <span>Asistencias/Partido:</span>
                                                <span>{player.stats.assists_per_game || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botón para ver más detalles */}
                                <div className="player-actions">
                                    <button
                                        className="btn btn-primary view-profile-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayerClick(player._id);
                                        }}
                                    >
                                        Ver Perfil Completo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {playersData?.data?.meta?.total > playersData?.data?.meta?.limit && (
                <div className="pagination">
                    {/* Add pagination controls here */}
                    <p>
                        Mostrando {players.length} de {playersData.data.meta.total} jugadores
                    </p>
                </div>
            )}
        </div>
    );
};

export default PlayerList;
