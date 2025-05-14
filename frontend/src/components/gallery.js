import React, { useEffect, useState } from 'react';

const Gallery = () => {
    const [index, setIndex] = useState(0);
    const images = [
        { src: 'foto1.jpg', description: 'Jugador 1' },
        { src: 'foto2.jpg', description: 'Jugador 2' },
        { src: 'foto3.jpg', description: 'Jugador 3' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section id="galeria">
            <h2>Galería de Fotos</h2>
            <div className="carousel">
                {images.map((img, i) => (
                    <div key={i} className="carousel-item" style={{ transform: `translateX(-${index * 100}%)` }}>
                        <img src={img.src} alt={`Foto ${i + 1}`} />
                        <p>{img.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;