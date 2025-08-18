import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Página de inicio de sesión
 */
const LoginPage = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!form.email || !form.password) {
            setError('Todos los campos son obligatorios');
            return false;
        }
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Email no válido');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setError('');

        try {
            const result = await login(form);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            setError('Error de conexión. Intente nuevamente.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                <h2>Iniciar Sesión</h2>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </label>
                <label>
                    Contraseña
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="show-password-btn"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </label>
                {error && <div className="form-error">{error}</div>}
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>

                <div className="login-footer">
                    <p>¿No tienes cuenta? <Link to="/signup">Regístrate</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
