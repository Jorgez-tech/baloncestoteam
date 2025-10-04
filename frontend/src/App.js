
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Nosotros from "./components/nosotros";
import Jugadores from "./components/jugadores";
import Contacto from "./components/contacto";
import Login from "./components/login";
import Registro from "./components/registro";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


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
                    <Route path="/registro" element={<Registro />} />

                    {/* Ruta protegida de administración */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;