import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Modal de contacto
const ContactModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
    const [enviado, setEnviado] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
        setTimeout(() => {
            setEnviado(false);
            onClose();
            setForm({ nombre: '', email: '', mensaje: '' });
        }, 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
                {!enviado ? (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Únete al equipo</h2>
                        <label>
                            Nombre
                            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                        </label>
                        <label>
                            Email
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </label>
                        <label>
                            Mensaje
                            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required />
                        </label>
                        <button type="submit" className="btn-primary">Enviar</button>
                    </form>
                ) : (
                    <div className="modal-success">
                        <h3>¡Gracias por tu interés!</h3>
                        <p>Tu mensaje ha sido enviado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Home = () => {
    const { user } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

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
                                <button className="btn-primary" onClick={() => setModalOpen(true)}>
                                    Únete al Equipo
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

            <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            {/* ...existing code... */}

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
        </div>
    );
};

export default Home;
