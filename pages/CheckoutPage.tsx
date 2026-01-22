
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { ShieldCheck, Truck, MapPin, CreditCard, Wallet, Info, CheckCircle2, Phone, Mail, User, Loader2 } from 'lucide-react';

interface CheckoutPageProps {
  id: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ id }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentType, setPaymentType] = useState<'pickup' | 'online'>('pickup');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Maroc',
    termsAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const { data, error: sbError } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
        if (sbError) throw sbError;
        setCar(data);
      } catch (err) {
        console.error("Error fetching car:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!formData.termsAccepted) {
      setError("Veuillez accepter les conditions générales.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: sbError } = await supabase
        .from('reservations')
        .insert([{
          car_id: car.id,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          start_time: '10:00',
          end_time: '10:00',
          total_price: car.price_per_day,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          delivery_type: deliveryType,
          payment_type: paymentType,
          status: 'pending'
        }]);

      if (sbError) throw sbError;
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Une erreur est survenue lors de la réservation.");
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
                <h1 className="text-4xl font-black text-gray-900">Réservation Confirmée !</h1>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    Votre demande de réservation pour la <span className="text-black font-bold">{car.brand} {car.model}</span> a été envoyée avec succès à l'agence. Vous recevrez un e-mail de confirmation sous peu.
                </p>
            </div>
            <button 
                onClick={() => window.location.hash = '#/'}
                className="mt-4 bg-[#2A4E2F] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#1D3621] transition-all shadow-xl shadow-green-900/20"
            >
                Retour à l'accueil
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b">
                <h2 className="text-xl font-black mb-1">Détails de la Voiture</h2>
            </div>
            <div className="p-10 flex flex-col items-center text-center">
                <h3 className="text-3xl font-black text-gray-900 mb-1">{car.brand} {car.model} {car.year}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">{car.city}</p>
                <img src={car.image_url} alt={car.brand} className="w-full max-h-48 object-contain mb-10" />
                <button 
                  onClick={() => window.location.hash = `#/car/${id}`}
                  className="bg-[#2A4E2F] text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all"
                >
                    Voir la fiche complète
                </button>
            </div>
            <div className="p-8 bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">Prix par jour</span>
                    <span className="font-bold">{car.price_per_day} MAD</span>
                </div>
                <div className="pt-6 border-t border-gray-100 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-black">Total (estimé)</span>
                        <span className="text-lg font-black">{car.price_per_day} MAD</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Caution</span>
                        <span className="text-gray-400 font-bold tracking-tight">{car.deposit} MAD</span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-8 space-y-10">
          {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-2">
                <Info className="w-6 h-6 shrink-0" />
                <p className="font-bold">{error}</p>
            </div>
          )}

          {/* Billing Info */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 md:p-12 space-y-10">
            <div className="flex items-center gap-3">
                <div className="bg-[#2A4E2F] p-2 rounded-lg text-white">
                    <User className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black">Informations de Facturation</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-black flex items-center gap-1">Prénom <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Votre prénom" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#2A4E2F]/20" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-black flex items-center gap-1">Nom <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Votre nom" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#2A4E2F]/20" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-black flex items-center gap-1">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#2A4E2F]/20" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-black flex items-center gap-1">Numéro de téléphone <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="06..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#2A4E2F]/20" 
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 accent-[#2A4E2F]" 
                    />
                    <span className="text-sm font-medium text-gray-500 leading-relaxed">J'ai lu et j'accepte les <span className="text-black font-bold underline">Conditions Générales</span>.</span>
                </label>
            </div>
          </section>

          {/* Payment Type */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 md:p-12 space-y-10">
            <div className="flex items-center gap-3">
                <div className="bg-[#2A4E2F] p-2 rounded-lg text-white">
                    <Wallet className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black">Méthode de Paiement</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                   onClick={() => setPaymentType('pickup')}
                   className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${paymentType === 'pickup' ? 'border-[#2A4E2F] bg-[#2A4E2F]/5' : 'border-gray-100'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-xl">
                             <MapPin className="w-6 h-6 text-gray-400" />
                        </div>
                        <h4 className="font-bold text-gray-900">Paiement sur place</h4>
                    </div>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-gray-100">
                <button 
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-[#2A4E2F] text-white font-black py-5 px-10 rounded-2xl text-lg hover:bg-[#1D3621] transition-all shadow-xl shadow-green-900/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : 'Finaliser la Réservation'}
                </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
