import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService } from '../../services/projects.service';
import { Film, AlertCircle } from 'lucide-react';

export default function CreateVideo() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        centralTheme: '',
        durationMinutes: 15,
        language: 'es',
        voiceId: 'default-peter',
        channelName: '',
        videoType: 'documental',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await projectsService.createFullVideo(formData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al crear proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                        <Film className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Crear Video Completo</h1>
                    <p className="text-gray-600 mt-2">Genera un video documental con guión, audio e imágenes</p>
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
                                Título del Video *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input-field"
                                placeholder="Ej: La Historia del Café"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tema Central *
                            </label>
                            <textarea
                                required
                                value={formData.centralTheme}
                                onChange={(e) => setFormData({ ...formData, centralTheme: e.target.value })}
                                className="input-field min-h-[120px]"
                                placeholder="Describe el tema principal del video. Sé específico y detallado..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duración (minutos) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min={5}
                                    max={35}
                                    value={formData.durationMinutes}
                                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                                <p className="text-xs text-gray-500 mt-1">Entre 5 y 35 minutos</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Video
                                </label>
                                <select
                                    value={formData.videoType}
                                    onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="documental">Documental</option>
                                    <option value="educativo">Educativo</option>
                                    <option value="narrativo">Narrativo</option>
                                    <option value="explicativo">Explicativo</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Idioma
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="es">Español</option>
                                    <option value="en">Inglés</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Voz
                                </label>
                                <select
                                    value={formData.voiceId}
                                    onChange={(e) => setFormData({ ...formData, voiceId: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="default-peter">Peter (Masculino)</option>
                                    <option value="default-maria">María (Femenino)</option>
                                    <option value="default-carlos">Carlos (Masculino, grave)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Canal (opcional)
                            </label>
                            <input
                                type="text"
                                value={formData.channelName}
                                onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Mi Canal de YouTube"
                            />
                        </div>

                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <p className="text-sm text-primary-800">
                                <strong>Estimación:</strong> Este video usará aproximadamente{' '}
                                <strong>{10 + (formData.durationMinutes * 2)}</strong> créditos
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary flex-1"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1"
                            >
                                {loading ? 'Creando...' : 'Crear Video'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
