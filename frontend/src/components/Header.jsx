import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Bars3Icon, 
    XMarkIcon, 
    UserIcon, 
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            closeMenu();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close mobile menu when route changes
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };
        
        if (isMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    if (loading) {
        return (
            <header className="header">
                <div className="header-container">
                    <div className="header-logo">
                        <h1>Basketball Team</h1>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <div className="header-logo">
                    <Link to="/">
                        <h1>🏀 Basketball Team</h1>
                    </Link>
                </div>

                {/* Desktop Navigation - Context Aware */}
                <nav className="desktop-nav">
                    <ul className="nav-links">
                        {/* Core App Navigation - Only show functional routes */}
                        {isAuthenticated ? (
                            /* Authenticated User Navigation - Focus on App Features */
                            <>
                                <li>
                                    <Link to="/" className="nav-button">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/players" className="nav-button">
                                        Jugadores
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="nav-button">
                                        Galería
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <li>
                                        <Link to="/admin" className="nav-button admin-link">
                                            Admin Panel
                                        </Link>
                                    </li>
                                )}
                            </>
                        ) : (
                            /* Guest Navigation - Focus on Landing Content & Conversion */
                            <>
                                <li>
                                    <Link to="/" className="nav-button">
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/players" className="nav-button">
                                        Nuestro Equipo
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="nav-button">
                                        Galería
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* User Menu */}
                    <div className="user-menu">
                        {isAuthenticated ? (
                            <div className="user-menu-authenticated">
                                <span className="user-greeting">
                                    Hola, {user?.email?.split('@')[0] || 'Usuario'}
                                </span>
                                <button className="login-btn logout-btn" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className="user-menu-guest">
                                <Link to="/login" className="login-btn">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/signup" className="signup-btn">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMenuOpen}
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
                            {isAuthenticated ? (
                                /* Authenticated Mobile Navigation */
                                <>
                                    <li>
                                        <Link to="/" onClick={closeMenu} className="mobile-nav-button">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/players" onClick={closeMenu} className="mobile-nav-button">
                                            Jugadores
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/gallery" onClick={closeMenu} className="mobile-nav-button">
                                            Galería
                                        </Link>
                                    </li>
                                    {isAdmin && (
                                        <li>
                                            <Link to="/admin" onClick={closeMenu} className="mobile-nav-button">
                                                Admin Panel
                                            </Link>
                                        </li>
                                    )}
                                </>
                            ) : (
                                /* Guest Mobile Navigation */
                                <>
                                    <li>
                                        <Link to="/" onClick={closeMenu} className="mobile-nav-button">
                                            Inicio
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/players" onClick={closeMenu} className="mobile-nav-button">
                                            Nuestro Equipo
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/gallery" onClick={closeMenu} className="mobile-nav-button">
                                            Galería
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Mobile User Menu */}
                        <div className="mobile-user-menu">
                            {isAuthenticated ? (
                                <>
                                    <div className="mobile-user-info">
                                        <UserIcon className="h-5 w-5" />
                                        <span>{user?.email}</span>
                                        <span className="user-role">
                                            ({user?.role === 'admin' ? 'Admin' : 'Jugador'})
                                        </span>
                                    </div>
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