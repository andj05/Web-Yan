import { useState } from 'react';
import { paymentsService } from '../../services/user.service';
import { Check, Zap } from 'lucide-react';

const plans = [
    {
        id: 1,
        name: 'Básico',
        price: 9.99,
        credits: 50,
        features: ['10 videos', 'Resolución SD', 'Soporte email', 'Imágenes básicas'],
    },
    {
        id: 2,
        name: 'Profesional',
        price: 29.99,
        credits: 200,
        popular: true,
        features: ['50 videos', 'Resolución HD', 'Voces premium', 'Soporte prioritario', 'Imágenes HD'],
    },
    {
        id: 3,
        name: 'Enterprise',
        price: 99.99,
        credits: 1000,
        features: ['Videos ilimitados', 'Resolución 4K', 'API access', 'Soporte 24/7', 'Imágenes premium'],
    },
];

export default function PricingPlans() {
    const [loading, setLoading] = useState<number | null>(null);

    const handleSelectPlan = async (planId: number) => {
        setLoading(planId);
        try {
            const checkoutUrl = await paymentsService.createCheckout(planId);
            window.location.href = checkoutUrl;
        } catch (error: any) {
            alert(error.response?.data?.error || 'Error al procesar pago');
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Elige el Plan Perfecto Para Ti
                    </h1>
                    <p className="text-xl text-gray-600">
                        Comienza a crear videos increíbles con IA
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`card relative animate-slide-up ${plan.popular ? 'ring-2 ring-primary-600 shadow-xl scale-105' : ''
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Zap className="w-4 h-4" />
                                        Más Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-600">/mes</span>
                                </div>
                                <p className="text-primary-600 font-medium mt-2">{plan.credits} créditos incluidos</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                disabled={loading === plan.id}
                                className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'
                                    }`}
                            >
                                {loading === plan.id ? 'Procesando...' : 'Seleccionar Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-gray-600">
                    <p>Todos los planes incluyen acceso a todas las funcionalidades</p>
                    <p className="text-sm mt-2">Puedes cancelar en cualquier momento</p>
                </div>
            </div>
        </div>
    );
}
