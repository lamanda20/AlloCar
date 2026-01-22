
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { Star, MapPin, Users, Settings, Fuel, Calendar, Clock, ChevronRight, Award, ShieldCheck, MessageSquare, Info, Loader2 } from 'lucide-react';

interface CarDetailsPageProps {
  id: string;
}

const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ id }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setCar(data);
      } catch (err) {
        console.error("Erreur récupération voiture:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return (
    <div className="pt-40 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#2A4E2F]" />
      <p className="text-gray-400 font-bold">Chargement des détails...</p>
    </div>
  );

  if (!car) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-black text-gray-900">Voiture introuvable</h2>
      <button onClick={() => window.location.hash = '#/'} className="mt-4 text-[#2A4E2F] font-bold underline">Retour à l'accueil</button>
    </div>
  );

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Main Image & Title */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 flex flex-col items-center">
            <img src={car.image_url} alt={car.brand} className="w-full max-h-[400px] object-contain mb-8" />
            <div className="w-full text-center">
                <h1 className="text-3xl font-black text-gray-900 uppercase">{car.brand} {car.model} {car.year} À {car.city}</h1>
                <div className="flex items-center justify-center gap-8 mt-6">
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span>{car.seats} places</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Fuel className="w-5 h-5 text-gray-400" />
                        <span>{car.fuel_type}</span>
                    </div>
                </div>
            </div>
            
            <div className="w-full border-t border-gray-50 mt-8 pt-8 text-left">
                <p className="text-xl font-bold text-gray-900">Agence : {car.agency_name}</p>
            </div>
          </div>

          {/* Partner Info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-8">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <Award className="w-10 h-10 text-yellow-500" />
                    <div className="font-black leading-tight">
                        Partenaire<br/>Vérifié
                    </div>
                </div>
                <p className="text-gray-500 font-medium">Cette agence a été vérifiée par l'équipe Cardnd pour sa fiabilité.</p>
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-gray-50">
                <div className="w-12 h-12 bg-[#2A4E2F]/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#2A4E2F]" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Géré par {car.agency_name}</h4>
                    <p className="text-sm text-gray-500">Partenaire Premium</p>
                </div>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">Politiques</h2>
            </div>
            <div className="w-12 h-1 bg-[#2A4E2F] mb-4"></div>
            
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-6">
                <div className="bg-gray-50/50 rounded-2xl p-6">
                    <h4 className="font-bold mb-4 text-gray-900">Activité de l'agence</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Taux de confirmation :</span>
                            <span className="font-bold">100%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Confirme généralement sous :</span>
                            <span className="font-bold">moins de 30 min</span>
                        </div>
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                             <ShieldCheck className="w-10 h-10 text-[#2A4E2F] shrink-0" />
                             <p>Pour votre sécurité, effectuez toujours vos réservations sur la plateforme Cardnd.</p>
                        </div>
                    </div>
                </div>

                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border-b">
                    <span className="font-bold">Politique d'annulation</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black">Avis</h2>
            <div className="w-12 h-1 bg-[#2A4E2F] mb-4"></div>
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8">
                <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-black">{car.rating.toFixed(1)}</span>
                    <div className="flex text-yellow-500">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`w-5 h-5 ${i <= car.rating ? 'fill-current' : 'text-gray-200'}`} />)}
                    </div>
                    <span className="text-sm text-gray-500">{car.reviews_count} Avis</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{car.price_per_day} MAD</span>
                    <span className="text-sm text-gray-400 font-bold">/ jour</span>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Caution: {car.deposit} MAD</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                    <div className="p-4 bg-gray-50/30">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Départ</label>
                        <div className="flex items-center justify-between text-sm font-bold">
                            <span>À choisir</span>
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="p-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Retour</label>
                        <div className="flex items-center justify-between text-sm font-bold">
                            <span>À choisir</span>
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
              </div>

              <button 
                onClick={() => setShowConfirmModal(true)}
                className="w-full bg-[#2A4E2F] text-white font-black py-5 rounded-2xl text-lg hover:bg-[#1D3621] transition-all active:scale-95 shadow-lg shadow-green-900/20"
              >
                Réserver
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8">
                <h3 className="text-xl font-bold mb-4 uppercase">{car.city} —</h3>
                <div className="w-12 h-1 bg-[#2A4E2F] mb-6"></div>
                <div className="bg-gray-100 aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <img 
                        src={`https://picsum.photos/seed/${car.id}map/400/400`} 
                        alt="Map" 
                        className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" 
                    />
                    <div className="relative z-10 w-24 h-24 border-4 border-[#2A4E2F] rounded-full flex items-center justify-center">
                         <MapPin className="w-8 h-8 text-[#2A4E2F]" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative animate-in fade-in zoom-in duration-300">
                  <button onClick={() => setShowConfirmModal(false)} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full">
                      <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-black mb-6">Confirmer la sélection</h2>
                  <p className="text-gray-500 mb-8 font-medium">Vous allez être redirigé vers le formulaire de réservation.</p>
                  
                  <div className="flex gap-4">
                      <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-xl transition-all">
                          Annuler
                      </button>
                      <button 
                        onClick={() => window.location.hash = `#/checkout/${id}`}
                        className="flex-1 bg-[#2A4E2F] hover:bg-[#1D3621] text-white font-black py-4 rounded-xl transition-all"
                      >
                          Continuer
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default CarDetailsPage;
