import React from 'react';
import { useLoadingState } from '../../hooks/useLoadingState';
import { LoadingButton } from './FormField';
import './Modal.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel, userName }) => {
    const {
        isLoading,
        startLoading,
        setLoadingSuccess
    } = useLoadingState();

    const handleLogout = async () => {
        startLoading('Cerrando sesión...');

        try {
            await onConfirm();
            setLoadingSuccess('¡Hasta pronto!');
        } catch (error) {
            console.error('Logout error:', error);
            // Continuar con logout incluso si hay error
            await onConfirm();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container logout-modal">
                <div className="modal-header">
                    <div className="modal-icon">
                        👋
                    </div>
                    <h2 className="modal-title">
                        Cerrar Sesión
                    </h2>
                </div>

                <div className="modal-body">
                    <p className="modal-message">
                        {userName ?
                            `¿Estás seguro que deseas cerrar sesión, ${userName}?` :
                            '¿Estás seguro que deseas cerrar sesión?'
                        }
                    </p>
                    <p className="modal-submessage">
                        Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
                    </p>
                </div>

                <div className="modal-actions">
                    <button
                        onClick={onCancel}
                        className="modal-button modal-cancel"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>

                    <LoadingButton
                        onClick={handleLogout}
                        isLoading={isLoading}
                        loadingText="Cerrando..."
                        className="modal-button modal-confirm"
                        variant="danger"
                    >
                        Cerrar Sesión
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;