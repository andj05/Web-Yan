import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        try {
            await authService.register(formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
                <div className="max-w-md w-full">
                    <div className="card text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
                        <p className="text-gray-600 mb-6">
                            Hemos enviado un correo de verificación a <strong>{formData.email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
                        </p>
                        <Link to="/login" className="btn-primary">
                            Ir al Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Crea tu Cuenta</h1>
                    <p className="text-gray-600 mt-2">Comienza a crear videos increíbles con IA</p>
                </div>

                <div className="card animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="input-field pl-11"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field pl-11"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña (mín. 8 caracteres)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field pl-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
