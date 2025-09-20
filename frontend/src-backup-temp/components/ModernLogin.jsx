import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useFormHandler, useRememberMe, useUIAnimations } from '../hooks/useFormHandler';
import {
    FormInput,
    UIButton,
    UICheckbox,
    UIAlert,
    UICard,
    UIBrandLogo
} from './ui/UIComponents';
import './ModernLogin.css';
import './ui/UIComponents.css';

const ModernLogin = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

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

    // Use custom hooks
    const {
        values,
        errors,
        isSubmitting,
        submitMessage,
        handleChange,
        handleBlur,
        validateAll,
        isFormValid,
        setSubmitting,
        setMessage,
        setValue
    } = useFormHandler(
        { email: '', password: '' },
        validationRules
    );

    const { rememberMe, savedData, toggleRememberMe, saveData } = useRememberMe('basketballLogin');
    const { containerVariants, messageVariants } = useUIAnimations();

    // Estados locales
    const [showPassword, setShowPassword] = useState(false);

    // Cargar email recordado
    useEffect(() => {
        if (savedData.email) {
            setValue('email', savedData.email);
        }
    }, [savedData.email, setValue]);

    // Redireccionar si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Manejar submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) return;

        setSubmitting(true);
        setMessage('');

        try {
            const result = await login({
                email: values.email,
                password: values.password
            });

            if (result.success) {
                setMessage('¡Bienvenido de vuelta!');

                // Guardar remember me
                if (rememberMe) {
                    saveData({ email: values.email });
                }

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setMessage(result.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            setMessage('Error de conexión. Intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modern-login">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <UICard
                variant="glass"
                padding="lg"
                className="login-container"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Header */}
                    <div className="login-header">
                        <UIBrandLogo size="md" />
                        <p className="welcome-text">
                            Bienvenido de vuelta, ingresa tus credenciales
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        {/* Email Field */}
                        <FormInput
                            type="email"
                            name="email"
                            label="Correo Electrónico"
                            placeholder="tu@email.com"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email}
                            status={
                                errors.email ? 'error' :
                                    values.email && !errors.email ? 'valid' :
                                        'default'
                            }
                            autoComplete="email"
                            required
                        />

                        {/* Password Field */}
                        <FormInput
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            label="Contraseña"
                            placeholder="Tu contraseña"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password}
                            status={
                                errors.password ? 'error' :
                                    values.password && !errors.password ? 'valid' :
                                        'default'
                            }
                            showPasswordToggle={true}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            autoComplete="current-password"
                            required
                        />

                        {/* Options */}
                        <div className="form-options">
                            <UICheckbox
                                name="rememberMe"
                                checked={rememberMe}
                                onChange={toggleRememberMe}
                                label="Recordar mi email"
                            />

                            <Link to="/forgot-password" className="forgot-link">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Submit Message */}
                        <AnimatePresence>
                            {submitMessage && (
                                <motion.div
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <UIAlert
                                        type={submitMessage.includes('Bienvenido') ? 'success' : 'error'}
                                        message={submitMessage}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <UIButton
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth={true}
                            disabled={!isFormValid}
                            loading={isSubmitting}
                            rightIcon={!isSubmitting && <ArrowRightIcon className="w-5 h-5" />}
                        >
                            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </UIButton>
                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        <p className="signup-text">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/signup" className="signup-link">
                                Crear cuenta nueva
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </UICard>

            {/* Demo Info - Solo para desarrollo */}
            <div className="demo-info">
                <h4>Demo Credentials:</h4>
                <p>Email: demo@basketball.com</p>
                <p>Password: Demo123!</p>
            </div>
        </div>
    );
};

export default ModernLogin;