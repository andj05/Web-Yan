import { Download, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    status: string;
    progress: number;
    durationMinutes: number;
    creditsUsed: number;
    zipFileUrl?: string;
    createdAt: string;
    processingCompletedAt?: string;
}

interface ProjectListProps {
    projects: Project[];
    onRefresh: () => void;
}

const statusConfig = {
    pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Pendiente' },
    processing: { icon: Loader, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Procesando' },
    completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Completado' },
    failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Fallido' },
};

export default function ProjectList({ projects, onRefresh }: ProjectListProps) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tienes proyectos aún</p>
                <p className="text-gray-400 text-sm mt-2">¡Crea tu primer video para comenzar!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {projects.map((project) => {
                const config = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.pending;
                const Icon = config.icon;

                return (
                    <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${config.bg} ${config.color}`}>
                                        <Icon className="w-4 h-4" />
                                        {config.label}
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                    <span>{project.durationMinutes} min</span>
                                    <span>{project.creditsUsed} créditos</span>
                                    <span>{new Date(project.createdAt).toLocaleDateString('es-ES')}</span>
                                </div>

                                {project.status === 'processing' && (
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progreso</span>
                                            <span className="font-medium text-gray-900">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {project.zipFileUrl && project.status === 'completed' && (
                                <a
                                    href={project.zipFileUrl}
                                    download
                                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar
                                </a>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
