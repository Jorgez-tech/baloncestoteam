import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook para manejar estados de carga premium con múltiples funcionalidades
 */
export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = useState(initialState);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    // Para controlar timeouts y cancelaciones
    const timeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    const startLoading = useCallback((loadingMessage = 'Cargando...') => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        setProgress(0);
        setMessage(loadingMessage);

        // Crear nuevo AbortController para cancelaciones
        abortControllerRef.current = new AbortController();
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
        setMessage('');

        // Limpiar timeout si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // Cancelar peticiones pendientes
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const setLoadingError = useCallback((errorMessage, autoHide = true) => {
        setError(errorMessage);
        setIsLoading(false);

        if (autoHide) {
            timeoutRef.current = setTimeout(() => {
                setError(null);
            }, 5000);
        }
    }, []);

    const setLoadingSuccess = useCallback((successMessage = '¡Completado!', autoHide = true) => {
        setSuccess(true);
        setIsLoading(false);
        setMessage(successMessage);

        if (autoHide) {
            timeoutRef.current = setTimeout(() => {
                setSuccess(false);
                setMessage('');
            }, 3000);
        }
    }, []);

    const updateProgress = useCallback((newProgress, progressMessage = '') => {
        setProgress(Math.max(0, Math.min(100, newProgress)));
        if (progressMessage) {
            setMessage(progressMessage);
        }
    }, []);

    const clearAll = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setSuccess(false);
        setProgress(0);
        setMessage('');

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        isLoading,
        error,
        success,
        progress,
        message,
        startLoading,
        stopLoading,
        setLoadingError,
        setLoadingSuccess,
        updateProgress,
        clearAll,
        // Para peticiones HTTP con cancelación
        getAbortSignal: () => abortControllerRef.current?.signal
    };
};

/**
 * Hook para manejar múltiples estados de carga simultáneos
 */
export const useMultipleLoadingStates = () => {
    const [loadingStates, setLoadingStates] = useState({});

    const startLoading = useCallback((key, message = 'Cargando...') => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                isLoading: true,
                error: null,
                success: false,
                message,
                progress: 0
            }
        }));
    }, []);

    const stopLoading = useCallback((key) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                isLoading: false,
                message: ''
            }
        }));
    }, []);

    const setError = useCallback((key, error) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                isLoading: false,
                error,
                success: false
            }
        }));
    }, []);

    const setSuccess = useCallback((key, message = '¡Completado!') => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                isLoading: false,
                error: null,
                success: true,
                message
            }
        }));
    }, []);

    const updateProgress = useCallback((key, progress, message) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                progress: Math.max(0, Math.min(100, progress)),
                message: message || prev[key]?.message || ''
            }
        }));
    }, []);

    const clearState = useCallback((key) => {
        setLoadingStates(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
        });
    }, []);

    const clearAll = useCallback(() => {
        setLoadingStates({});
    }, []);

    const getState = useCallback((key) => {
        return loadingStates[key] || {
            isLoading: false,
            error: null,
            success: false,
            message: '',
            progress: 0
        };
    }, [loadingStates]);

    const isAnyLoading = Object.values(loadingStates).some(state => state.isLoading);
    const hasAnyError = Object.values(loadingStates).some(state => state.error);
    const hasAnySuccess = Object.values(loadingStates).some(state => state.success);

    return {
        loadingStates,
        startLoading,
        stopLoading,
        setError,
        setSuccess,
        updateProgress,
        clearState,
        clearAll,
        getState,
        isAnyLoading,
        hasAnyError,
        hasAnySuccess
    };
};

/**
 * Hook para simulador de progreso suave
 */
export const useProgressSimulator = (duration = 2000) => {
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const start = useCallback(() => {
        setProgress(0);
        setIsRunning(true);

        const stepSize = 100 / (duration / 50); // 50ms intervals

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + stepSize + Math.random() * stepSize * 0.5;

                if (newProgress >= 100) {
                    setIsRunning(false);
                    clearInterval(intervalRef.current);
                    return 100;
                }

                return newProgress;
            });
        }, 50);
    }, [duration]);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    }, []);

    const complete = useCallback(() => {
        stop();
        setProgress(100);
    }, [stop]);

    const reset = useCallback(() => {
        stop();
        setProgress(0);
    }, [stop]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        progress: Math.round(progress),
        isRunning,
        start,
        stop,
        complete,
        reset
    };
};

/**
 * Hook para retry con backoff exponencial
 */
export const useRetry = (maxRetries = 3, baseDelay = 1000) => {
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [lastError, setLastError] = useState(null);

    const executeWithRetry = useCallback(async (asyncFunction) => {
        let attempts = 0;

        const attemptExecution = async () => {
            try {
                setIsRetrying(attempts > 0);
                const result = await asyncFunction();

                // Reset en caso de éxito
                setRetryCount(0);
                setIsRetrying(false);
                setLastError(null);

                return result;
            } catch (error) {
                attempts++;
                setRetryCount(attempts);
                setLastError(error);

                if (attempts >= maxRetries) {
                    setIsRetrying(false);
                    throw error;
                }

                // Backoff exponencial
                const delay = baseDelay * Math.pow(2, attempts - 1);
                console.log(`Reintento ${attempts}/${maxRetries} en ${delay}ms...`);

                await new Promise(resolve => setTimeout(resolve, delay));
                return attemptExecution();
            }
        };

        return attemptExecution();
    }, [maxRetries, baseDelay]);

    const reset = useCallback(() => {
        setRetryCount(0);
        setIsRetrying(false);
        setLastError(null);
    }, []);

    return {
        retryCount,
        isRetrying,
        lastError,
        executeWithRetry,
        reset,
        canRetry: retryCount < maxRetries
    };
};

export default {
    useLoadingState,
    useMultipleLoadingStates,
    useProgressSimulator,
    useRetry
};