
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { MapPin, Wallet, CheckCircle2, Loader2, X, ChevronDown, CheckSquare, PencilLine, ClipboardList, AlertCircle, LogIn } from 'lucide-react';
import { useLanguage } from '../App';
import AuthModal from '../components/AuthModal';

interface CheckoutPageProps {
  id: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ id }) => {
  const { user, t } = useLanguage();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<'pickup' | 'online'>('pickup');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Maroc',
    termsAccepted: false,
    consentAccepted: false,
    promoCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const { data, error: sbError } = await supabase.from('cars').select('*').eq('id', id).single();
        if (sbError) throw sbError;
        setCar(data);
      } catch (err) {
        console.error("Error fetching car:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
    window.scrollTo(0, 0);
  }, [id]);

  // Pré-remplir avec les infos utilisateur
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
      }));
    }
  }, [user]);

  if (loading) return (
    <div className="pt-40 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#2A4E2F]" />
      <p className="text-gray-400 font-bold">Préparation de la réservation...</p>
    </div>
  );

  if (!car) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-black text-gray-900">Voiture introuvable</h2>
      <button onClick={() => window.location.hash = '#/'} className="mt-4 text-[#2A4E2F] font-bold underline">Retour à l'accueil</button>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.termsAccepted) {
      setError("Veuillez remplir tous les champs et accepter les conditions.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: sbError } = await supabase
        .from('reservations')
        .insert([{
          car_id: car.id,
          user_id: user.id,
          start_date: '2026-02-09',
          end_date: '2026-02-16',
          start_time: '20:46',
          end_time: '20:46',
          total_price: car.price_per_day * 7,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          delivery_type: 'pickup',
          payment_type: paymentType,
          status: 'pending'
        }]);

      if (sbError) throw sbError;
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-32 max-w-2xl mx-auto px-6 pb-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-16 flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-[#2A4E2F]" />
            </div>
            <div className="space-y-4">
                <h1 className="text-4xl font-black text-gray-900">Réservation Envoyée !</h1>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    Votre demande pour la <span className="text-black font-bold">{car.brand} {car.model}</span> est en cours de traitement. Vous pouvez suivre son statut dans votre historique.
                </p>
            </div>
            <button onClick={() => window.location.hash = '#/my-bookings'} className="mt-4 bg-[#2A4E2F] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#1D3621] transition-all">Voir mes réservations</button>
        </div>
      </div>
    );
  }

  const totalLocation = car.price_per_day * 7;

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {!user && (
          <div className="mb-8 bg-blue-50 border border-blue-100 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <LogIn className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-blue-900 font-bold">Connectez-vous pour finaliser votre réservation plus rapidement.</p>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition-all active:scale-95"
            >
              Se connecter
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-lg font-black text-gray-900">Détails de la Voiture</h2>
                </div>
                <div className="p-8 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{car.brand} {car.model} ({car.year})</h3>
                    <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-wider">{car.city} - Aéroport</p>
                    <div className="my-10 w-full flex justify-center">
                        <img src={car.image_url} alt={car.brand} className="max-w-[280px] h-auto object-contain" />
                    </div>
                </div>
                <div className="p-8 border-t border-gray-50 space-y-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-900 font-bold">Location de voiture (7j)</span>
                        <span className="text-gray-900 font-black">{totalLocation.toLocaleString()} MAD</span>
                    </div>
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-black text-gray-900">Total</span>
                            <span className="text-lg font-black text-gray-900">{totalLocation.toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-900 font-bold">Dépôt</span>
                            <span className="text-gray-900 font-bold">{car.deposit.toFixed(2)} MAD</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                <div className="flex items-center gap-3">
                    <div className="bg-[#2A4E2F] p-2 rounded-lg text-white"><ClipboardList className="w-5 h-5" /></div>
                    <h2 className="text-xl font-black text-gray-900">Informations de Facturation</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Prénom <span className="text-red-500">*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Nom <span className="text-red-500">*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Téléphone <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+212..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900" />
                    </div>
                </div>
                <div className="space-y-4 pt-4">
                    <label className="flex items-start gap-4 cursor-pointer">
                        <div onClick={() => setFormData(f => ({...f, termsAccepted: !f.termsAccepted}))}>
                            {formData.termsAccepted ? <CheckSquare className="w-6 h-6 fill-[#2A4E2F] text-white" /> : <div className="w-6 h-6 border-2 border-gray-100 rounded-md" />}
                        </div>
                        <span className="text-[13px] font-bold text-gray-400 leading-relaxed">J'ai lu et j'accepte les Conditions Générales d'Utilisation.</span>
                    </label>
                </div>
            </section>

            <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                <div className="flex items-center gap-3"><div className="bg-[#2A4E2F] p-2 rounded-lg text-white"><Wallet className="w-5 h-5" /></div><h2 className="text-xl font-black text-gray-900">Paiement</h2></div>
                <button onClick={() => setPaymentType('pickup')} className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${paymentType === 'pickup' ? 'border-[#2A4E2F] bg-white' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-4"><div className="bg-gray-50 p-2 rounded-lg"><Wallet className="w-5 h-5 text-gray-900" /></div><h4 className="font-bold text-gray-900 text-sm">Paiement à la récupération</h4></div>
                    {paymentType === 'pickup' && <div className="w-5 h-5 bg-[#2A4E2F] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                </button>
            </section>

            <div className="flex justify-end gap-4 pt-4">
                <button 
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="w-full md:w-auto bg-[#2A4E2F] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#1D3621] transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (user ? 'Confirmer la Réservation' : 'Se connecter pour réserver')}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-right">{error}</p>}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
    </div>
  );
};

export default CheckoutPage;
