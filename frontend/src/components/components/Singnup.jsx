import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, loading } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        const result = await registerUser({
            email: data.email,
            password: data.password,
        });

        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Crear Cuenta</h2>
                    <p>Únete al equipo de baloncesto</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'El email es requerido',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email inválido'
                                }
                            })}
                            className={errors.email ? 'error' : ''}
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="password-input">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: 'La contraseña es requerida',
                                    minLength: {
                                        value: 6,
                                        message: 'La contraseña debe tener al menos 6 caracteres'
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
                                    }
                                })}
                                className={errors.password ? 'error' : ''}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <div className="password-input">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword', {
                                    required: 'Confirma tu contraseña',
                                    validate: value =>
                                        value === password || 'Las contraseñas no coinciden'
                                })}
                                className={errors.confirmPassword ? 'error' : ''}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                {...register('acceptTerms', {
                                    required: 'Debes aceptar los términos y condiciones'
                                })}
                            />
                            <span className="checkmark"></span>
                            Acepto los{' '}
                            <Link to="/terms" target="_blank">
                                términos y condiciones
                            </Link>
                        </label>
                        {errors.acceptTerms && (
                            <span className="error-message">{errors.acceptTerms.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>

                    {/* Login Link */}
                    <div className="login-link">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login">Inicia sesión aquí</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}