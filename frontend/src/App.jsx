import React from 'react';
import './styles/globals/globals.css';
import './styles/components/App.css';

/**
 * Clean Architecture App Component
 * Basketball Team - Reorganized Structure
 */
function App() {
    return (
        <div className="app">
            <div className="app-container">
                <header className="app-header">
                    <h1>Basketball Team - Clean Architecture</h1>
                    <p>Estructura reorganizada exitosamente</p>
                </header>

                <main className="app-main">
                    <section className="status-section">
                        <h2>Estado de Migración</h2>
                        <div className="status-grid">
                            <div className="status-item">
                                <span className="status-label">Estructura Base:</span>
                                <span className="status-value success">✅ Completado</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Archivos Base:</span>
                                <span className="status-value success">✅ Creados</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Componentes:</span>
                                <span className="status-value pending">🔄 Pendiente</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Estilos:</span>
                                <span className="status-value pending">🔄 Pendiente</span>
                            </div>
                        </div>
                    </section>

                    <section className="info-section">
                        <h3>Próximos Pasos</h3>
                        <ul>
                            <li>Migrar ModernLogin.jsx → LoginForm.jsx</li>
                            <li>Consolidar estilos CSS</li>
                            <li>Validar funcionalidad backend</li>
                            <li>Testing completo</li>
                        </ul>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default App;