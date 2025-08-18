import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Layout principal de la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar dentro del layout
 * @returns {React.ReactNode} - Layout con header, contenido principal y footer
 */
const MainLayout = ({ children }) => {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
