import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
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
                                {user ? (
                                    <>
                                        {isAdmin && (
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/admin">Panel Admin</Link>
                                            </li>
                                        )}
                                        <li className="nav-item">
                                            <button className="nav-link" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={handleLogout}>
                                                Cerrar Sesión
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                                    </li>
                                )}
                            </ul>
                            <div className="quote_btn-container">
                                <a href="#" className="cart_link">
                                    <i className="fa fa-cart-arrow-down" aria-hidden="true" />
                                    <span className="cart_number">0</span>
                                </a>
                                <form className="form-inline" onSubmit={e => e.preventDefault()}>
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
    );
}
