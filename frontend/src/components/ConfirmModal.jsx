import React from 'react';
import styles from './ConfirmModal.module.css';

/**
 * Modal de confirmación personalizado
 * Reemplaza el uso de window.confirm para mejor UX y testing
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message = "¿Estás seguro de que quieres continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={`${styles.modalContent} ${styles[type]}`}>
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        ×
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <p>{message}</p>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${styles[type]}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
