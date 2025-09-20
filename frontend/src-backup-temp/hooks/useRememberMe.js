import { useState, useEffect, useCallback } from 'react';

const REMEMBER_ME_KEY = 'basketball_remember_me';
const REMEMBER_EMAIL_KEY = 'basketball_remember_email';
const AUTO_LOGIN_KEY = 'basketball_auto_login';

/**
 * Hook para manejar la funcionalidad "Remember Me" y auto-login
 */
export const useRememberMe = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const [rememberedEmail, setRememberedEmail] = useState('');
    const [autoLogin, setAutoLogin] = useState(false);

    // Cargar configuración guardada al inicializar
    useEffect(() => {
        try {
            const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
            const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY) || '';
            const savedAutoLogin = localStorage.getItem(AUTO_LOGIN_KEY) === 'true';

            setRememberMe(savedRememberMe);
            setRememberedEmail(savedEmail);
            setAutoLogin(savedAutoLogin);
        } catch (error) {
            console.warn('Error loading remember me settings:', error);
        }
    }, []);

    // Guardar email cuando remember me está activo
    const saveCredentials = useCallback((email, shouldRemember, shouldAutoLogin = false) => {
        try {
            if (shouldRemember) {
                localStorage.setItem(REMEMBER_ME_KEY, 'true');
                localStorage.setItem(REMEMBER_EMAIL_KEY, email);
                setRememberMe(true);
                setRememberedEmail(email);
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
                localStorage.removeItem(REMEMBER_EMAIL_KEY);
                setRememberMe(false);
                setRememberedEmail('');
            }

            if (shouldAutoLogin) {
                localStorage.setItem(AUTO_LOGIN_KEY, 'true');
                setAutoLogin(true);
            } else {
                localStorage.removeItem(AUTO_LOGIN_KEY);
                setAutoLogin(false);
            }
        } catch (error) {
            console.error('Error saving remember me settings:', error);
        }
    }, []);

    // Limpiar datos guardados
    const clearRememberedData = useCallback(() => {
        try {
            localStorage.removeItem(REMEMBER_ME_KEY);
            localStorage.removeItem(REMEMBER_EMAIL_KEY);
            localStorage.removeItem(AUTO_LOGIN_KEY);
            setRememberMe(false);
            setRememberedEmail('');
            setAutoLogin(false);
        } catch (error) {
            console.error('Error clearing remember me settings:', error);
        }
    }, []);

    // Toggle remember me
    const toggleRememberMe = useCallback((shouldRemember) => {
        setRememberMe(shouldRemember);

        if (!shouldRemember) {
            // Si se desactiva remember me, también limpiar auto-login
            localStorage.removeItem(REMEMBER_ME_KEY);
            localStorage.removeItem(REMEMBER_EMAIL_KEY);
            localStorage.removeItem(AUTO_LOGIN_KEY);
            setRememberedEmail('');
            setAutoLogin(false);
        } else {
            localStorage.setItem(REMEMBER_ME_KEY, 'true');
        }
    }, []);

    // Toggle auto login
    const toggleAutoLogin = useCallback((shouldAutoLogin) => {
        setAutoLogin(shouldAutoLogin);

        if (shouldAutoLogin) {
            localStorage.setItem(AUTO_LOGIN_KEY, 'true');
            // Auto login requiere remember me
            if (!rememberMe) {
                localStorage.setItem(REMEMBER_ME_KEY, 'true');
                setRememberMe(true);
            }
        } else {
            localStorage.removeItem(AUTO_LOGIN_KEY);
        }
    }, [rememberMe]);

    return {
        rememberMe,
        rememberedEmail,
        autoLogin,
        saveCredentials,
        clearRememberedData,
        toggleRememberMe,
        toggleAutoLogin
    };
};

/**
 * Hook para manejar auto-login al iniciar la aplicación
 */
export const useAutoLogin = () => {
    const [shouldAttemptAutoLogin, setShouldAttemptAutoLogin] = useState(false);
    const [autoLoginChecked, setAutoLoginChecked] = useState(false);

    useEffect(() => {
        const checkAutoLogin = () => {
            try {
                const hasAutoLogin = localStorage.getItem(AUTO_LOGIN_KEY) === 'true';
                const hasRefreshToken = !!localStorage.getItem('refreshToken');
                const hasAccessToken = !!localStorage.getItem('accessToken');
                const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);

                // Auto login solo si:
                // 1. Está configurado
                // 2. Hay tokens guardados
                // 3. Hay email recordado
                const shouldTryAutoLogin = hasAutoLogin &&
                    (hasRefreshToken || hasAccessToken) &&
                    rememberedEmail;

                setShouldAttemptAutoLogin(shouldTryAutoLogin);
                setAutoLoginChecked(true);

                if (shouldTryAutoLogin) {
                    console.log('Auto-login attempt will be made for:', rememberedEmail);
                }
            } catch (error) {
                console.error('Error checking auto-login:', error);
                setAutoLoginChecked(true);
            }
        };

        // Verificar después de un pequeño delay para permitir que otros efectos se ejecuten
        const timer = setTimeout(checkAutoLogin, 100);

        return () => clearTimeout(timer);
    }, []);

    const completeAutoLogin = useCallback(() => {
        setShouldAttemptAutoLogin(false);
    }, []);

    const skipAutoLogin = useCallback(() => {
        setShouldAttemptAutoLogin(false);
        // Opcional: desactivar auto-login si falla
        localStorage.removeItem(AUTO_LOGIN_KEY);
    }, []);

    return {
        shouldAttemptAutoLogin,
        autoLoginChecked,
        completeAutoLogin,
        skipAutoLogin
    };
};

/**
 * Hook para gestionar el estado de sesiones múltiples
 */
export const useSessionManager = () => {
    const [activeSessions, setActiveSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    // Generar ID único para la sesión actual
    useEffect(() => {
        const sessionId = generateSessionId();
        setCurrentSessionId(sessionId);

        // Registrar sesión actual
        registerSession(sessionId);

        // Cleanup al cerrar
        const handleBeforeUnload = () => {
            unregisterSession(sessionId);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            unregisterSession(sessionId);
        };
    }, []);

    const generateSessionId = () => {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const registerSession = (sessionId) => {
        try {
            const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
            const newSessions = [...sessions, {
                id: sessionId,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            }];

            localStorage.setItem('active_sessions', JSON.stringify(newSessions));
            setActiveSessions(newSessions);
        } catch (error) {
            console.error('Error registering session:', error);
        }
    };

    const unregisterSession = (sessionId) => {
        try {
            const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
            const filteredSessions = sessions.filter(session => session.id !== sessionId);

            localStorage.setItem('active_sessions', JSON.stringify(filteredSessions));
            setActiveSessions(filteredSessions);
        } catch (error) {
            console.error('Error unregistering session:', error);
        }
    };

    const clearAllSessions = () => {
        try {
            localStorage.removeItem('active_sessions');
            setActiveSessions([]);
        } catch (error) {
            console.error('Error clearing sessions:', error);
        }
    };

    return {
        activeSessions,
        currentSessionId,
        clearAllSessions
    };
};

export default {
    useRememberMe,
    useAutoLogin,
    useSessionManager
};