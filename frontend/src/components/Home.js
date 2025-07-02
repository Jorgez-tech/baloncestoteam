import React from 'react';

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Bienvenido al Equipo de Basketball</h1>
                    <p>
                        Únete a nosotros en esta increíble aventura deportiva.
                        Somos más que un equipo, somos una familia.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary">
                            Únete al Equipo
                        </button>
                        <button className="btn-secondary">
                            Ver Jugadores
                        </button>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="/api/placeholder/600/400"
                        alt="Equipo de Basketball"
                    />
                </div>
            </section>

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
