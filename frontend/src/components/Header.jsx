import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    // Log para depuración de contexto
    console.log('HEADER CONTEXT:', { user, logout, isAuthenticated, isAdmin, authVersion });
    const navigate = useNavigate();

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
                            <Link to="/">Inicio</Link>
                        </li>
                        <li>
                            <Link to="/gallery">Galería</Link>
                        </li>
                        <li>
                            <Link to="/players">Jugadores</Link>
                        </li>
                        {isAdmin && (
                            <li>
                                <Link to="/admin">Admin</Link>
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
                                <Link to="/" onClick={closeMenu}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/gallery" onClick={closeMenu}>Galería</Link>
                            </li>
                            <li>
                                <Link to="/players" onClick={closeMenu}>Jugadores</Link>
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