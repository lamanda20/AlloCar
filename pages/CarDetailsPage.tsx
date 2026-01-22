
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { Star, MapPin, Users, Settings, Fuel, Calendar, Clock, ChevronRight, Award, ShieldCheck, Loader2, X, MessageSquare, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../App';
import SearchBar from '../components/SearchBar';
import { TIMES } from '../constants';

interface CarDetailsPageProps { id: string; }

const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ id }) => {
  const { t } = useLanguage();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [selection, setSelection] = useState<{ 
    start: { day: number, month: number, year: number } | null, 
    end: { day: number, month: number, year: number } | null 
  }>({ start: { day: 22, month: 0, year: 2026 }, end: { day: 31, month: 0, year: 2026 } });
  
  const [startTime, setStartTime] = useState('20:43');
  const [endTime, setEndTime] = useState('20:43');
  const [pickerOpen, setPickerOpen] = useState<'none' | 'date' | 'start-time' | 'end-time'>('none');

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
        if (error) throw error;
        setCar(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchCar();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day: number, month: number, year: number) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: { day, month, year }, end: null });
    } else {
      const startVal = new Date(selection.start.year, selection.start.month, selection.start.day).getTime();
      const endVal = new Date(year, month, day).getTime();
      if (endVal < startVal) {
        setSelection({ start: { day, month, year }, end: null });
      } else {
        setSelection({ ...selection, end: { day, month, year } });
        setPickerOpen('start-time');
      }
    }
  };

  const isInRange = (day: number, month: number, year: number) => {
    if (!selection.start || !selection.end) return false;
    const start = new Date(selection.start.year, selection.start.month, selection.start.day).getTime();
    const end = new Date(selection.end.year, selection.end.month, selection.end.day).getTime();
    const current = new Date(year, month, day).getTime();
    return current > start && current < end;
  };

  if (loading) return (
    <div className="pt-40 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#2A4E2F]" />
      <p className="text-gray-400 font-bold">{t.loadingCars}</p>
    </div>
  );

  if (!car) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-black text-gray-900">{t.noCars}</h2>
      <button onClick={() => window.location.hash = '#/'} className="mt-4 text-[#2A4E2F] font-bold underline">{t.returnHome}</button>
    </div>
  );

  const formatDate = (date: {day: number, month: number, year: number} | null) => {
    if(!date) return "Sélectionner";
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.month]} ${date.day}, ${date.year}`;
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="pt-32 pb-12 px-6"><SearchBar onSearch={() => {}} /></div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <div className="relative h-[400px] w-full flex items-center justify-center p-4">
                <img src={car.image_url} alt={car.brand} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="mt-8 text-center border-t border-gray-50 pt-8">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight uppercase">{car.brand} {car.model} {car.year} À {car.city}</h1>
                <div className="flex items-center justify-center gap-6 mt-6 font-bold text-gray-500 text-sm">
                  <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /><span>{car.seats} seats</span></div>
                  <div className="flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /><span>{car.transmission}</span></div>
                  <div className="flex items-center gap-2"><Fuel className="w-5 h-5 text-gray-400" /><span>{car.fuel_type}</span></div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-50 text-left">
                  <h3 className="text-lg font-black text-gray-900">Numéro d'agence-{car.id.slice(0, 10)}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 flex items-center gap-8 shadow-sm">
                <div className="flex items-center gap-4 shrink-0">
                  <Award className="w-12 h-12 text-yellow-500" />
                  <h3 className="text-xl font-black text-gray-900 leading-tight">{t.partnerFounder}</h3>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                <p className="text-gray-500 font-bold text-sm">{t.partnerFounderDesc}</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center"><Users className="w-7 h-7 text-gray-400" /></div>
              <div><h4 className="font-black text-gray-900 text-lg">Géré par {car.agency_name}</h4><p className="text-sm text-gray-400 font-bold">Moins d'un mois sur {t.brand}</p></div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">{t.policies}</h2>
              <div className="w-10 h-1 bg-[#2A4E2F] rounded-full"></div>
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="bg-gray-50/50 rounded-3xl p-8 space-y-6">
                  <h4 className="text-lg font-black text-gray-900">{t.agencyActivity}</h4>
                  <div className="space-y-3 font-bold">
                    <div className="flex justify-between"><span className="text-gray-500">{t.confirmationRate} :</span><span className="text-gray-900">96%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t.confirmationTime} :</span><span className="text-gray-900">1 heure</span></div>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex gap-4 text-gray-500 text-sm leading-relaxed font-bold">
                    <ShieldCheck className="w-6 h-6 text-gray-400 shrink-0" /><p>{t.securityDesc}</p>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  <details className="group py-6 cursor-pointer">
                    <summary className="flex items-center justify-between list-none">
                      <h4 className="text-lg font-black text-gray-900">{t.cancelPolicy}</h4>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-500 font-bold text-sm leading-relaxed whitespace-pre-wrap">
                      {car.cancel_policy || t.cancelPolicyFull}
                    </p>
                  </details>
                  <details className="group py-6 cursor-pointer">
                    <summary className="flex items-center justify-between list-none">
                      <h4 className="text-lg font-black text-gray-900">{t.agencyRules}</h4>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-500 font-bold text-sm leading-relaxed whitespace-pre-wrap">
                      {car.agency_rules || t.agencyRulesNone}
                    </p>
                  </details>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">{t.reviews}</h2>
              <div className="w-10 h-1 bg-[#2A4E2F] rounded-full"></div>
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-baseline gap-2 mb-10"><span className="text-4xl font-black">{car.rating.toFixed(2)}</span><Star className="w-5 h-5 fill-gray-900" /><span className="text-sm text-gray-400 font-bold ml-2">{car.reviews_count} Avis</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-black text-xs text-gray-500">
                  {[{label: t.reviewService, icon: <MessageSquare className="w-4 h-4" />}, {label: t.reviewCondition, icon: <Settings className="w-4 h-4" />}, {label: t.reviewValue, icon: <Award className="w-4 h-4" />}, {label: t.reviewPerformance, icon: <Settings className="w-4 h-4" />}].map((c, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl flex flex-col gap-4"><div className="flex items-center gap-3">{c.icon}<span>{c.label}</span></div><span className="text-lg text-gray-900">5.0</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 space-y-8 relative">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[36px] font-black text-gray-900 leading-none truncate">{car.price_per_day} MAD</span>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Dépôt</span>
                      <span className="text-[13px] font-black text-gray-900 whitespace-nowrap">{car.deposit} MAD</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 font-bold block">pour 1 jour</span>
                </div>

                <div className="border border-gray-200 rounded-[1.5rem] overflow-hidden bg-white">
                  <div className="grid grid-cols-2 border-b border-gray-100">
                    <div onClick={() => setPickerOpen('date')} className="p-4 bg-gray-50/20 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors h-[80px] flex flex-col justify-center">
                      <label className="text-[10px] font-black text-gray-900 uppercase block mb-1">Date de départ</label>
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-900 truncate">{formatDate(selection.start)}</span><Calendar className="w-4 h-4 text-gray-400 shrink-0" /></div>
                    </div>
                    <div onClick={() => setPickerOpen('date')} className="p-4 cursor-pointer hover:bg-gray-50 transition-colors h-[80px] flex flex-col justify-center">
                      <label className="text-[10px] font-black text-gray-900 uppercase block mb-1">Date de retour</label>
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-900 truncate">{formatDate(selection.end)}</span><Calendar className="w-4 h-4 text-gray-400 shrink-0" /></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div onClick={() => setPickerOpen('start-time')} className="p-4 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors h-[80px] flex flex-col justify-center">
                      <label className="text-[10px] font-black text-gray-900 uppercase block mb-1">Heure de départ</label>
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-900">{startTime}</span><Clock className="w-4 h-4 text-gray-400 shrink-0" /></div>
                    </div>
                    <div onClick={() => setPickerOpen('end-time')} className="p-4 cursor-pointer hover:bg-gray-50 transition-colors h-[80px] flex flex-col justify-center">
                      <label className="text-[10px] font-black text-gray-900 uppercase block mb-1">Heure de retour</label>
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-900">{endTime}</span><Clock className="w-4 h-4 text-gray-400 shrink-0" /></div>
                    </div>
                  </div>
                </div>

                <button onClick={() => setShowConfirmModal(true)} className="w-full bg-[#2A4E2F] text-white font-black py-6 rounded-2xl text-lg hover:bg-[#1D3621] transition-all shadow-xl shadow-[#2A4E2F]/20 active:scale-95">{t.reserve}</button>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vous ne serez pas encore facturé</p>

                {pickerOpen === 'date' && (
                  <div ref={pickerRef} className="absolute top-[80px] right-full mr-4 bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-gray-100 p-8 z-[500] w-[640px] animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between mb-8">
                       <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer" />
                       <div className="flex gap-20 font-black text-gray-700"><span>Janvier 2026</span><span>Février 2026</span></div>
                       <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex gap-8">
                       {[31, 28].map((days, m) => (
                         <div key={m} className="grid grid-cols-7 gap-1 text-center flex-1">
                            {['DIM','LUN','MAR','MER','JEU','VEN','SAM'].map(d => <div key={d} className="text-[10px] font-black text-gray-400 mb-2">{d}</div>)}
                            {Array.from({length: days}, (_, i) => i+1).map(d => {
                              const isStart = selection.start?.day === d && selection.start?.month === m;
                              const isEnd = selection.end?.day === d && selection.end?.month === m;
                              const range = isInRange(d, m, 2026);
                              return (
                                <div 
                                  key={d} 
                                  onClick={() => handleDateClick(d, m, 2026)} 
                                  className={`w-10 h-10 flex items-center justify-center text-[13px] rounded-full cursor-pointer transition-all ${
                                    isStart || isEnd ? 'bg-gray-800 text-white font-black' : 
                                    range ? 'bg-gray-100 font-bold text-gray-900' : 
                                    'text-gray-900 font-semibold hover:bg-gray-50'
                                  }`}
                                >
                                  {d}
                                </div>
                              );
                            })}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {(pickerOpen === 'start-time' || pickerOpen === 'end-time') && (
                  <div ref={pickerRef} className="absolute top-1/2 right-full mr-4 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 p-2 z-[500] w-[180px] max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
                    {TIMES.map(time => (
                      <button key={time} onClick={() => { if(pickerOpen === 'start-time') setStartTime(time); else setEndTime(time); setPickerOpen('none'); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700">{time}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 space-y-6">
                <h3 className="text-xl font-black text-gray-900 uppercase">{car.city} — ANFA</h3>
                <div className="w-10 h-1 bg-[#2A4E2F] rounded-full"></div>
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group">
                   <img src={`https://picsum.photos/seed/${car.id}/600/600`} alt="Location" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 rounded-full border-4 border-[#2A4E2F] flex items-center justify-center bg-white/40 backdrop-blur-md shadow-2xl"><MapPin className="w-7 h-7 text-[#2A4E2F]" /></div></div>
                   <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-sm">Leaflet | © OSM © CARTO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
              <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                  <button onClick={() => setShowConfirmModal(false)} className="absolute right-8 top-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                  <div className="space-y-10">
                    <div className="space-y-4"><h2 className="text-3xl font-black text-gray-900">Confirmer les dates et heures</h2><p className="text-gray-500 font-bold leading-relaxed">Merci de confirmer vos heures de départ et de retour.</p></div>
                    <div className="space-y-4 bg-gray-50/50 p-8 rounded-3xl border border-gray-100 font-bold">
                      <div className="flex justify-between items-center"><span className="text-gray-900 font-black">Départ</span><span className="text-gray-500">{formatDate(selection.start)} • {startTime}</span></div>
                      <div className="flex justify-between items-center"><span className="text-gray-900 font-black">Retour</span><span className="text-gray-500">{formatDate(selection.end)} • {endTime}</span></div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center"><span className="text-gray-900 font-black">Nombre de jours</span><span className="text-lg font-black text-[#2A4E2F]">9 Jours</span></div>
                    </div>
                    <div className="flex gap-4"><button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-black py-5 rounded-2xl transition-all">Modifier les heures</button><button onClick={() => window.location.hash = `#/checkout/${id}`} className="flex-1 bg-[#2A4E2F] hover:bg-[#1D3621] text-white font-black py-5 rounded-2xl transition-all shadow-xl">Continuer</button></div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CarDetailsPage;
