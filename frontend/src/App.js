import React from 'react';
import './styles/sportpar-base.css';
import './styles/responsive.css';
import { api } from './api';

function App() {
    function handleContactSubmit(event) {
        event.preventDefault();
        const formData = {
            name: event.target[0].value,
            email: event.target[1].value,
            phone: event.target[2].value,
            message: event.target[3].value,
        };

        api.sendContact(formData)
            .then(() => {
                alert('Mensaje enviado exitosamente');
            })
            .catch(error => {
                console.error('Error al enviar el mensaje:', error);
                alert('Hubo un error al enviar el mensaje.');
            });
    }

    return (
        <div className="App">
            {/* Header Section */}
            <header className="header_section">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg custom_nav-container">
                        <a className="navbar-brand" href="#home">
                            <span>Basketball Team Management</span>
                        </a>
                        <div className="navbar-nav">
                            <a className="nav-link" href="#home">Inicio</a>
                            <a className="nav-link" href="#about">Equipo</a>
                            <a className="nav-link" href="#players">Jugadores</a>
                            <a className="nav-link" href="#contact">Contacto</a>
                            <a className="nav-link" href="#login">Acceso Admin</a>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="slider_section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="detail-box">
                                <h1>Gestión Profesional<br />de Equipos de Baloncesto</h1>
                                <p>Sistema completo para administrar jugadores, estadísticas y entrenamientos.</p>
                                <div className="btn-box">
                                    <a href="#dashboard" className="btn-1">Ver Dashboard</a>
                                    <a href="#contact" className="btn-2">Solicitar Demo</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="img-box">
                                <img src="/api/placeholder/600/400" alt="Basketball Management" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="feature_section layout_padding">
                <div className="container">
                    <div className="feature_container">
                        <div className="box">
                            <div className="detail-box">
                                <h5>Gestión de Jugadores</h5>
                                <p>Administra perfiles completos, estadísticas y rendimiento de cada jugador.</p>
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-box">
                                <h5>Estadísticas Avanzadas</h5>
                                <p>Reportes detallados y análisis de rendimiento del equipo.</p>
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-box">
                                <h5>Soporte 24/7</h5>
                                <p>Asistencia técnica completa para tu sistema de gestión.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact_section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="contact_form">
                                <h2>Contacta con nosotros</h2>
                                <form onSubmit={handleContactSubmit}>
                                    <input type="text" placeholder="Nombre completo" />
                                    <input type="email" placeholder="Email" />
                                    <input type="text" placeholder="Teléfono" />
                                    <textarea placeholder="Mensaje" className="message_input"></textarea>
                                    <button type="submit">Enviar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer_section">
                <div className="container-fluid">
                    <p>&copy; 2024 Basketball Team Management System</p>
                </div>
            </footer>
        </div>
    );
}

export default App;