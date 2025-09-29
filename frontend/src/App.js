
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { Link } from "react-router-dom";
import Nosotros from "./components/nosotros";
import Jugadores from "./components/jugadores";
import Contacto from "./components/contacto";

function LoginPlaceholder() {
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Iniciar Sesión</h2>
            <p>Página de inicio de sesión (placeholder)</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
}


function App() {
    return (
        <Router>
            <div className="hero_area">
                {/* Header Section - se recomienda migrar a componente si se desea reutilizar */}
                {/* Aquí podrías importar y usar un componente Header si lo tienes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/jugadores" element={<Jugadores />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/login" element={<LoginPlaceholder />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
<Route path="/login" element={<LoginPlaceholder />} />