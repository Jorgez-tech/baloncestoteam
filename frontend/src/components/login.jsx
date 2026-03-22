import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Header from "./Header";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(formData);

        if (result.success) {
            toast.success(`¡Bienvenido${result.user.username ? ' ' + result.user.username : ''}!`);
            // Redirigir según el rol del usuario
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            toast.error(result.error || 'Error al iniciar sesión');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <div className="hero_area">
                {/* header section starts */}
                <Header />
                {/* end header section */}
            </div>

            {/* login section */}
            <section className="contact_section">
                <div className="contact_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 mx-auto">
                                <div className="contact_form layout_padding">
                                    <div className="heading_container heading_center">
                                        <h2>Iniciar Sesión</h2>
                                        <p style={{ marginTop: '10px', fontSize: '16px', color: '#666' }}>
                                            Accede a tu cuenta de BaloncestoTeam
                                        </p>
                                    </div>

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
                        <div className="col-12 col-md-4">
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
                        <div className="col-12 col-md-4 col-lg-3 mx-auto">
                            <div className="address_box">
                                <h5>Dirección</h5>
                                <a href="#"><i className="fa fa-map-marker" aria-hidden="true" />Calle 123, Ciudad Deportiva</a>
                                <a href="#"><i className="fa fa-phone" aria-hidden="true" />(+57) 3001234567</a>
                                <a href="#"><i className="fa fa-envelope" aria-hidden="true" />contacto@baloncestoteam.com</a>
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
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
