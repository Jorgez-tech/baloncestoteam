import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './Header.jsx';
import Footer from './footer';
import ModernLogin from './ModernLogin';
import Signup from './Signup';
import Gallery from './Gallery';
import AdminDashboard from './AdminDashboard';
import PlayerList from './PlayerList';
import PlayerProfile from './PlayerProfile';
import Home from './Home';
import Profile from './Profile';

// Context
import { AuthProvider, useAuth } from '../context/AuthContext';

// Styles
import '../styles/App.css';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});


// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Public Only Route Component
const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
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

// Main App Component
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Public Routes */}

                            <Route
                                path="/login"
                                element={
                                    <PublicOnlyRoute>
                                        <AppLayout>
                                            <ModernLogin />
                                        </AppLayout>
                                    </PublicOnlyRoute>
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    <PublicOnlyRoute>
                                        <AppLayout>
                                            <Signup />
                                        </AppLayout>
                                    </PublicOnlyRoute>
                                }
                            />

                            {/* Public Routes */}
                            <Route
                                path="/"
                                element={
                                    <AppLayout>
                                        <Home />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/gallery"
                                element={
                                    <AppLayout>
                                        <Gallery />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/players"
                                element={
                                    <AppLayout>
                                        <PlayerList />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/players/:id"
                                element={
                                    <AppLayout>
                                        <PlayerProfile />
                                    </AppLayout>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requireAdmin={true}>
                                        <AppLayout>
                                            <AdminDashboard />
                                        </AppLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <AppLayout>
                                            <Profile />
                                        </AppLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 Route */}
                            <Route
                                path="*"
                                element={
                                    <AppLayout>
                                        <div className="not-found">
                                            <h2>Página no encontrada</h2>
                                            <p>La página que buscas no existe.</p>
                                        </div>
                                    </AppLayout>
                                }
                            />
                        </Routes>

                        {/* Toast notifications */}
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;