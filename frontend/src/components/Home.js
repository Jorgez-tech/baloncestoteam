import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Enhanced Registration Modal for guest users
const RegistrationModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        nombre: '', email: '', telefono: '', edad: '', posicion: '',
        altura: '', peso: '', experiencia: '', terminos: false
    });
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setEnviado(true);
            setLoading(false);
            setTimeout(() => {
                setEnviado(false);
                onClose();
                setForm({
                    nombre: '', email: '', telefono: '', edad: '', posicion: '',
                    altura: '', peso: '', experiencia: '', terminos: false
                });
            }, 3000);
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content registration-modal">
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
                {!enviado ? (
                    <form className="registration-form" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Únete a Nuestro Equipo</h2>
                            <p>Completa el formulario y comienza tu viaje deportivo con nosotros.</p>
                        </div>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre Completo *</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={form.nombre} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Tu nombre completo"
                                    className="input-pro"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico *</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={form.email} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="tu@email.com"
                                    className="input-pro"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono *</label>
                                <input 
                                    type="tel" 
                                    id="telefono" 
                                    name="telefono" 
                                    value={form.telefono} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="+1 234 567 8900"
                                    className="input-pro"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edad">Edad *</label>
                                    <input 
                                        type="number" 
                                        id="edad" 
                                        name="edad" 
                                        value={form.edad} 
                                        onChange={handleChange} 
                                        required 
                                        min="16" 
                                        max="50" 
                                        placeholder="25"
                                        className="input-pro"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="posicion">Posición Preferida *</label>
                                    <select 
                                        id="posicion" 
                                        name="posicion" 
                                        value={form.posicion} 
                                        onChange={handleChange} 
                                        required
                                        className="input-pro"
                                    >
                                        <option value="">Selecciona una posición</option>
                                        <option value="Point Guard">Point Guard</option>
                                        <option value="Shooting Guard">Shooting Guard</option>
                                        <option value="Small Forward">Small Forward</option>
                                        <option value="Power Forward">Power Forward</option>
                                        <option value="Center">Center</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="altura">Altura (cm) *</label>
                                    <input 
                                        type="number" 
                                        id="altura" 
                                        name="altura" 
                                        value={form.altura} 
                                        onChange={handleChange} 
                                        required 
                                        min="150" 
                                        max="230" 
                                        placeholder="180"
                                        className="input-pro"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="peso">Peso (kg) *</label>
                                    <input 
                                        type="number" 
                                        id="peso" 
                                        name="peso" 
                                        value={form.peso} 
                                        onChange={handleChange} 
                                        required 
                                        min="50" 
                                        max="150" 
                                        placeholder="75"
                                        className="input-pro"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="experiencia">Experiencia Previa</label>
                                <textarea 
                                    id="experiencia" 
                                    name="experiencia" 
                                    value={form.experiencia} 
                                    onChange={handleChange} 
                                    rows="3"
                                    placeholder="Cuéntanos sobre tu experiencia en basketball..."
                                    className="input-pro"
                                />
                            </div>
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        id="terminos" 
                                        name="terminos" 
                                        checked={form.terminos} 
                                        onChange={handleChange} 
                                        required
                                    />
                                    <span className="checkmark"></span>
                                    Acepto los términos y condiciones
                                </label>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn-pro gradient-primary text-white"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </form>
                ) : (
                    <div className="modal-success">
                        <div className="success-icon">✅</div>
                        <h3>¡Gracias por tu interés!</h3>
                        <p>Tu solicitud ha sido enviada exitosamente. Te contactaremos pronto para coordinar una prueba.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Home = () => {
    const { user } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [stats] = useState({
        players: 50,
        games: 25,
        years: 5
    });

    // Enhanced counter animation with better performance
    useEffect(() => {
        const animateCounter = (element, target) => {
            if (!element) return;
            
            let current = 0;
            const increment = target / 60; // Smoother animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16); // 60fps
        };

        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const playerCounter = document.getElementById('stat-players');
                    const gameCounter = document.getElementById('stat-games');
                    const yearCounter = document.getElementById('stat-years');
                    
                    if (playerCounter) animateCounter(playerCounter, stats.players);
                    if (gameCounter) animateCounter(gameCounter, stats.games);
                    if (yearCounter) animateCounter(yearCounter, stats.years);
                    
                    observer.disconnect(); // Only animate once
                }
            });
        }, { threshold: 0.5 });

        const heroSection = document.getElementById('inicio');
        if (heroSection) {
            observer.observe(heroSection);
        }

        return () => observer.disconnect();
    }, [stats]);

    return (
        <div className="home">
            {/* Enhanced Hero Section */}
            <section id="inicio" className="hero-modern">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Únete al Mejor Equipo de Basketball
                            </h1>
                            {user ? (
                                <div className="welcome-user">
                                    <h2>¡Bienvenido de vuelta, {user.email?.split('@')[0]}!</h2>
                                    <p className="user-role-badge">
                                        {user.role === 'admin' ? '👑 Administrador' : '🏀 Jugador'}
                                    </p>
                                    <div className="quick-actions">
                                        <Link to="/players" className="btn-pro gradient-primary text-white">
                                            Ver Jugadores
                                        </Link>
                                        <Link to="/gallery" className="btn-pro bg-white text-primary border-primary">
                                            Explorar Galería
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="btn-pro bg-secondary text-white">
                                                Panel Admin
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="guest-content">
                                    <p className="hero-description">
                                        Somos más que un equipo, somos una familia unida por la pasión del basketball. 
                                        Desarrollamos talento, formamos campeones y creamos memorias inolvidables.
                                    </p>
                                    <div className="hero-actions">
                                        <button 
                                            className="btn-pro gradient-primary text-white interactive" 
                                            onClick={() => setModalOpen(true)}
                                        >
                                            🏀 Únete Ahora
                                        </button>
                                        <Link to="/players" className="btn-pro bg-white text-primary border-primary">
                                            Ver Nuestro Equipo
                                        </Link>
                                    </div>
                                    <div className="features-grid">
                                        <div className="feature-item">
                                            <span className="feature-icon">🏆</span>
                                            <span>Entrenamiento Profesional</span>
                                        </div>
                                        <div className="feature-item">
                                            <span className="feature-icon">👥</span>
                                            <span>Ambiente Familiar</span>
                                        </div>
                                        <div className="feature-item">
                                            <span className="feature-icon">📈</span>
                                            <span>Desarrollo Personal</span>
                                        </div>
                                        <div className="feature-item">
                                            <span className="feature-icon">🎯</span>
                                            <span>Competición de Elite</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="hero-visual">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3 id="stat-players" className="stat-number">0</h3>
                                    <p className="stat-label">Jugadores Activos</p>
                                </div>
                                <div className="stat-card">
                                    <h3 id="stat-games" className="stat-number">0</h3>
                                    <p className="stat-label">Partidos Ganados</p>
                                </div>
                                <div className="stat-card">
                                    <h3 id="stat-years" className="stat-number">0</h3>
                                    <p className="stat-label">Años de Historia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Access Section - Only for authenticated users */}
            {user && (
                <section className="quick-access">
                    <div className="container">
                        <h2 className="section-title">Acceso Rápido</h2>
                        <div className="quick-access-grid">
                            <Link to="/players" className="quick-access-card">
                                <div className="card-icon">👥</div>
                                <h3>Gestión de Jugadores</h3>
                                <p>Ver perfiles, estadísticas y información del equipo</p>
                            </Link>
                            <Link to="/gallery" className="quick-access-card">
                                <div className="card-icon">📷</div>
                                <h3>Galería de Momentos</h3>
                                <p>Revive los mejores momentos y actualizaciones</p>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="quick-access-card admin-card">
                                    <div className="card-icon">⚙️</div>
                                    <h3>Panel de Administración</h3>
                                    <p>Gestionar usuarios, contenido y configuración</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Team Showcase - For guests and members */}
            <section className="team-showcase">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nuestro Equipo</h2>
                        <p className="section-description">
                            Conoce a los atletas que hacen grande a nuestro equipo
                        </p>
                    </div>
                    
                    <div className="team-preview">
                        {/* Preview cards with placeholder data */}
                        <div className="team-grid">
                            <div className="player-card-modern">
                                <div className="player-avatar">
                                    <img src="/api/placeholder/120/120" alt="Carlos Rodríguez" />
                                </div>
                                <div className="player-info">
                                    <h3>Carlos Rodríguez</h3>
                                    <p className="player-position">Point Guard</p>
                                    <div className="player-stats-mini">
                                        <span>185cm</span>
                                        <span>78kg</span>
                                        <span>3 años</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="player-card-modern">
                                <div className="player-avatar">
                                    <img src="/api/placeholder/120/121" alt="Miguel Santos" />
                                </div>
                                <div className="player-info">
                                    <h3>Miguel Santos</h3>
                                    <p className="player-position">Shooting Guard</p>
                                    <div className="player-stats-mini">
                                        <span>190cm</span>
                                        <span>82kg</span>
                                        <span>2 años</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="player-card-modern">
                                <div className="player-avatar">
                                    <img src="/api/placeholder/120/122" alt="Jorge López" />
                                </div>
                                <div className="player-info">
                                    <h3>Jorge López</h3>
                                    <p className="player-position">Center</p>
                                    <div className="player-stats-mini">
                                        <span>205cm</span>
                                        <span>95kg</span>
                                        <span>4 años</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="section-action">
                            <Link to="/players" className="btn-pro gradient-secondary text-white">
                                Ver Equipo Completo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action - Only for guests */}
            {!user && (
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content">
                            <h2>¿Listo para formar parte de algo grande?</h2>
                            <p>
                                Únete a nuestro equipo y desarrolla tu potencial al máximo. 
                                Entrenamiento profesional, ambiente familiar y oportunidades de crecimiento te esperan.
                            </p>
                            <div className="cta-actions">
                                <button 
                                    className="btn-pro gradient-primary text-white interactive" 
                                    onClick={() => setModalOpen(true)}
                                >
                                    Enviar Solicitud
                                </button>
                                <Link to="/login" className="btn-pro bg-white text-primary border-primary">
                                    ¿Ya tienes cuenta? Inicia sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Home;
