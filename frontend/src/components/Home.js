import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Bienvenido al Equipo de Basketball</h1>
                    {user ? (
                        <div className="welcome-user">
                            <p>¡Hola {user.email}!</p>
                            <p>Rol: {user.role === 'admin' ? 'Administrador' : 'Jugador'}</p>
                        </div>
                    ) : (
                        <p>
                            Únete a nosotros en esta increíble aventura deportiva.
                            Somos más que un equipo, somos una familia.
                        </p>
                    )}
                    <div className="hero-buttons">
                        {!user ? (
                            <>
                                <button className="btn-primary">
                                    Únete al Equipo
                                </button>
                                <button className="btn-secondary">
                                    Ver Jugadores
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary">
                                    Ver Mi Perfil
                                </button>
                                <button className="btn-secondary">
                                    Ver Equipo
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="/api/placeholder/600/400"
                        alt="Equipo de Basketball"
                    />
                </div>
            </section>

            {/* Test Credentials Section - Solo mostrar si no está logueado */}
            {!user && (
                <section className="test-credentials">
                    <div className="container">
                        <h2>🔐 Credenciales de Prueba</h2>
                        <p>Puedes usar estas credenciales para probar la aplicación:</p>
                        <div className="credentials-grid">
                            <div className="credential-card admin">
                                <h3>👨‍💼 Administrador</h3>
                                <p><strong>Email:</strong> admin@basketballteam.com</p>
                                <p><strong>Password:</strong> admin123</p>
                                <p>Acceso completo al sistema</p>
                            </div>
                            <div className="credential-card player">
                                <h3>🏀 Jugador 1</h3>
                                <p><strong>Email:</strong> player1@basketballteam.com</p>
                                <p><strong>Password:</strong> player123</p>
                                <p>Juan Carlos Rodriguez - Point Guard</p>
                            </div>
                            <div className="credential-card player">
                                <h3>🏀 Jugador 2</h3>
                                <p><strong>Email:</strong> player2@basketballteam.com</p>
                                <p><strong>Password:</strong> player123</p>
                                <p>Miguel Angel Torres - Shooting Guard</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-container">
                    <div className="stat-item">
                        <h3>50+</h3>
                        <p>Jugadores</p>
                    </div>
                    <div className="stat-item">
                        <h3>25</h3>
                        <p>Partidos Ganados</p>
                    </div>
                    <div className="stat-item">
                        <h3>5</h3>
                        <p>Años de Historia</p>
                    </div>
                    <div className="stat-item">
                        <h3>100%</h3>
                        <p>Dedicación</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-container">
                    <h2>¿Por qué elegir nuestro equipo?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>Entrenamiento Profesional</h3>
                            <p>
                                Contamos con entrenadores certificados y métodos
                                de entrenamiento de última generación.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤝</div>
                            <h3>Ambiente Familiar</h3>
                            <p>
                                Fomentamos un ambiente de respeto, compañerismo
                                y crecimiento personal.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3>Desarrollo Personal</h3>
                            <p>
                                No solo desarrollamos habilidades deportivas,
                                sino también valores y liderazgo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-content">
                    <h2>¿Listo para unirte?</h2>
                    <p>
                        Comienza tu viaje con nosotros hoy mismo.
                        Regístrate y sé parte de algo grande.
                    </p>
                    <button className="btn-primary large">
                        Registrarse Ahora
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
