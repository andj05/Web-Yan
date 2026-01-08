import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Mail, CreditCard, CheckCircle, Loader, ArrowLeft } from 'lucide-react';
import { paymentsService } from '../../services/user.service';

interface Plan {
    id: number;
    name: string;
    price: number;
    credits: number;
    features: string[];
}

const plans: Plan[] = [
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

export default function Checkout() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
    });

    // Email verification
    const [emailSent, setEmailSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    useEffect(() => {
        const plan = plans.find(p => p.id === Number(planId));
        if (!plan) {
            navigate('/pricing');
            return;
        }
        setSelectedPlan(plan);
    }, [planId, navigate]);

    const handleSendVerificationCode = async () => {
        // Aquí iría la llamada al backend para enviar el código
        setEmailSent(true);
        // Simulación
        console.log('Código enviado a:', formData.email);
    };

    const handleVerifyCode = () => {
        // Aquí iría la verificación real del código
        if (verificationCode.length === 5) {
            setEmailVerified(true);
        }
    };

    const handleContinueToPayment = () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }
        if (!emailVerified) {
            alert('Por favor verifica tu correo electrónico');
            return;
        }
        setCurrentStep(2);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const checkoutUrl = await paymentsService.createCheckout(selectedPlan!.id);
            window.location.href = checkoutUrl;
        } catch (error: any) {
            alert(error.response?.data?.error || 'Error al procesar pago');
            setLoading(false);
        }
    };

    if (!selectedPlan) return null;

    const tax = selectedPlan.price * 0.18; // ITBIS 18%
    const total = selectedPlan.price + tax;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Steps Indicator */}
                            <div className="flex items-center justify-center mb-8">
                                <StepIndicator number={1} active={currentStep === 1} completed={currentStep > 1} />
                                <div className={`w-24 h-1 ${currentStep > 1 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                                <StepIndicator number={2} active={currentStep === 2} completed={currentStep > 2} />
                                <div className={`w-24 h-1 ${currentStep > 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                                <StepIndicator number={3} active={currentStep === 3} completed={currentStep > 3} />
                            </div>

                            {/* Step 1: Customer Information */}
                            {currentStep === 1 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del Cliente</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="input-field"
                                                placeholder="Ej: Juan"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellido *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="input-field"
                                                placeholder="Ej: Pérez"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico *
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-field flex-1"
                                                placeholder="tu@email.com"
                                                disabled={emailVerified}
                                            />
                                            {!emailVerified && (
                                                <button
                                                    onClick={handleSendVerificationCode}
                                                    disabled={!formData.email || emailSent}
                                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    Verificar
                                                </button>
                                            )}
                                        </div>

                                        {/* Email Verification Section */}
                                        {emailSent && !emailVerified && (
                                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-blue-900">
                                                            Código enviado a {formData.email}
                                                        </p>
                                                        <p className="text-sm text-blue-700">
                                                            Ingresa el código de 5 caracteres que recibiste en tu correo.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        maxLength={5}
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                                        className="input-field text-center text-lg font-mono tracking-wider"
                                                        placeholder="XXXXX"
                                                    />
                                                    <button
                                                        onClick={handleVerifyCode}
                                                        disabled={verificationCode.length !== 5}
                                                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Verificar
                                                    </button>
                                                </div>

                                                <button className="text-sm text-blue-600 hover:text-blue-700 mt-3">
                                                    ↻ Reenviar en 59s
                                                </button>
                                            </div>
                                        )}

                                        {emailVerified && (
                                            <div className="mt-2 flex items-center gap-2 text-green-600">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">Email verificado</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input-field"
                                            placeholder="+1 (809) 000-0000"
                                        />
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Empresa (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="input-field"
                                            placeholder="Nombre de tu empresa"
                                        />
                                    </div>

                                    <button
                                        onClick={handleContinueToPayment}
                                        className="btn-primary w-full text-lg"
                                    >
                                        Continuar al Pago
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Payment Information */}
                            {currentStep === 2 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Pago</h2>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Método de Pago
                                        </label>

                                        <div className="border-2 border-primary-400 bg-primary-50 rounded-lg p-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border-2 border-primary-600 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Link</p>
                                                    <p className="text-sm text-gray-600">Paga seguro con Link</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-blue-900">
                                                Haz clic en el botón de Link para completar tu pago de forma segura.
                                                Una vez completado el pago, tu licencia será generada automáticamente.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Pagar con Link
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="w-full mt-4 py-3 text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Volver
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Purchase Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de Compra</h3>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Plan</p>
                                <p className="text-lg font-bold text-gray-900">{selectedPlan.name}</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-1">Ciclo de Facturación</p>
                                <p className="font-semibold text-gray-900">Mensual</p>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Base Imponible</span>
                                    <span className="font-semibold">${selectedPlan.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">ITBIS (18%)</span>
                                    <span className="font-semibold">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-900 pt-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-gray-900">Total a Pagar</span>
                                    <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-green-900 mb-1">
                                            ✓ Garantía de 30 días
                                        </p>
                                        <p className="text-sm text-green-700">
                                            Si no estás satisfecho, te devolvemos tu dinero.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ number, active, completed }: { number: number; active: boolean; completed: boolean }) {
    return (
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${completed
                ? 'bg-primary-600 text-white'
                : active
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
        >
            {completed ? <Check className="w-6 h-6" /> : number}
        </div>
    );
}
