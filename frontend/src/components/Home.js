import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Smooth scroll helper
const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = 80; // Header fixed height
        const targetPosition = element.offsetTop - headerHeight - 20;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

// Registration Modal for guest users
const RegistrationModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        nombre: '', email: '', telefono: '', edad: '', posicion: '',
        altura: '', peso: '', experiencia: '', terminos: false
    });
    const [enviado, setEnviado] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
        setTimeout(() => {
            setEnviado(false);
            onClose();
            setForm({
                nombre: '', email: '', telefono: '', edad: '', posicion: '',
                altura: '', peso: '', experiencia: '', terminos: false
            });
        }, 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content registration-modal">
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
                {!enviado ? (
                    <form className="registration-form" onSubmit={handleSubmit}>
                        <h2>Únete a Nuestro Equipo</h2>
                        <p>Completa el formulario y comienza tu viaje con nosotros.</p>
                        
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre Completo</label>
                            <input 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={form.nombre} 
                                onChange={handleChange} 
                                required 
                                placeholder="Tu nombre completo"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="tu@email.com"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input 
                                type="tel" 
                                id="telefono" 
                                name="telefono" 
                                value={form.telefono} 
                                onChange={handleChange} 
                                required 
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="edad">Edad</label>
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
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="posicion">Posición Preferida</label>
                                <select 
                                    id="posicion" 
                                    name="posicion" 
                                    value={form.posicion} 
                                    onChange={handleChange} 
                                    required
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
                                <label htmlFor="altura">Altura (cm)</label>
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
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="peso">Peso (kg)</label>
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
                        
                        <button type="submit" className="btn btn-primary btn-large btn-full">
                            Enviar Solicitud
                        </button>
                    </form>
                ) : (
                    <div className="modal-success">
                        <h3>¡Gracias por tu interés!</h3>
                        <p>Tu solicitud ha sido enviada. Te contactaremos pronto.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Home = () => {
    const { user } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [stats, setStats] = useState({
        players: 50,
        games: 25,
        years: 5
    });

    // Animate counters on load
    useEffect(() => {
        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 20);
        };

        // Start counter animations
        const playerCounter = document.getElementById('stat-players');
        const gameCounter = document.getElementById('stat-games');
        const yearCounter = document.getElementById('stat-years');
        
        if (playerCounter) animateCounter(playerCounter, stats.players);
        if (gameCounter) animateCounter(gameCounter, stats.games);
        if (yearCounter) animateCounter(yearCounter, stats.years);
    }, [stats]);

    return (
        <div className="home">
            {/* Hero Section */}
            <section id="inicio" className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h2>Únete al Mejor Equipo de Basketball</h2>
                            {user ? (
                                <div className="welcome-user">
                                    <p>¡Bienvenido de vuelta, {user.email}!</p>
                                    <p>Rol: {user.role === 'admin' ? 'Administrador' : 'Jugador'}</p>
                                </div>
                            ) : (
                                <p>
                                    Somos más que un equipo, somos una familia unida por la pasión del basketball. 
                                    Desarrollamos talento, formamos campeones y creamos memorias inolvidables.
                                </p>
                            )}
                            <div className="hero-actions">
                                {!user ? (
                                    <>
                                        <button 
                                            className="btn btn-primary btn-large" 
                                            onClick={() => setModalOpen(true)}
                                        >
                                            Únete Ahora
                                        </button>
                                        <button 
                                            className="btn btn-secondary btn-large"
                                            onClick={() => scrollToSection('galeria')}
                                        >
                                            Ver Galería
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/players" className="btn btn-primary btn-large">
                                            Ver Jugadores
                                        </Link>
                                        <Link to="/gallery" className="btn btn-secondary btn-large">
                                            Ver Galería
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="hero-stats">
                                <div className="stat">
                                    <h3 id="stat-players">0</h3>
                                    <p>Jugadores</p>
                                </div>
                                <div className="stat">
                                    <h3 id="stat-games">0</h3>
                                    <p>Partidos Ganados</p>
                                </div>
                                <div className="stat">
                                    <h3 id="stat-years">0</h3>
                                    <p>Años de Historia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="galeria" className="gallery">
                <div className="container">
                    <div className="section-header">
                        <h2>Galería de Momentos</h2>
                        <p>Revive los mejores momentos de nuestro equipo</p>
                    </div>
                    
                    <div className="gallery-container">
                        <div className="gallery-main">
                            <img 
                                id="main-image" 
                                src="/api/placeholder/600/400" 
                                alt="Imagen principal del equipo"
                            />
                        </div>
                        <div className="gallery-thumbnails">
                            <img 
                                src="/api/placeholder/200/150" 
                                alt="Equipo celebrando" 
                                className="thumbnail active"
                                onClick={() => {
                                    document.getElementById('main-image').src = '/api/placeholder/600/400';
                                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                                    event.target.classList.add('active');
                                }}
                            />
                            <img 
                                src="/api/placeholder/200/151" 
                                alt="Partido emocionante" 
                                className="thumbnail"
                                onClick={() => {
                                    document.getElementById('main-image').src = '/api/placeholder/600/401';
                                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                                    event.target.classList.add('active');
                                }}
                            />
                            <img 
                                src="/api/placeholder/200/152" 
                                alt="Entrenamiento" 
                                className="thumbnail"
                                onClick={() => {
                                    document.getElementById('main-image').src = '/api/placeholder/600/402';
                                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                                    event.target.classList.add('active');
                                }}
                            />
                        </div>
                    </div>
                    
                    {user && (
                        <div className="gallery-actions">
                            <Link to="/gallery" className="btn btn-primary">
                                Ver Galería Completa
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Players Section */}
            <section id="jugadores" className="players">
                <div className="container">
                    <div className="section-header">
                        <h2>Nuestros Jugadores</h2>
                        <p>Conoce a los atletas que forman parte de nuestro equipo</p>
                    </div>
                    
                    <div className="players-preview">
                        <div className="players-grid">
                            {/* Preview of players - would integrate with actual player data */}
                            <div className="player-card">
                                <div className="player-avatar">
                                    <img src="/api/placeholder/100/100" alt="Jugador" />
                                </div>
                                <div className="player-info">
                                    <h3>Carlos Rodríguez</h3>
                                    <p className="player-position">Point Guard</p>
                                    <div className="player-stats">
                                        <div className="stat">
                                            <span>Altura:</span>
                                            <span>185 cm</span>
                                        </div>
                                        <div className="stat">
                                            <span>Peso:</span>
                                            <span>78 kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="player-card">
                                <div className="player-avatar">
                                    <img src="/api/placeholder/100/101" alt="Jugador" />
                                </div>
                                <div className="player-info">
                                    <h3>Miguel Santos</h3>
                                    <p className="player-position">Shooting Guard</p>
                                    <div className="player-stats">
                                        <div className="stat">
                                            <span>Altura:</span>
                                            <span>190 cm</span>
                                        </div>
                                        <div className="stat">
                                            <span>Peso:</span>
                                            <span>82 kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="player-card">
                                <div className="player-avatar">
                                    <img src="/api/placeholder/100/102" alt="Jugador" />
                                </div>
                                <div className="player-info">
                                    <h3>Jorge López</h3>
                                    <p className="player-position">Center</p>
                                    <div className="player-stats">
                                        <div className="stat">
                                            <span>Altura:</span>
                                            <span>205 cm</span>
                                        </div>
                                        <div className="stat">
                                            <span>Peso:</span>
                                            <span>95 kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="players-actions">
                            <Link to="/players" className="btn btn-secondary">
                                Ver Todos los Jugadores
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Section */}
            {!user && (
                <section id="inscripcion" className="signup">
                    <div className="container">
                        <div className="signup-content">
                            <div className="signup-info">
                                <h2>Únete a Nuestro Equipo</h2>
                                <p>
                                    ¿Estás listo para formar parte de algo grande? Completa el formulario 
                                    y comienza tu viaje con nosotros.
                                </p>
                                <ul className="benefits-list">
                                    <li>✓ Entrenamiento profesional</li>
                                    <li>✓ Ambiente familiar y respetuoso</li>
                                    <li>✓ Desarrollo personal y deportivo</li>
                                    <li>✓ Participación en torneos</li>
                                    <li>✓ Equipamiento incluido</li>
                                </ul>
                            </div>
                            
                            <div className="signup-form-container">
                                <div className="signup-actions">
                                    <button 
                                        className="btn btn-primary btn-large btn-full"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Enviar Solicitud
                                    </button>
                                    <div className="auth-links">
                                        <p>¿Ya tienes cuenta?</p>
                                        <Link to="/login" className="btn btn-secondary">
                                            Iniciar Sesión
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Footer Section */}
            <section id="contacto" className="contact-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Basketball Team</h3>
                            <p>
                                Formando campeones dentro y fuera de la cancha. 
                                Únete a nuestra familia deportiva.
                            </p>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    📘
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    🐦
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    📷
                                </a>
                            </div>
                        </div>
                        
                        <div className="footer-section">
                            <h4>Enlaces Rápidos</h4>
                            <ul>
                                <li><button onClick={() => scrollToSection('inicio')}>Inicio</button></li>
                                <li><button onClick={() => scrollToSection('galeria')}>Galería</button></li>
                                <li><button onClick={() => scrollToSection('jugadores')}>Jugadores</button></li>
                                {!user && <li><button onClick={() => scrollToSection('inscripcion')}>Inscripción</button></li>}
                            </ul>
                        </div>
                        
                        <div className="footer-section">
                            <h4>Contacto</h4>
                            <div className="contact-info">
                                <p>📧 info@basketballteam.com</p>
                                <p>📞 +1 (555) 123-4567</p>
                                <p>📍 123 Sports Avenue, Ciudad</p>
                            </div>
                        </div>
                        
                        <div className="footer-section">
                            <h4>Horarios</h4>
                            <div className="schedule">
                                <p><strong>Entrenamientos:</strong></p>
                                <p>Lun - Vie: 6:00 PM - 9:00 PM</p>
                                <p>Sáb: 9:00 AM - 12:00 PM</p>
                                <p><strong>Partidos:</strong> Domingos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Home;
