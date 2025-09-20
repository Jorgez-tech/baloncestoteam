import React from 'react';
import './FormField.css';

export const FormField = ({
    label,
    error,
    success,
    isValidating,
    children,
    required = false,
    className = '',
    helpText = ''
}) => {
    const getStatusClass = () => {
        if (isValidating) return 'validating';
        if (error) return 'error';
        if (success) return 'success';
        return '';
    };

    return (
        <div className={`form-field ${getStatusClass()} ${className}`}>
            <label className="form-label">
                {label} {required && <span className="required">*</span>}
            </label>

            <div className="form-input-wrapper">
                {children}

                {/* Indicador de estado */}
                <div className="form-status-indicator">
                    {isValidating && (
                        <div className="status-icon validating">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!isValidating && error && (
                        <div className="status-icon error">❌</div>
                    )}
                    {!isValidating && success && !error && (
                        <div className="status-icon success">✅</div>
                    )}
                </div>
            </div>

            {/* Mensajes */}
            {error && (
                <div className="form-message error-message">
                    {error}
                </div>
            )}
            {!error && success && (
                <div className="form-message success-message">
                    {success}
                </div>
            )}
            {helpText && !error && !success && (
                <div className="form-message help-message">
                    {helpText}
                </div>
            )}
        </div>
    );
};

export const PasswordStrengthIndicator = ({ strength, requirements = [] }) => {
    const getStrengthLevel = () => {
        if (strength >= 90) return 'very-strong';
        if (strength >= 75) return 'strong';
        if (strength >= 50) return 'medium';
        if (strength >= 25) return 'weak';
        return 'very-weak';
    };

    const getStrengthText = () => {
        if (strength >= 90) return 'Muy Segura';
        if (strength >= 75) return 'Segura';
        if (strength >= 50) return 'Media';
        if (strength >= 25) return 'Débil';
        return 'Muy Débil';
    };

    return (
        <div className="password-strength">
            <div className="strength-bar-container">
                <div
                    className={`strength-bar ${getStrengthLevel()}`}
                    style={{ width: `${strength}%` }}
                ></div>
            </div>

            <div className="strength-info">
                <span className={`strength-text ${getStrengthLevel()}`}>
                    {getStrengthText()} ({strength}%)
                </span>

                {requirements.length > 0 && (
                    <div className="strength-requirements">
                        <small>Falta: {requirements.join(', ')}</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export const LoadingButton = ({
    loading = false,
    children,
    loadingText = 'Cargando...',
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`loading-button ${className} ${loading ? 'loading' : ''}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <div className="button-spinner"></div>}
            <span className={`button-text ${loading ? 'loading' : ''}`}>
                {loading ? loadingText : children}
            </span>
        </button>
    );
};

export default { FormField, PasswordStrengthIndicator, LoadingButton };