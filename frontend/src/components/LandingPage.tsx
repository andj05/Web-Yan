import { Link } from 'react-router-dom';
import { Film, Image, FileText, Mic, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl mb-6">
                        <Film className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Crea Videos Increíbles con
                        <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> Inteligencia Artificial</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Genera videos documentales completos para YouTube con guiones profesionales,
                        voz en off natural e imágenes impresionantes. Todo automático.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <a href="#pricing" className="btn-primary text-lg px-8 py-4">
                            Ver Planes <ArrowRight className="inline ml-2 w-5 h-5" />
                        </a>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                    <FeatureCard
                        icon={<Film className="w-8 h-8" />}
                        title="Videos Completos"
                        description="Guión, audio e imágenes sincronizadas automáticamente"
                        gradient="from-blue-500 to-blue-600"
                    />
                    <FeatureCard
                        icon={<Image className="w-8 h-8" />}
                        title="Imágenes IA"
                        description="Generación estilo Studio Ghibli y más estilos"
                        gradient="from-green-500 to-green-600"
                    />
                    <FeatureCard
                        icon={<FileText className="w-8 h-8" />}
                        title="Guiones Pro"
                        description="Narrativas profesionales y bien estructuradas"
                        gradient="from-purple-500 to-purple-600"
                    />
                    <FeatureCard
                        icon={<Mic className="w-8 h-8" />}
                        title="Voz Natural"
                        description="Text-to-speech con voces premium realistas"
                        gradient="from-orange-500 to-orange-600"
                    />
                </div>

                {/* Pricing Plans Section */}
                <div id="pricing" className="mt-24 scroll-mt-20">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Planes y Precios
                    </h2>
                    <p className="text-center text-gray-600 mb-12 text-lg">
                        Elige el plan perfecto para ti
                    </p>

                    <PricingSection />
                </div>

                {/* How it Works */}
                <div className="mt-24">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        ¿Cómo Funciona?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard
                            number="1"
                            title="Elige tu Plan"
                            description="Selecciona el plan que mejor se adapte a tus necesidades y obtén créditos"
                        />
                        <StepCard
                            number="2"
                            title="Crea tu Video"
                            description="Describe tu tema y la IA generará todo automáticamente"
                        />
                        <StepCard
                            number="3"
                            title="Descarga y Publica"
                            description="Recibe tu video completo listo para subir a YouTube"
                        />
                    </div>
                </div>

                {/* Benefits */}
                <div className="mt-24 bg-white rounded-3xl shadow-xl p-12">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        ¿Por Qué Elegirnos?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BenefitItem text="Ahorra horas de trabajo manual" />
                        <BenefitItem text="Calidad profesional garantizada" />
                        <BenefitItem text="Sin necesidad de experiencia técnica" />
                        <BenefitItem text="Genera videos en minutos, no horas" />
                        <BenefitItem text="Múltiples idiomas disponibles" />
                        <BenefitItem text="Soporte técnico incluido" />
                    </div>
                </div>

                {/* CTA Final */}
                <div className="mt-24 text-center bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        ¿Listo para Crear Videos Increíbles?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Únete a cientos de creadores que ya están usando IA para sus videos
                    </p>
                    <a href="#pricing" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                        Ver Planes
                    </a>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, gradient }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="card hover:shadow-xl transition-shadow animate-slide-up">
            <div className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white mb-4`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
                {number}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="text-gray-700 text-lg">{text}</span>
        </div>
    );
}

// Pricing Section Component
function PricingSection() {
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
                <div
                    key={plan.id}
                    className={`card relative animate-slide-up hover:scale-105 transition-transform ${plan.popular ? 'ring-2 ring-primary-600 shadow-xl' : ''
                        }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
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
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        to={`/checkout/${plan.id}`}
                        className={`block text-center w-full py-3 rounded-lg font-semibold transition-colors ${plan.popular
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            }`}
                    >
                        Seleccionar Plan
                    </Link>
                </div>
            ))}
        </div>
    );
}
