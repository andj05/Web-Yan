import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Film, LogOut, User, CreditCard } from 'lucide-react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

interface NavbarProps {
    isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [credits, setCredits] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            loadUserData();
        }
    }, [isAuthenticated]);

    const loadUserData = async () => {
        try {
            const [userData, creditsData] = await Promise.all([
                userService.getMe(),
                userService.getCredits(),
            ]);
            setUser(userData);
            setCredits(creditsData);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const getInitial = () => {
        if (!user?.fullName) return 'U';
        return user.fullName.charAt(0).toUpperCase();
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">VideoGenerator AI</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                                    Dashboard
                                </Link>
                                <Link to="/create-video" className="text-gray-700 hover:text-primary-600 font-medium">
                                    Crear Video
                                </Link>

                                {/* Credits Badge */}
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg">
                                    <CreditCard className="w-4 h-4 text-primary-600" />
                                    <span className="text-sm font-semibold text-primary-900">{credits} créditos</span>
                                </div>

                                {/* User Avatar Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full font-bold hover:scale-105 transition-transform"
                                    >
                                        {getInitial()}
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fade-in">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Usuario'}</p>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                            </div>

                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-600">Créditos disponibles:</span>
                                                    <span className="text-sm font-bold text-primary-600">{credits}</span>
                                                </div>
                                            </div>

                                            <a
                                                href="/#pricing"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Obtener más créditos
                                            </a>

                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Mi cuenta
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
