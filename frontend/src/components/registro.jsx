import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validación de contraseñas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const result = await register({
            email: formData.email,
            username: formData.username,
            password: formData.password
        });

        if (result.success) {
            setSuccessMessage(result.message || 'Cuenta creada exitosamente. Por favor inicia sesión.');
            // Limpiar el formulario
            setFormData({
                email: '',
                username: '',
                password: '',
                confirmPassword: ''
            });
            // Opcional: redirigir a login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(result.error || 'Error al crear la cuenta');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    return (
        <>
            <div className="hero_area">
                {/* header section starts */}
                <header className="header_section">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg custom_nav-container ">
                            <a className="navbar-brand" href="/">
                                <span>BaloncestoTeam</span>
                            </a>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon" />
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/nosotros">Nosotros</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/jugadores">Jugadores</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/contacto">Contácto</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                                        </li>
                                    </ul>
                                    <div className="quote_btn-container">
                                        <a href="#" className="cart_link">
                                            <i className="fa fa-cart-arrow-down" aria-hidden="true" />
                                            <span className="cart_number">0</span>
                                        </a>
                                        <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
                                            <button className="btn nav_search-btn" type="submit">
                                                <i className="fa fa-search" aria-hidden="true" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
                {/* end header section */}
            </div>

            {/* registro section */}
            <section className="contact_section">
                <div className="contact_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="contact_form layout_padding">
                                    <div className="heading_container heading_center">
                                        <h2>Crear Cuenta</h2>
                                        <p style={{ marginTop: '10px', fontSize: '16px', color: '#666' }}>
                                            Únete a la comunidad de BaloncestoTeam
                                        </p>
                                    </div>

                                    {error && (
                                        <div style={{
                                            backgroundColor: '#f8d7da',
                                            color: '#721c24',
                                            padding: '12px',
                                            borderRadius: '4px',
                                            marginBottom: '15px',
                                            border: '1px solid #f5c6cb'
                                        }}>
                                            {error}
                                        </div>
                                    )}

                                    {successMessage && (
                                        <div style={{
                                            backgroundColor: '#d4edda',
                                            color: '#155724',
                                            padding: '12px',
                                            borderRadius: '4px',
                                            marginBottom: '15px',
                                            border: '1px solid #c3e6cb'
                                        }}>
                                            {successMessage}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Nombre de usuario"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            minLength={3}
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo electrónico"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                        <div className="top_input">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Contraseña (mínimo 6 caracteres)"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #ddd',
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirmar contraseña"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                        <div className="btn-box">
                                            <button type="submit" disabled={loading}>
                                                {loading ? 'Creando cuenta...' : 'Registrarse'}
                                            </button>
                                        </div>
                                    </form>

                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <p>
                                            ¿Ya tienes cuenta?{' '}
                                            <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* info section */}
            <section className="info_section layout_padding2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="logo_detail">
                                <div className="logo-box">
                                    <a className="navbar-brand" href="/">
                                        <span>BaloncestoTeam</span>
                                    </a>
                                </div>
                                <p>
                                    Crea tu cuenta para acceder a todas las funcionalidades del club. ¡Únete a nuestra comunidad deportiva!
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-3 mx-auto">
                            <div className="address_box">
                                <h5>Dirección</h5>
                                <a href="#"><i className="fa fa-map-marker" aria-hidden="true" />Calle 123, Ciudad Deportiva</a>
                                <a href="#"><i className="fa fa-phone" aria-hidden="true" />(+57) 3001234567</a>
                                <a href="#"><i className="fa fa-envelope" aria-hidden="true" />contacto@baloncestoteam.com</a>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info_form">
                                <h5>Newsletter</h5>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <input type="text" placeholder="Ingresa tu correo" />
                                    <button type="submit">Suscribirse</button>
                                </form>
                            </div>
                            <div className="social_box">
                                <a href="#"><i className="fa fa-facebook" aria-hidden="true" /></a>
                                <a href="#"><i className="fa fa-twitter" aria-hidden="true" /></a>
                                <a href="#"><i className="fa fa-linkedin" aria-hidden="true" /></a>
                                <a href="#"><i className="fa fa-instagram" aria-hidden="true" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* footer section */}
            <footer className="footer_section">
                <div className="container-fluid">
                    <p>© 2025 BaloncestoTeam - Todos los derechos reservados</p>
                </div>
            </footer>
        </>
    );
}
