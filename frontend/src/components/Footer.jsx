import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de pie de página
 * @returns {React.ReactNode} - Pie de página con links y copyright
 */
const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-section">
                <h3>Equipo de Baloncesto</h3>
                <p>Una aplicación para gestionar tu equipo favorito.</p>
            </div>

            <div className="footer-section">
                <h4>Enlaces</h4>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/gallery">Galería</Link></li>
                    <li><Link to="/players">Jugadores</Link></li>
                </ul>
            </div>

            <div className="footer-section">
                <h4>Síguenos</h4>
                <ul className="social-links">
                    <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                    <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Equipo de Baloncesto. Todos los derechos reservados.</p>
        </div>
    </footer>
);

export default Footer;
