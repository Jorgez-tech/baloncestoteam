import React, { useState, useEffect } from 'react';
import api from '../api/client';

/**
 * Componente individual para cada imagen de la galería
 */
const GalleryItem = ({ image, onClick }) => {
    return (
        <div className="gallery-item" onClick={() => onClick(image)}>
            <img src={image.url} alt={image.title || 'Imagen de galería'} />
            {image.title && <div className="gallery-item-title">{image.title}</div>}
        </div>
    );
};

/**
 * Modal para visualizar una imagen ampliada
 */
const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">×</button>
                <img src={image.url} alt={image.title || 'Imagen ampliada'} />
                {image.title && <h3>{image.title}</h3>}
                {image.description && <p>{image.description}</p>}
            </div>
        </div>
    );
};

/**
 * Página de galería de imágenes
 */
const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                // En una implementación real, esto llamaría a la API
                // const response = await api.get('/api/images');
                // setImages(response.data);

                // Datos de ejemplo para desarrollo
                const mockImages = [
                    {
                        id: 1,
                        url: 'https://via.placeholder.com/400x300?text=Imagen+1',
                        title: 'Partido inaugural',
                        description: 'Primer partido de la temporada 2024'
                    },
                    {
                        id: 2,
                        url: 'https://via.placeholder.com/400x300?text=Imagen+2',
                        title: 'Entrenamiento',
                        description: 'Sesión de entrenamiento semanal'
                    },
                    {
                        id: 3,
                        url: 'https://via.placeholder.com/400x300?text=Imagen+3',
                        title: 'Torneo regional',
                        description: 'Participación en el torneo regional 2024'
                    },
                    {
                        id: 4,
                        url: 'https://via.placeholder.com/400x300?text=Imagen+4',
                        title: 'Celebración victoria',
                        description: 'Celebración después de ganar el campeonato'
                    },
                    {
                        id: 5,
                        url: 'https://via.placeholder.com/400x300?text=Imagen+5',
                        title: 'Equipo completo',
                        description: 'Foto oficial del equipo temporada 2024-2025'
                    },
                    {
                        id: 6,
                        url: 'https://via.placeholder.com/400x300?text=Imagen+6',
                        title: 'Entrenador con jugadores',
                        description: 'Sesión de estrategia antes del partido'
                    },
                ];

                setImages(mockImages);
                setError(null);
            } catch (err) {
                setError('Error al cargar las imágenes. Intente nuevamente.');
                console.error('Error al cargar imágenes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="gallery-page">
            <div className="gallery-header">
                <h1>Galería</h1>
                <p>Explora los momentos más destacados de nuestro equipo</p>
            </div>

            {loading ? (
                <div className="loading">Cargando imágenes...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="gallery-grid">
                    {images.map((image) => (
                        <GalleryItem
                            key={image.id}
                            image={image}
                            onClick={handleImageClick}
                        />
                    ))}
                </div>
            )}

            <ImageModal image={selectedImage} onClose={closeModal} />
        </div>
    );
};

export default GalleryPage;
