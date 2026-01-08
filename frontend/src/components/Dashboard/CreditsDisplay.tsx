import { Gem } from 'lucide-react';

interface CreditsDisplayProps {
    credits: number;
}

export default function CreditsDisplay({ credits }: CreditsDisplayProps) {
    return (
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-3">
                <Gem className="w-6 h-6 text-white" />
                <div>
                    <p className="text-white/80 text-sm">Créditos Disponibles</p>
                    <p className="text-white text-2xl font-bold">{credits}</p>
                </div>
            </div>
        </div>
    );
}
