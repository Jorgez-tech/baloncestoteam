import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated, isAdmin, authVersion } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Smooth scroll helper for home page sections
    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const headerHeight = 80;
                    const targetPosition = element.offsetTop - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerHeight = 80;
                const targetPosition = element.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        closeMenu();
    };

    const handleNavigation = (path, sectionId = null) => {
        if (sectionId && (path === '/' || location.pathname === '/')) {
            scrollToSection(sectionId);
        } else {
            navigate(path);
            closeMenu();
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <div className="header-logo">
                    <Link to="/" onClick={closeMenu}>
                        <h1>🏀 Basketball Team</h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    <ul className="nav-links">
                        <li>
                            <button onClick={() => handleNavigation('/', 'inicio')} className="nav-button">
                                Inicio
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigation('/', 'galeria')} className="nav-button">
                                Galería
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigation('/', 'jugadores')} className="nav-button">
                                Jugadores
                            </button>
                        </li>
                        {!user && (
                            <li>
                                <button onClick={() => handleNavigation('/', 'inscripcion')} className="nav-button">
                                    Inscripción
                                </button>
                            </li>
                        )}
                        <li>
                            <button onClick={() => handleNavigation('/', 'contacto')} className="nav-button">
                                Contacto
                            </button>
                        </li>
                        {isAdmin && (
                            <li>
                                <Link to="/admin" onClick={closeMenu}>Admin</Link>
                            </li>
                        )}
                    </ul>

                    {/* User Menu simplificado */}
                    <div className="user-menu">
                        {isAuthenticated ? (
                            <button className="login-btn" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link to="/login" className="login-btn">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="mobile-nav">
                    <div className="mobile-nav-content">
                        <ul className="mobile-nav-links">
                            <li>
                                <button onClick={() => handleNavigation('/', 'inicio')} className="mobile-nav-button">
                                    Inicio
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigation('/', 'galeria')} className="mobile-nav-button">
                                    Galería
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigation('/', 'jugadores')} className="mobile-nav-button">
                                    Jugadores
                                </button>
                            </li>
                            {!user && (
                                <li>
                                    <button onClick={() => handleNavigation('/', 'inscripcion')} className="mobile-nav-button">
                                        Inscripción
                                    </button>
                                </li>
                            )}
                            <li>
                                <button onClick={() => handleNavigation('/', 'contacto')} className="mobile-nav-button">
                                    Contacto
                                </button>
                            </li>
                            {isAdmin && (
                                <li>
                                    <Link to="/admin" onClick={closeMenu}>Admin</Link>
                                </li>
                            )}
                        </ul>

                        {/* Mobile User Menu */}
                        <div className="mobile-user-menu">
                            {isAuthenticated ? (
                                <>
                                    <div className="mobile-user-info">
                                        <UserIcon className="h-5 w-5" />
                                        <span>{user?.email}</span>
                                    </div>
                                    {/* <Link to="/profile" onClick={closeMenu} className="mobile-menu-item">Mi Perfil</Link> */}
                                    <button
                                        onClick={handleLogout}
                                        className="mobile-menu-item logout-btn"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <div className="mobile-auth-buttons">
                                    <Link to="/login" onClick={closeMenu} className="mobile-login-btn">
                                        Iniciar Sesión
                                    </Link>
                                    <Link to="/signup" onClick={closeMenu} className="mobile-signup-btn">
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;