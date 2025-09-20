import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar formularios con validación en tiempo real
 * Diseñado para ser reutilizable y escalable
 */
export const useFormHandler = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Validar un campo individual
    const validateField = useCallback((name, value) => {
        const rules = validationRules[name];
        if (!rules) return '';

        let error = '';

        // Validaciones comunes
        if (rules.required && (!value || value.trim() === '')) {
            error = rules.requiredMessage || `${name} es requerido`;
        } else if (rules.minLength && value.length < rules.minLength) {
            error = rules.minLengthMessage || `Mínimo ${rules.minLength} caracteres`;
        } else if (rules.maxLength && value.length > rules.maxLength) {
            error = rules.maxLengthMessage || `Máximo ${rules.maxLength} caracteres`;
        } else if (rules.pattern && !rules.pattern.test(value)) {
            error = rules.patternMessage || 'Formato inválido';
        } else if (rules.custom && typeof rules.custom === 'function') {
            error = rules.custom(value, values) || '';
        }

        return error;
    }, [validationRules, values]);

    // Manejar cambios en los inputs
    const handleChange = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Validar solo si el campo ya fue tocado
        if (touched[name]) {
            setTimeout(() => {
                const error = validateField(name, value);
                setErrors(prev => ({
                    ...prev,
                    [name]: error
                }));
            }, 300);
        }
    }, [touched, validateField]);

    // Manejar blur (cuando el campo pierde el foco)
    const handleBlur = useCallback((name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const error = validateField(name, values[name]);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }, [values, validateField]);

    // Validar todo el formulario
    const validateAll = useCallback(() => {
        const newErrors = {};
        const newTouched = {};
        let hasErrors = false;

        Object.keys(validationRules).forEach(name => {
            newTouched[name] = true;
            const error = validateField(name, values[name]);
            if (error) {
                newErrors[name] = error;
                hasErrors = true;
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);

        return !hasErrors;
    }, [values, validationRules, validateField]);

    // Verificar si el formulario es válido
    const isFormValid = useCallback(() => {
        return Object.keys(validationRules).every(name => {
            const value = values[name];
            const error = validateField(name, value);
            return !error;
        });
    }, [values, validationRules, validateField]);

    // Reset del formulario
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setSubmitMessage('');
    }, [initialValues]);

    // Setters para estados externos
    const setSubmitting = useCallback((status) => {
        setIsSubmitting(status);
    }, []);

    const setMessage = useCallback((message) => {
        setSubmitMessage(message);
    }, []);

    // Actualizar valores programáticamente
    const setValue = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    return {
        // Estados
        values,
        errors,
        touched,
        isSubmitting,
        submitMessage,

        // Métodos de manejo
        handleChange,
        handleBlur,
        validateAll,
        isFormValid: isFormValid(),
        resetForm,

        // Setters
        setSubmitting,
        setMessage,
        setValue,

        // Utilidades
        getFieldStatus: (name) => {
            if (errors[name]) return 'error';
            if (touched[name] && values[name] && !errors[name]) return 'valid';
            return 'default';
        },

        hasError: (name) => Boolean(errors[name] && touched[name]),
        isFieldValid: (name) => Boolean(touched[name] && values[name] && !errors[name])
    };
};

/**
 * Hook para manejar Remember Me y persistencia local
 */
export const useRememberMe = (storageKey = 'rememberMeData') => {
    const [rememberMe, setRememberMe] = useState(false);
    const [savedData, setSavedData] = useState({});

    // Cargar datos guardados al inicializar
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                setSavedData(data);
                setRememberMe(true);
            }
        } catch (error) {
            console.warn('Error loading remembered data:', error);
        }
    }, [storageKey]);

    // Guardar datos cuando remember me está activo
    const saveData = useCallback((data) => {
        if (rememberMe && data) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(data));
                setSavedData(data);
            } catch (error) {
                console.warn('Error saving remembered data:', error);
            }
        }
    }, [rememberMe, storageKey]);

    // Limpiar datos guardados
    const clearData = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            setSavedData({});
            setRememberMe(false);
        } catch (error) {
            console.warn('Error clearing remembered data:', error);
        }
    }, [storageKey]);

    // Toggle remember me
    const toggleRememberMe = useCallback((value) => {
        setRememberMe(value);
        if (!value) {
            clearData();
        }
    }, [clearData]);

    return {
        rememberMe,
        savedData,
        toggleRememberMe,
        saveData,
        clearData
    };
};

/**
 * Hook para manejar animaciones y transiciones de UI
 */
export const useUIAnimations = () => {
    // Variantes de animación para Framer Motion
    const containerVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: {
                duration: 0.3
            }
        }
    };

    const fieldVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            marginTop: 0
        },
        visible: {
            opacity: 1,
            height: 'auto',
            marginTop: '0.25rem',
            transition: {
                duration: 0.25,
                ease: 'easeOut'
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    const buttonVariants = {
        default: {
            scale: 1
        },
        hover: {
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: 'easeOut'
            }
        },
        tap: {
            scale: 0.98
        }
    };

    const messageVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: -10
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    return {
        containerVariants,
        fieldVariants,
        buttonVariants,
        messageVariants
    };
};

export default useFormHandler;