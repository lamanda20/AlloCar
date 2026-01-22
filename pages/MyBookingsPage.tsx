
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../App';
import { ClipboardList, Calendar, MapPin, Clock, Loader2, Database, ChevronRight, CheckCircle2, Clock3 } from 'lucide-react';

const MyBookingsPage: React.FC = () => {
  const { t, user } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, cars(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error("Erreur historique:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-40 text-center px-6">
        <h2 className="text-2xl font-black text-gray-900">Connectez-vous pour voir vos réservations</h2>
        <button onClick={() => window.location.hash = '#/'} className="mt-6 bg-[#2A4E2F] text-white px-10 py-4 rounded-xl font-bold">Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900">Mes Réservations</h1>
            <p className="text-gray-500 font-bold">Retrouvez l'historique de vos locations sur AlloCar.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#2A4E2F]" />
            <p className="text-gray-400 font-bold">Chargement de votre historique...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-20 flex flex-col items-center text-center gap-8 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
              <Database className="w-12 h-12 text-gray-200" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-gray-900">Aucune réservation pour le moment</h3>
              <p className="text-gray-400 font-bold">Commencez par explorer notre flotte pour trouver votre bonheur.</p>
            </div>
            <button onClick={() => window.location.hash = '#/'} className="bg-[#2A4E2F] text-white px-10 py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">Explorer le catalogue</button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center">
                    <img src={booking.cars?.image_url} alt={booking.cars?.brand} className="max-w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="md:w-2/3 p-10 space-y-8">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900">{booking.cars?.brand} {booking.cars?.model}</h3>
                            <p className="text-[10px] font-black text-[#2A4E2F] uppercase tracking-[0.2em]">Réservation #{booking.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                            {booking.status === 'confirmed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}
                            {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Récupération</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-gray-900">{new Date(booking.start_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                <p className="text-xs text-gray-500 font-bold">{booking.cars?.city} • {booking.start_time}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Retour</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-gray-900">{new Date(booking.end_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                <p className="text-xs text-gray-500 font-bold">{booking.cars?.city} • {booking.end_time}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant Total</span>
                            <span className="text-xl font-black text-gray-900">{booking.total_price.toLocaleString()} MAD</span>
                        </div>
                        <button onClick={() => window.location.hash = `#/car/${booking.cars?.id}`} className="text-[#2A4E2F] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                            Voir le véhicule
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
