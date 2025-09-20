import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowRightIcon } from '@heroicons/react/24/solid';
// import { useFormHandler, useRememberMe, useUIAnimations } from '../../hooks/useFormHandler';
// import {
//     FormInput,
//     UIButton,
//     UICheckbox,
//     UIAlert,
//     UICard,
//     UIBrandLogo
// } from '../ui/UIComponents';
import './LoginForm.css';
// import '../ui/UIComponents.css';

/**
 * LoginForm Component - Migrado desde ModernLogin.jsx
 * Arquitectura Limpia - Componente de Autenticación
 */
const LoginForm = () => {
    // TODO: Implementar hooks y contexto después de migrar dependencias
    // const { login, isAuthenticated } = useAuth();
    // const navigate = useNavigate();

    // Estados temporales para desarrollo
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Form validation rules
    const validationRules = {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            patternMessage: 'Ingresa un email válido',
            maxLength: 100,
            maxLengthMessage: 'Email muy largo'
        },
        password: {
            required: true,
            minLength: 6,
            minLengthMessage: 'Mínimo 6 caracteres',
            maxLength: 128,
            maxLengthMessage: 'Contraseña muy larga'
        }
    };

    // Funciones de manejo básicas (temporales)
    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (name) => {
        // Validación básica temporal
        const rule = validationRules[name];
        if (rule && rule.required && !values[name]) {
            setErrors(prev => ({ ...prev, [name]: `${name} es requerido` }));
        } else {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        // Validación simple
        if (!values.email || !values.password) {
            setSubmitMessage('Por favor completa todos los campos');
            setIsSubmitting(false);
            return;
        }

        // Simulación de login (temporal)
        setTimeout(() => {
            setSubmitMessage('¡Login funcional! (Versión de prueba)');
            setIsSubmitting(false);
        }, 1500);
    };

    const isFormValid = values.email && values.password && !errors.email && !errors.password;

    return (
        <div className="login-form-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-card">
                <div className="login-content">
                    {/* Header */}
                    <div className="login-header">
                        <div className="brand-logo">
                            <div className="logo-icon">🏀</div>
                            <h1 className="brand-name">Basketball Team</h1>
                        </div>
                        <p className="welcome-text">
                            Bienvenido de vuelta, ingresa tus credenciales
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico *
                            </label>
                            <div className={`input-wrapper ${errors.email ? 'error' : values.email && !errors.email ? 'valid' : ''}`}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="tu@email.com"
                                    className="form-input"
                                    autoComplete="email"
                                    required
                                />
                                <div className="input-status">
                                    {values.email && !errors.email && (
                                        <div className="status-icon success">✓</div>
                                    )}
                                    {errors.email && (
                                        <div className="status-icon error">⚠</div>
                                    )}
                                </div>
                            </div>
                            {errors.email && (
                                <div className="error-message">{errors.email}</div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Contraseña *
                            </label>
                            <div className={`input-wrapper ${errors.password ? 'error' : values.password && !errors.password ? 'valid' : ''}`}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={values.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    placeholder="Tu contraseña"
                                    className="form-input"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                    tabIndex={-1}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="error-message">{errors.password}</div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="checkbox-input"
                                />
                                <div className="checkbox-custom"></div>
                                <span className="checkbox-text">Recordar mi email</span>
                            </label>

                            <a href="/forgot-password" className="forgot-link">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Submit Message */}
                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.includes('funcional') ? 'success' : 'error'}`}>
                                {submitMessage}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!isFormValid || isSubmitting}
                        >
                            <div className="button-content">
                                {isSubmitting ? (
                                    <>
                                        <div className="loading-spinner"></div>
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        Iniciar Sesión
                                        <span className="button-icon">→</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        <p className="signup-text">
                            ¿No tienes una cuenta?{' '}
                            <a href="/signup" className="signup-link">
                                Crear cuenta nueva
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Demo Info - Solo para desarrollo */}
            <div className="demo-info">
                <h4>Demo Status:</h4>
                <p>✅ Componente migrado</p>
                <p>✅ Estilos aplicados</p>
                <p>🔄 Hooks pendientes</p>
                <p>🔄 Contexto pendiente</p>
            </div>
        </div>
    );
};

export default LoginForm;