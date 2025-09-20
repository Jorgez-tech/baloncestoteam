import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '', size = 'medium' }) => {
    const [isDark, setIsDark] = useState(false);

    // Detectar tema inicial
    useEffect(() => {
        const savedTheme = localStorage.getItem('basketball-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setIsDark(initialTheme === 'dark');

        // Aplicar tema al documento
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    // Escuchar cambios en la preferencia del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            if (!localStorage.getItem('basketball-theme')) {
                setIsDark(e.matches);
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);

        // Guardar preferencia y aplicar
        localStorage.setItem('basketball-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);

        // Animación de transición
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    };

    return (
        <button
            onClick={toggleTheme}
            className={`theme-toggle theme-toggle-${size} ${className}`}
            aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
            title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                    <div className="theme-icon">
                        {isDark ? '🌙' : '☀️'}
                    </div>
                </div>
                <div className="theme-toggle-background">
                    <div className="stars">
                        <span className="star star-1">✨</span>
                        <span className="star star-2">⭐</span>
                        <span className="star star-3">✨</span>
                    </div>
                    <div className="sun-rays">
                        <span className="ray ray-1">☀️</span>
                        <span className="ray ray-2">🌞</span>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default ThemeToggle;