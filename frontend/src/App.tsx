import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from './services/auth.service';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyEmail from './components/Auth/VerifyEmail';
import Dashboard from './components/Dashboard/Dashboard';
import CreateVideo from './components/VideoCreator/CreateVideo';
import Checkout from './components/Checkout/Checkout';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Layout wrapper with Navbar
function Layout({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} />
            {children}
        </>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    useEffect(() => {
        // Listen for auth changes
        const checkAuth = () => {
            setIsAuthenticated(authService.isAuthenticated());
        };

        // Check on mount and after navigation
        checkAuth();
        window.addEventListener('storage', checkAuth);

        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes with Navbar */}
                <Route path="/" element={<Layout isAuthenticated={isAuthenticated}><LandingPage /></Layout>} />
                <Route path="/checkout/:planId" element={<Checkout />} />

                {/* Auth Routes (No Navbar) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Protected Routes with Navbar */}
                <Route
                    path="/dashboard"
                    element={
                        <Layout isAuthenticated={isAuthenticated}>
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        </Layout>
                    }
                />
                <Route
                    path="/create-video"
                    element={
                        <Layout isAuthenticated={isAuthenticated}>
                            <ProtectedRoute>
                                <CreateVideo />
                            </ProtectedRoute>
                        </Layout>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
