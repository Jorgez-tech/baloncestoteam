import React from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useLoadingState } from '../../hooks/useLoadingState';
import { FormField, LoadingButton } from './FormField';
import { authAPI } from '../../api/client';
import { toast } from 'react-toastify';
import './Auth.css';

const ForgotPassword = ({ onBackToLogin, onSuccess }) => {
    const {
        values,
        errors,
        validationStatus,
        handleChange,
        handleSubmit,
        isFormValid
    } = useFormValidation({
        email: ''
    });

    const {
        isLoading,
        startLoading,
        setLoadingError,
        setLoadingSuccess
    } = useLoadingState();

    const handleForgotPassword = async (formData) => {
        try {
            startLoading('Enviando enlace de recuperación...');

            const response = await authAPI.forgotPassword(formData.email);
            const { success, msg } = response.data;

            if (success) {
                setLoadingSuccess('¡Enlace enviado! Revisa tu email.');
                toast.success(msg || 'Se ha enviado un enlace de recuperación a tu email');

                // Notificar al componente padre del éxito
                setTimeout(() => {
                    onSuccess?.();
                }, 2000);
            } else {
                setLoadingError(msg || 'Error al enviar el enlace de recuperación');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.msg ||
                error.response?.status === 404 ? 'Email no encontrado' :
                error.response?.status === 429 ? 'Demasiados intentos. Espera un momento.' :
                    'Error al enviar el enlace. Intenta de nuevo.';

            setLoadingError(errorMessage);
            console.error('Forgot password error:', error);
        }
    };

    return (
        <div className="auth-container forgot-password-container">
            <div className="auth-card">
                <div className="auth-header">
                    <button
                        onClick={onBackToLogin}
                        className="back-button"
                        type="button"
                    >
                        ← Volver al Login
                    </button>

                    <div className="auth-logo">
                        🏀
                    </div>

                    <h1 className="auth-title">
                        Recuperar Contraseña
                    </h1>

                    <p className="auth-subtitle">
                        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={(e) => handleSubmit(e, handleForgotPassword)}
                >
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
                        required
                    />

                    <LoadingButton
                        type="submit"
                        isLoading={isLoading}
                        disabled={!isFormValid || isLoading}
                        loadingText="Enviando..."
                        className="auth-submit-button"
                    >
                        Enviar Enlace de Recuperación
                    </LoadingButton>

                    {/* Error Display */}
                    {errors.form && (
                        <div className="auth-error">
                            ❌ {errors.form}
                        </div>
                    )}
                </form>

                <div className="auth-footer">
                    <p>¿Recordaste tu contraseña?</p>
                    <button
                        onClick={onBackToLogin}
                        className="auth-link-button"
                        type="button"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;