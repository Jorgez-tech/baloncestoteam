import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(formData);

        if (result.success) {
            // Redirigir según el rol del usuario
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error || 'Error al iniciar sesión');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpiar error al escribir
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
                                            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
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
                                        <li className="nav-item active">
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

            {/* login section */}
            <section className="contact_section">
                <div className="contact_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="contact_form layout_padding">
                                    <div className="heading_container heading_center">
                                        <h2>Iniciar Sesión</h2>
                                        <p style={{ marginTop: '10px', fontSize: '16px', color: '#666' }}>
                                            Accede a tu cuenta de BaloncestoTeam
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

                                    <form onSubmit={handleSubmit}>
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
                                                placeholder="Contraseña"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
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
                                        <div className="btn-box">
                                            <button type="submit" disabled={loading}>
                                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                            </button>
                                        </div>
                                    </form>

                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <p>
                                            ¿No tienes cuenta?{' '}
                                            <Link to="/registro" style={{ color: '#007bff', textDecoration: 'none' }}>
                                                Regístrate aquí
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
                                    Accede a tu cuenta para gestionar tu perfil, ver estadísticas y participar en todas las actividades del club. ¡Forma parte de nuestra comunidad deportiva!
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
                                <h5>Suscríbete</h5>
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
