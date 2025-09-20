import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { useRememberMe, useAutoLogin } from '../hooks/useRememberMe';
import { FormField, LoadingButton } from './ui/FormField';
import ForgotPassword from './ui/ForgotPassword';
import LogoutModal from './ui/LogoutModal';
import { LoadingOverlay } from './ui/LoadingStates';
import { toast } from 'react-toastify';
import './ui/Auth.css';

const Login = () => {
    const { login, loading: authLoading, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Estado local
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Remember Me y Auto Login
    const {
        rememberMe,
        rememberedEmail,
        autoLogin,
        saveCredentials,
        toggleRememberMe,
        toggleAutoLogin
    } = useRememberMe();

    const {
        shouldAttemptAutoLogin,
        autoLoginChecked,
        completeAutoLogin
    } = useAutoLogin();

    // Validación en tiempo real
    const {
        values,
        errors,
        validationStatus,
        handleChange,
        handleSubmit: handleFormSubmit,
        isFormValid
    } = useFormValidation({
        email: rememberedEmail || '',
        password: ''
    });

    // Auto-login effect
    useEffect(() => {
        if (shouldAttemptAutoLogin && !isAuthenticated && autoLoginChecked) {
            // Intentar auto-login si está configurado
            console.log('Attempting auto-login...');

            // Simular un delay para mejor UX
            const timer = setTimeout(() => {
                if (!isAuthenticated) {
                    completeAutoLogin();
                }
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [shouldAttemptAutoLogin, isAuthenticated, autoLoginChecked, completeAutoLogin]);

    // Redirect si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Cargar email recordado en el formulario
    useEffect(() => {
        if (rememberedEmail && !values.email) {
            handleChange({ target: { name: 'email', value: rememberedEmail } });
        }
    }, [rememberedEmail, values.email, handleChange]);

    const handleLoginSubmit = async (formData) => {
        try {
            const result = await login(formData);

            if (result.success) {
                // Guardar configuración de Remember Me
                saveCredentials(
                    formData.email,
                    rememberMe,
                    autoLogin
                );

                // Feedback visual de éxito
                toast.success(`¡Bienvenido de vuelta${result.user?.name ? `, ${result.user.name}` : ''}!`, {
                    position: 'top-center',
                    autoClose: 2000,
                });

                // Navegación automática se maneja en el useEffect anterior
                return result;
            } else {
                // Manejar errores específicos
                handleLoginError(result.error);
                return result;
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Error de conexión. Verifica tu conexión a internet.');
            throw error;
        }
    };

    const handleLoginError = (errorMessage) => {
        if (errorMessage?.includes('inválidas') || errorMessage?.includes('incorrectas')) {
            toast.error('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (errorMessage?.includes('bloqueada')) {
            toast.error('Cuenta temporalmente bloqueada por seguridad. Intenta más tarde.');
        } else if (errorMessage?.includes('intentos') || errorMessage?.includes('demasiados')) {
            toast.warn('Demasiados intentos. Espera un momento antes de intentar nuevamente.');
        } else if (errorMessage?.includes('email') && errorMessage?.includes('verificado')) {
            toast.info('Por favor verifica tu email antes de iniciar sesión.');
        } else {
            toast.error(errorMessage || 'Error al iniciar sesión');
        }
    };

    const handleForgotPasswordSuccess = () => {
        setShowForgotPassword(false);
        toast.info('Revisa tu email para restablecer tu contraseña');
    };

    // Mostrar overlay de carga durante auto-login
    if (shouldAttemptAutoLogin && !autoLoginChecked) {
        return (
            <LoadingOverlay
                isVisible={true}
                message="Verificando sesión automática..."
                type="default"
            />
        );
    }

    // Mostrar componente de forgot password
    if (showForgotPassword) {
        return (
            <ForgotPassword
                onBackToLogin={() => setShowForgotPassword(false)}
                onSuccess={handleForgotPasswordSuccess}
            />
        );
    }

    return (
        <>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            🏀
                        </div>
                        <h1 className="auth-title">Iniciar Sesión</h1>
                        <p className="auth-subtitle">
                            Accede a tu cuenta de Basketball Team
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={(e) => handleFormSubmit(e, handleLoginSubmit)}
                        noValidate
                    >
                        {/* Campo Email */}
                        <FormField
                            type="email"
                            name="email"
                            label="Email"
                            value={values.email}
                            error={errors.email}
                            status={validationStatus.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            icon="📧"
                            autoComplete="email"
                            required
                        />

                        {/* Campo Password */}
                        <FormField
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            label="Contraseña"
                            value={values.password}
                            error={errors.password}
                            status={validationStatus.password}
                            onChange={handleChange}
                            placeholder="Tu contraseña"
                            icon="🔒"
                            autoComplete="current-password"
                            showPasswordToggle={true}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            required
                        />

                        {/* Opciones avanzadas */}
                        <div className="auth-options">
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => toggleRememberMe(e.target.checked)}
                                        className="checkbox-input"
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-text">Recordar mi email</span>
                                </label>

                                {rememberMe && (
                                    <label className="checkbox-label checkbox-sub">
                                        <input
                                            type="checkbox"
                                            checked={autoLogin}
                                            onChange={(e) => toggleAutoLogin(e.target.checked)}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">Iniciar sesión automáticamente</span>
                                    </label>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="forgot-password-link"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <LoadingButton
                            type="submit"
                            isLoading={authLoading}
                            disabled={!isFormValid || authLoading}
                            loadingText="Iniciando sesión..."
                            className="auth-submit-button"
                        >
                            Iniciar Sesión
                        </LoadingButton>

                        {/* Error Display */}
                        {errors.form && (
                            <div className="auth-error">
                                ❌ {errors.form}
                            </div>
                        )}
                    </form>

                    <div className="auth-footer">
                        <p>¿No tienes una cuenta?</p>
                        <button
                            onClick={() => navigate('/register')}
                            className="auth-link-button"
                            type="button"
                        >
                            Crear cuenta nueva
                        </button>
                    </div>

                    {/* Info de Remember Me */}
                    {rememberMe && (
                        <div className="auth-info">
                            <p>
                                <span className="info-icon">ℹ️</span>
                                Tu email será recordado en este dispositivo
                                {autoLogin && ' y iniciarás sesión automáticamente'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de logout (si el usuario ya estaba logueado) */}
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={() => {
                    // Lógica de logout si es necesaria
                    setShowLogoutModal(false);
                }}
                onCancel={() => setShowLogoutModal(false)}
                userName={user?.name}
            />
        </>
    );
};

export default Login;