
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { Link } from "react-router-dom";
import Nosotros from "./components/nosotros";
import Jugadores from "./components/jugadores";
import Contacto from "./components/contacto";
import Login from "./components/login";


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
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;