import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Página de registro de usuarios
 */
const SignupPage = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!form.username || !form.email || !form.password || !form.confirmPassword) {
            setError('Todos los campos son obligatorios');
            return false;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Email no válido');
            return false;
        }

        // Validación de contraseña
        if (form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        // Validación de confirmación de contraseña
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
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
            const result = await register({
                username: form.username,
                email: form.email,
                password: form.password
            });

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Error al registrar usuario');
            }
        } catch (error) {
            setError('Error de conexión. Intente nuevamente.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
                <h2>Crear Cuenta</h2>

                <label>
                    Nombre de usuario
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </label>

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
                            autoComplete="new-password"
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

                <label>
                    Confirmar Contraseña
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />
                </label>

                {error && <div className="form-error">{error}</div>}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                <div className="signup-footer">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                </div>
            </form>
        </div>
    );
};

export default SignupPage;
