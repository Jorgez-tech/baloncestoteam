import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './UIComponents.css';

/**
 * Input Field Component - Reutilizable y con estados visuales
 */
export const FormInput = ({
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    label,
    error,
    required = false,
    disabled = false,
    autoComplete,
    status = 'default', // 'default', 'valid', 'error', 'loading'
    showPasswordToggle = false,
    onTogglePassword,
    className = '',
    ...props
}) => {
    const handleChange = (e) => {
        if (onChange) onChange(e.target.name, e.target.value);
    };

    const handleBlur = (e) => {
        if (onBlur) onBlur(e.target.name);
    };

    return (
        <div className={`ui-form-group ${className}`}>
            {label && (
                <label htmlFor={name} className="ui-form-label">
                    {label}
                    {required && <span className="required-asterisk">*</span>}
                </label>
            )}

            <div className={`ui-input-wrapper ${status}`}>
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className="ui-form-input"
                    {...props}
                />

                {/* Password Toggle */}
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="ui-password-toggle"
                        tabIndex={-1}
                    >
                        {type === 'password' ? (
                            <EyeIcon className="toggle-icon" />
                        ) : (
                            <EyeSlashIcon className="toggle-icon" />
                        )}
                    </button>
                )}

                {/* Status Icon */}
                <div className="ui-input-status">
                    {status === 'valid' && <CheckCircleIcon className="status-icon success" />}
                    {status === 'error' && <ExclamationCircleIcon className="status-icon error" />}
                    {status === 'loading' && <div className="status-spinner"></div>}
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="ui-error-message"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Button Component - Múltiples variantes y estados
 */
export const UIButton = ({
    type = 'button',
    variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
    size = 'md', // 'sm', 'md', 'lg'
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    onClick,
    ...props
}) => {
    const buttonClasses = [
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        fullWidth && 'ui-button--full-width',
        loading && 'ui-button--loading',
        disabled && 'ui-button--disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <motion.button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ui-button-content"
                    >
                        <div className="ui-button-spinner"></div>
                        <span>Cargando...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ui-button-content"
                    >
                        {leftIcon && <span className="ui-button-icon left">{leftIcon}</span>}
                        <span>{children}</span>
                        {rightIcon && <span className="ui-button-icon right">{rightIcon}</span>}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

/**
 * Checkbox Component - Estilizado y accesible
 */
export const UICheckbox = ({
    name,
    checked = false,
    onChange,
    label,
    disabled = false,
    className = '',
    ...props
}) => {
    const handleChange = (e) => {
        if (onChange) onChange(e.target.checked);
    };

    return (
        <label className={`ui-checkbox ${disabled ? 'disabled' : ''} ${className}`}>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                className="ui-checkbox-input"
                {...props}
            />
            <span className="ui-checkbox-custom"></span>
            {label && <span className="ui-checkbox-label">{label}</span>}
        </label>
    );
};

/**
 * Alert/Message Component - Para mostrar mensajes de estado
 */
export const UIAlert = ({
    type = 'info', // 'success', 'error', 'warning', 'info'
    title,
    message,
    closable = false,
    onClose,
    className = '',
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`ui-alert ui-alert--${type} ${className}`}
            {...props}
        >
            <div className="ui-alert-content">
                {title && <div className="ui-alert-title">{title}</div>}
                {message && <div className="ui-alert-message">{message}</div>}
            </div>

            {closable && onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="ui-alert-close"
                >
                    ×
                </button>
            )}
        </motion.div>
    );
};

/**
 * Card Component - Container con glassmorphism
 */
export const UICard = ({
    children,
    variant = 'default', // 'default', 'elevated', 'glass'
    padding = 'md', // 'sm', 'md', 'lg'
    className = '',
    ...props
}) => {
    const cardClasses = [
        'ui-card',
        `ui-card--${variant}`,
        `ui-card--padding-${padding}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cardClasses}
            {...props}
        >
            {children}
        </motion.div>
    );
};

/**
 * Loading Overlay Component - Para estados de carga
 */
export const UILoadingOverlay = ({
    visible = false,
    message = 'Cargando...',
    className = ''
}) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`ui-loading-overlay ${className}`}
                >
                    <div className="ui-loading-content">
                        <div className="ui-loading-spinner large"></div>
                        <div className="ui-loading-message">{message}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * Brand Logo Component - Logo reutilizable
 */
export const UIBrandLogo = ({
    size = 'md', // 'sm', 'md', 'lg'
    showText = true,
    className = ''
}) => {
    return (
        <div className={`ui-brand-logo ui-brand-logo--${size} ${className}`}>
            <div className="ui-logo-icon">🏀</div>
            {showText && <h1 className="ui-brand-text">Basketball Team</h1>}
        </div>
    );
};

export default {
    FormInput,
    UIButton,
    UICheckbox,
    UIAlert,
    UICard,
    UILoadingOverlay,
    UIBrandLogo
};