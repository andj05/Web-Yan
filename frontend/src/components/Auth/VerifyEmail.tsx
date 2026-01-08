import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token de verificación no proporcionado');
                return;
            }

            try {
                const result = await authService.verifyEmail(token);
                setStatus('success');
                setMessage(result.message || 'Email verificado exitosamente');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Error al verificar email');
            }
        };

        verifyToken();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
            <div className="max-w-md w-full">
                <div className="card text-center animate-fade-in">
                    {status === 'loading' && (
                        <>
                            <Loader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando Email...</h2>
                            <p className="text-gray-600">Por favor espera un momento</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email Verificado!</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary"
                            >
                                Ir al Login
                            </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                                <XCircle className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Verificación</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-secondary"
                            >
                                Volver al Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
