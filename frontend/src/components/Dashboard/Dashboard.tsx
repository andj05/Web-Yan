import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { projectsService } from '../../services/projects.service';
import { Film, TrendingUp, Clock } from 'lucide-react';
import ProjectList from './ProjectList.tsx';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [userData, , projectsData] = await Promise.all([
                userService.getMe(),
                userService.getCredits(),
                projectsService.getProjects(20),
            ]);

            setUser(userData);
            setProjects(projectsData.projects);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin text-primary-600">
                    <Clock className="w-12 h-12" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        ¡Bienvenido de nuevo, {user?.fullName?.split(' ')[0] || 'Usuario'}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Aquí puedes gestionar tus proyectos y crear nuevo contenido
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/create-video"
                        className="card hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                <Film className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Crear Video Completo</h3>
                                <p className="text-sm text-gray-600">Guión + Audio + Imágenes</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/modules/images"
                        className="card hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Solo Imágenes</h3>
                                <p className="text-sm text-gray-600">Genera imágenes con IA</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/pricing"
                        className="card hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-r from-primary-50 to-purple-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <span className="text-2xl">💎</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Obtener Más Créditos</h3>
                                <p className="text-sm text-gray-600">Ver planes disponibles</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Projects List */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus Proyectos</h2>
                    <ProjectList projects={projects} onRefresh={loadData} />
                </div>
            </main>
        </div>
    );
}
