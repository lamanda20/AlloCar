
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { MapPin, Wallet, CheckCircle2, Loader2, X, ChevronDown, CheckSquare, PencilLine, ClipboardList, AlertCircle } from 'lucide-react';

interface CheckoutPageProps {
  id: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ id }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<'pickup' | 'online'>('pickup');
  
  // Données du formulaire comme sur la capture
  const [formData, setFormData] = useState({
    firstName: 'Taha GHADI',
    lastName: '',
    email: 'tahaghadi3@gmail.com',
    phone: '212',
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
    window.scrollTo(0, 0);
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
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulation d'envoi (on garde les dates de la capture pour l'exemple)
      const { error: sbError } = await supabase
        .from('reservations')
        .insert([{
          car_id: car.id,
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
                    Votre demande pour la <span className="text-black font-bold">{car.brand} {car.model}</span> est en cours de traitement.
                </p>
            </div>
            <button onClick={() => window.location.hash = '#/'} className="mt-4 bg-[#2A4E2F] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#1D3621] transition-all">Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  // Calcul du total (exemple sur 7 jours comme la capture)
  const totalLocation = car.price_per_day * 7;

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLONNE GAUCHE - Détails Voiture & Lieu/Heure */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-lg font-black text-gray-900">Détails de la Voiture</h2>
                </div>
                <div className="p-8 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                        {car.brand} {car.model} ({car.year})
                    </h3>
                    <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-wider">{car.city} - Aéroport</p>
                    
                    <div className="my-10 w-full flex justify-center">
                        <img src={car.image_url} alt={car.brand} className="max-w-[280px] h-auto object-contain" />
                    </div>

                    <button 
                        onClick={() => window.location.hash = `#/car/${id}`}
                        className="bg-[#2A4E2F] text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-[#1D3621] transition-all"
                    >
                        Détails de la Voiture
                    </button>
                </div>

                <div className="p-8 border-t border-gray-50 space-y-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-900 font-bold">Location de voiture</span>
                        <span className="text-gray-900 font-black">{totalLocation.toLocaleString()} MAD</span>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-900">Vous avez un code promo ?</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Saisissez votre code" 
                                className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                            />
                            <button className="bg-[#78937E] text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide">Appliquer</button>
                        </div>
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

            {/* Bloc Lieu et Heure */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-900">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-black">Lieu et Heure</h3>
                    </div>
                    <button onClick={() => window.location.hash = `#/car/${id}`} className="flex items-center gap-1 text-[#2A4E2F] font-black text-sm">
                        <PencilLine className="w-4 h-4" />
                        Modifier
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[15px] font-black text-gray-900">Type de Location</span>
                            <span className="bg-[#E9F0EA] text-[#2A4E2F] px-3 py-1 rounded-full text-[11px] font-black uppercase">Récupération</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[13px] font-black text-gray-900 mb-1">Lieu et Heure de Récupération</p>
                            <p className="text-sm text-gray-500 font-bold">09/02/2026 — 20:46</p>
                        </div>
                        <div>
                            <p className="text-[13px] font-black text-gray-900 mb-1">Lieu et Heure de Retour</p>
                            <p className="text-sm text-gray-500 font-bold">16/02/2026 — 20:46</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* COLONNE DROITE - Facturation & Paiement */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Informations de Facturation */}
            <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                <div className="flex items-center gap-3">
                    <div className="bg-[#2A4E2F] p-2 rounded-lg text-white">
                        <ClipboardList className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">Informations de Facturation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Prénom du Conducteur <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                        />
                    </div>
                    <div className="lg:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Nom du Conducteur <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="lastName"
                            placeholder="Entrez le nom de famille"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                        />
                    </div>
                    <div className="lg:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Numéro de téléphone <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <span className="text-lg">🇲🇦</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                            <input 
                                type="tel" 
                                name="phone"
                                value={'+' + formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-16 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Email <span className="text-red-500">*</span></label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                        />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1 space-y-2">
                        <label className="text-[13px] font-black text-gray-900">Pays <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select 
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                            >
                                <option value="Maroc">Maroc</option>
                                <option value="France">France</option>
                                <option value="Espagne">Espagne</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="flex items-start gap-4 cursor-pointer">
                        <div onClick={() => setFormData(f => ({...f, termsAccepted: !f.termsAccepted}))}>
                            {formData.termsAccepted ? <CheckSquare className="w-6 h-6 fill-[#2A4E2F] text-white" /> : <div className="w-6 h-6 border-2 border-gray-100 rounded-md" />}
                        </div>
                        <span className="text-[13px] font-bold text-gray-400 leading-relaxed">
                            J'ai lu et j'accepte les <span className="text-gray-700 underline">Conditions Générales d'Utilisation</span> pour la Location de Véhicule et la <span className="text-gray-700 underline">Politique de Confidentialité</span>.
                        </span>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer">
                        <div onClick={() => setFormData(f => ({...f, consentAccepted: !f.consentAccepted}))}>
                            {formData.consentAccepted ? <CheckSquare className="w-6 h-6 fill-[#2A4E2F] text-white" /> : <div className="w-6 h-6 border-2 border-gray-100 rounded-md" />}
                        </div>
                        <span className="text-[13px] font-bold text-gray-400 leading-relaxed">
                            Oui, je donne mon consentement pour recevoir des informations et des offres personnalisées de <span className="text-gray-700 font-black">AlloCar</span>. Voir notre Politique de Confidentialité.
                        </span>
                    </label>
                </div>
            </section>

            {/* Type de Paiement */}
            <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                <div className="flex items-center gap-3">
                    <div className="bg-[#2A4E2F] p-2 rounded-lg text-white">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">Sélectionner le type de paiement</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed bg-gray-50/30">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                            </div>
                            <span className="text-[13px] font-bold text-gray-400">Carte de crédit ou de débit</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">Bientôt Disponible</span>
                    </div>

                    <button 
                        onClick={() => setPaymentType('pickup')}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${paymentType === 'pickup' ? 'border-[#2A4E2F] bg-white' : 'border-gray-100'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <Wallet className="w-5 h-5 text-gray-900" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-[13px]">Paiement à la récupération</h4>
                        </div>
                        {paymentType === 'pickup' && <div className="w-5 h-5 bg-[#2A4E2F] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                    </button>
                </div>

                <div className="bg-[#FEF9E7] border border-[#F9E79F] p-6 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-[#D4AC0D] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-black text-gray-900 text-sm">Avis Important (Paiement à la Livraison)</p>
                        <p className="text-[13px] text-[#2A4E2F] font-bold leading-relaxed">
                            Les réservations en espèces ne sont pas sécurisées — les agences peuvent annuler si quelqu'un paie en ligne en premier. Confirmez instantanément en payant en ligne.
                        </p>
                    </div>
                </div>
            </section>

            {/* Boutons d'action finaux */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-4">
                <button 
                    onClick={() => window.location.hash = `#/car/${id}`}
                    className="w-full md:w-auto bg-[#333] text-white px-10 py-4 rounded-xl font-black text-[15px] transition-all hover:bg-black"
                >
                    Détails de la Voiture
                </button>
                <button 
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="w-full md:w-auto bg-[#2A4E2F] text-white px-10 py-4 rounded-xl font-black text-[15px] hover:bg-[#1D3621] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2A4E2F]/20"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmer la Réservation'}
                </button>
            </div>
            
            {error && <p className="text-red-500 text-sm font-bold text-right">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
