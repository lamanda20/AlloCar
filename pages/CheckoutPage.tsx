
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { MapPin, Wallet, CheckCircle2, Loader2, X, ChevronDown, CheckSquare, PencilLine, ClipboardList, AlertCircle, LogIn, Calendar, Clock } from 'lucide-react';
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
  
  // Récupérer les paramètres depuis l'URL
  const getParams = () => new URLSearchParams(window.location.hash.split('?')[1] || '');
  const params = getParams();
  
  const bookingParams = {
    start: params.get('start') || new Date().toISOString().split('T')[0],
    end: params.get('end') || new Date().toISOString().split('T')[0],
    startTime: params.get('startTime') || '10:00',
    endTime: params.get('endTime') || '10:00',
    days: parseInt(params.get('days') || '1')
  };

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
      <p className="text-gray-400 font-bold">Préparation du contrat...</p>
    </div>
  );

  if (!car) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-black text-gray-900">Véhicule non trouvé</h2>
      <button onClick={() => window.location.hash = '#/'} className="mt-4 text-[#2A4E2F] font-bold underline">Retour</button>
    </div>
  );

  const totalLocation = car.price_per_day * bookingParams.days;

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
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.termsAccepted) {
      setError("Veuillez remplir les champs obligatoires et accepter les conditions.");
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
          start_date: bookingParams.start,
          end_date: bookingParams.end,
          start_time: bookingParams.startTime,
          end_time: bookingParams.endTime,
          total_price: totalLocation,
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
      setError(err.message || "Erreur de connexion au serveur.");
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
                <h1 className="text-4xl font-black text-gray-900">Demande Envoyée !</h1>
                <p className="text-gray-500 font-medium text-lg">
                    Votre réservation pour la <span className="text-black font-bold">{car.brand} {car.model}</span> est en attente de validation par l'agence.
                </p>
            </div>
            <button onClick={() => window.location.hash = '#/my-bookings'} className="bg-[#2A4E2F] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#1D3621] transition-all">Consulter mon historique</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <h2 className="text-lg font-black text-gray-900">Récapitulatif</h2>
                </div>
                <div className="p-8 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{car.brand} {car.model}</h3>
                    <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-wider">{car.city}</p>
                    <div className="my-8 w-full flex justify-center">
                        <img src={car.image_url} alt={car.brand} className="max-w-[220px] h-auto object-contain" />
                    </div>
                </div>
                <div className="px-8 pb-8 space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Dates de location</p>
                            <p>{new Date(bookingParams.start).toLocaleDateString()} - {new Date(bookingParams.end).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Durée totale</p>
                            <p>{bookingParams.days} {bookingParams.days > 1 ? 'Jours' : 'Jour'}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 border-t border-gray-50 space-y-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Location ({bookingParams.days}j)</span>
                        <span className="text-gray-900 font-black">{totalLocation.toLocaleString()} MAD</span>
                    </div>
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-black text-gray-900 uppercase">Total</span>
                            <span className="text-2xl font-black text-gray-900">{totalLocation.toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase text-gray-400">
                            <span>Dépôt (Caution)</span>
                            <span>{car.deposit.toLocaleString()} MAD</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                <div className="flex items-center gap-3">
                    <div className="bg-[#2A4E2F] p-2 rounded-lg text-white"><ClipboardList className="w-5 h-5" /></div>
                    <h2 className="text-xl font-black text-gray-900">Informations de Contact</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Prénom <span className="text-red-500">*</span></label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ex: Ahmed" className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Nom <span className="text-red-500">*</span></label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Ex: El Amrani" className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold" />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Téléphone <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+212 6..." className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold" />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Email</label>
                        <input type="email" name="email" value={formData.email} disabled className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold text-gray-400 cursor-not-allowed" />
                    </div>
                </div>
                <div className="pt-4">
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div onClick={() => setFormData(f => ({...f, termsAccepted: !f.termsAccepted}))}>
                            {formData.termsAccepted ? <CheckSquare className="w-7 h-7 fill-[#2A4E2F] text-white" /> : <div className="w-7 h-7 border-2 border-gray-100 rounded-lg group-hover:border-gray-300" />}
                        </div>
                        <span className="text-[13px] font-bold text-gray-500">J'accepte les Conditions Générales de Location.</span>
                    </label>
                </div>
            </section>

            <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-10 space-y-8">
                <div className="flex items-center gap-3"><div className="bg-[#2A4E2F] p-2 rounded-lg text-white"><Wallet className="w-5 h-5" /></div><h2 className="text-xl font-black text-gray-900">Paiement</h2></div>
                <button onClick={() => setPaymentType('pickup')} className={`w-full p-8 rounded-2xl border-2 transition-all flex items-center justify-between ${paymentType === 'pickup' ? 'border-[#2A4E2F] bg-gray-50/50 shadow-inner' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-5">
                        <div className="bg-white p-3 rounded-xl shadow-sm"><Wallet className="w-6 h-6 text-[#2A4E2F]" /></div>
                        <div className="text-left">
                            <h4 className="font-black text-gray-900 text-base uppercase tracking-tight">Paiement sur place</h4>
                            <p className="text-xs text-gray-400 font-bold">Réglez directement auprès de l'agence à la prise du véhicule.</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentType === 'pickup' ? 'border-[#2A4E2F] bg-[#2A4E2F]' : 'border-gray-200'}`}>
                        {paymentType === 'pickup' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                </button>
            </section>

            <div className="flex flex-col gap-4">
                <button 
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="w-full bg-[#2A4E2F] text-white py-6 rounded-2xl font-black text-xl hover:bg-[#1D3621] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#2A4E2F]/20 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-7 h-7 animate-spin" /> : 'Confirmer ma Réservation'}
                </button>
                {error && (
                    <div className="flex items-center gap-2 justify-center text-red-500 font-bold text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="login" />
    </div>
  );
};

export default CheckoutPage;
