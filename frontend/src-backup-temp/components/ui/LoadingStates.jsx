import React from 'react';
import './LoadingStates.css';

// Skeleton Loaders
export const SkeletonCard = ({ height = '200px', className = '' }) => (
    <div className={`skeleton-card ${className}`} style={{ height }}>
        <div className="skeleton-image skeleton-shimmer"></div>
        <div className="skeleton-content">
            <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-text skeleton-shimmer"></div>
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
    <div className="skeleton-table">
        <div className="skeleton-table-header">
            {Array.from({ length: columns }).map((_, index) => (
                <div key={index} className="skeleton-line skeleton-th skeleton-shimmer"></div>
            ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-table-row">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <div key={colIndex} className="skeleton-line skeleton-td skeleton-shimmer"></div>
                ))}
            </div>
        ))}
    </div>
);

export const SkeletonForm = () => (
    <div className="skeleton-form">
        <div className="skeleton-form-group">
            <div className="skeleton-line skeleton-label skeleton-shimmer"></div>
            <div className="skeleton-input skeleton-shimmer"></div>
        </div>
        <div className="skeleton-form-group">
            <div className="skeleton-line skeleton-label skeleton-shimmer"></div>
            <div className="skeleton-input skeleton-shimmer"></div>
        </div>
        <div className="skeleton-form-group">
            <div className="skeleton-line skeleton-label skeleton-shimmer"></div>
            <div className="skeleton-textarea skeleton-shimmer"></div>
        </div>
        <div className="skeleton-button skeleton-shimmer"></div>
    </div>
);

export const SkeletonProfile = () => (
    <div className="skeleton-profile">
        <div className="skeleton-avatar skeleton-shimmer"></div>
        <div className="skeleton-profile-info">
            <div className="skeleton-line skeleton-name skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-role skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-email skeleton-shimmer"></div>
        </div>
    </div>
);

// Loading Overlays
export const LoadingOverlay = ({ isVisible, message = 'Cargando...', type = 'default' }) => {
    if (!isVisible) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className={`loading-spinner loading-spinner-${type}`}>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

// Success Animations
export const SuccessAnimation = ({ isVisible, message = '¡Éxito!', onComplete }) => {
    React.useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(onComplete, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="success-overlay">
            <div className="success-content">
                <div className="success-checkmark">
                    <div className="checkmark-circle">
                        <div className="checkmark-stem"></div>
                        <div className="checkmark-kick"></div>
                    </div>
                </div>
                <p className="success-message">{message}</p>
            </div>
        </div>
    );
};

// Progress Indicators
export const ProgressBar = ({
    progress = 0,
    label = '',
    showPercentage = true,
    variant = 'primary'
}) => (
    <div className="progress-container">
        {label && <label className="progress-label">{label}</label>}
        <div className="progress-bar-wrapper">
            <div className="progress-bar">
                <div
                    className={`progress-fill progress-${variant}`}
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
            </div>
            {showPercentage && (
                <span className="progress-percentage">{Math.round(progress)}%</span>
            )}
        </div>
    </div>
);

// Pulsating Dots
export const PulsatingDots = ({ count = 3, size = 'medium' }) => (
    <div className="pulsating-dots">
        {Array.from({ length: count }).map((_, index) => (
            <div
                key={index}
                className={`dot dot-${size}`}
                style={{ animationDelay: `${index * 0.2}s` }}
            />
        ))}
    </div>
);

// Typing Animation
export const TypingAnimation = ({ isVisible = true }) => (
    <div className={`typing-animation ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
    </div>
);

// Card Loading State
export const LoadingCard = ({ title = 'Cargando...', description = 'Por favor espera' }) => (
    <div className="loading-card">
        <div className="loading-card-content">
            <div className="loading-spinner-small">
                <div className="spinner-ring-small"></div>
            </div>
            <div className="loading-card-text">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    </div>
);

// Empty States
export const EmptyState = ({
    icon = '📭',
    title = 'No hay datos',
    description = 'No se encontraron elementos',
    action = null
}) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-description">{description}</p>
        {action && <div className="empty-state-action">{action}</div>}
    </div>
);

// Retry Component
export const RetryButton = ({ onRetry, message = 'Error al cargar', isLoading = false }) => (
    <div className="retry-container">
        <p className="retry-message">{message}</p>
        <button
            onClick={onRetry}
            disabled={isLoading}
            className="retry-button"
        >
            {isLoading ? (
                <>
                    <TypingAnimation isVisible={true} />
                    Reintentando...
                </>
            ) : (
                '🔄 Reintentar'
            )}
        </button>
    </div>
);

export default {
    SkeletonCard,
    SkeletonTable,
    SkeletonForm,
    SkeletonProfile,
    LoadingOverlay,
    SuccessAnimation,
    ProgressBar,
    PulsatingDots,
    TypingAnimation,
    LoadingCard,
    EmptyState,
    RetryButton
};