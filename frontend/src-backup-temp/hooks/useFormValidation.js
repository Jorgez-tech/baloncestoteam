import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

// Validadores específicos
const validators = {
    email: (value) => {
        if (!value) return { isValid: false, message: 'Email es requerido' };
        if (value.length < 5) return { isValid: false, message: 'Email muy corto (mín. 5 caracteres)' };
        if (value.length > 100) return { isValid: false, message: 'Email muy largo (máx. 100 caracteres)' };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Formato de email inválido' };
        }

        return { isValid: true, message: 'Email válido' };
    },

    password: (value) => {
        if (!value) return { isValid: false, message: 'Contraseña es requerida', strength: 0 };
        if (value.length < 8) {
            return {
                isValid: false,
                message: `Muy corta (mín. 8 caracteres, tienes ${value.length})`,
                strength: Math.min(value.length / 8 * 25, 25)
            };
        }
        if (value.length > 128) {
            return {
                isValid: false,
                message: 'Muy larga (máx. 128 caracteres)',
                strength: 0
            };
        }

        // Calcular fortaleza de contraseña
        let strength = 0;
        let messages = [];

        // Longitud
        if (value.length >= 8) {
            strength += 25;
        }

        // Minúscula
        if (/[a-z]/.test(value)) {
            strength += 25;
        } else {
            messages.push('minúscula');
        }

        // Mayúscula
        if (/[A-Z]/.test(value)) {
            strength += 25;
        } else {
            messages.push('mayúscula');
        }

        // Número
        if (/\d/.test(value)) {
            strength += 25;
        } else {
            messages.push('número');
        }

        // Símbolo especial
        if (/[@$!%*?&]/.test(value)) {
            strength += 25;
        } else {
            messages.push('símbolo (@$!%*?&)');
        }

        const isValid = strength >= 100;
        const message = isValid
            ? '¡Contraseña segura!'
            : `Falta: ${messages.join(', ')}`;

        return {
            isValid,
            message,
            strength: Math.min(strength, 100),
            missingRequirements: messages
        };
    },

    name: (value) => {
        if (!value) return { isValid: true, message: '' }; // Opcional
        if (value.length < 2) return { isValid: false, message: 'Nombre muy corto (mín. 2 caracteres)' };
        if (value.length > 50) return { isValid: false, message: 'Nombre muy largo (máx. 50 caracteres)' };

        const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
        if (!nameRegex.test(value)) {
            return { isValid: false, message: 'Solo letras y espacios permitidos' };
        }

        return { isValid: true, message: 'Nombre válido' };
    },

    confirmPassword: (value, originalPassword) => {
        if (!value) return { isValid: false, message: 'Confirmación es requerida' };
        if (value !== originalPassword) {
            return { isValid: false, message: 'Las contraseñas no coinciden' };
        }
        return { isValid: true, message: 'Las contraseñas coinciden' };
    }
};

// Hook principal para validación en tiempo real
export const useFormValidation = (initialState = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isValidating, setIsValidating] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Función de validación debounced
    const debouncedValidate = useCallback(
        debounce((fieldName, value, allValues) => {
            if (!validationRules[fieldName]) {
                setIsValidating(prev => ({ ...prev, [fieldName]: false }));
                return;
            }

            const validator = validators[validationRules[fieldName]];
            if (!validator) {
                setIsValidating(prev => ({ ...prev, [fieldName]: false }));
                return;
            }

            // Validación especial para confirmPassword
            let result;
            if (validationRules[fieldName] === 'confirmPassword') {
                result = validator(value, allValues.password);
            } else {
                result = validator(value);
            }

            setErrors(prev => ({
                ...prev,
                [fieldName]: result
            }));
            setIsValidating(prev => ({ ...prev, [fieldName]: false }));
        }, 300),
        [validationRules]
    );

    // Validar toda la forma
    useEffect(() => {
        const allFieldsValid = Object.keys(validationRules).every(field => {
            const error = errors[field];
            const value = values[field];

            // Campo requerido pero vacío
            if (!value && ['email', 'password'].includes(validationRules[field])) {
                return false;
            }

            // Campo con error
            if (error && !error.isValid) {
                return false;
            }

            return true;
        });

        setIsFormValid(allFieldsValid);
    }, [values, errors, validationRules]);

    // Manejar cambios en los campos
    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        setIsValidating(prev => ({ ...prev, [name]: true }));

        // Validar inmediatamente si el campo ya fue tocado
        if (touched[name]) {
            debouncedValidate(name, value, { ...values, [name]: value });
        }
    };

    // Manejar blur (cuando el usuario sale del campo)
    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const value = values[name];
        setIsValidating(prev => ({ ...prev, [name]: true }));
        debouncedValidate(name, value, values);
    };

    // Reset del formulario
    const reset = () => {
        setValues(initialState);
        setErrors({});
        setIsValidating({});
        setTouched({});
        setIsFormValid(false);
    };

    // Validar todo el formulario (para submit)
    const validateAll = () => {
        const newErrors = {};
        let allValid = true;

        Object.keys(validationRules).forEach(field => {
            const validator = validators[validationRules[field]];
            if (validator) {
                let result;
                if (validationRules[field] === 'confirmPassword') {
                    result = validator(values[field], values.password);
                } else {
                    result = validator(values[field]);
                }

                newErrors[field] = result;
                if (!result.isValid) allValid = false;
            }
        });

        setErrors(newErrors);
        setTouched(Object.keys(validationRules).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));

        return allValid;
    };

    return {
        values,
        errors,
        isValidating,
        touched,
        isFormValid,
        handleChange,
        handleBlur,
        reset,
        validateAll,
        // Utilities
        getFieldStatus: (fieldName) => {
            if (isValidating[fieldName]) return 'validating';
            if (!touched[fieldName]) return 'untouched';
            if (!errors[fieldName]) return 'untouched';
            return errors[fieldName].isValid ? 'valid' : 'invalid';
        },
        getFieldMessage: (fieldName) => errors[fieldName]?.message || '',
        getPasswordStrength: (fieldName) => errors[fieldName]?.strength || 0
    };
};

export default useFormValidation;