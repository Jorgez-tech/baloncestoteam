import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components (mantener importación directa para componentes pequeños)
import Header from './Header.jsx';
import Footer from './Footer';
import Gallery from './Gallery';

// Lazy loading para páginas (componentes grandes)
const Login = React.lazy(() => import('../pages/Login'));
const Signup = React.lazy(() => import('../pages/Signup'));
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard'));
const PlayerList = React.lazy(() => import('../pages/PlayerListPage'));
const PlayerProfile = React.lazy(() => import('../pages/PlayerProfilePage'));
const Home = React.lazy(() => import('../pages/HomePage'));
const Profile = React.lazy(() => import('../pages/Profile'));

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


// Loading component
const LoadingSpinner = () => (
    <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        flexDirection: 'column'
    }}>
        <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '10px', color: '#666' }}>Cargando...</p>
    </div>
);

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

// Main App Layout with Suspense
const AppLayout = ({ children }) => {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <Suspense fallback={<LoadingSpinner />}>
                    {children}
                </Suspense>
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
                                            <Login />
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