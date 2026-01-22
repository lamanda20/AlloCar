
import React, { useState, useRef, useEffect } from 'react';
import { Search, Building, Plane, Landmark, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { CITIES, TIMES } from '../constants';
import { SearchState, Transmission, FuelType } from '../types';

interface SearchBarProps {
  onSearch: (state: SearchState) => void;
  initialState?: Partial<SearchState>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialState }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const [selection, setSelection] = useState<{ 
    start: { day: number, month: number, year: number } | null, 
    end: { day: number, month: number, year: number } | null 
  }>({ 
    start: { day: 22, month: 0, year: 2026 }, 
    end: { day: 2, month: 1, year: 2026 } 
  });

  const [search, setSearch] = useState<SearchState>({
    location: '',
    startDate: 'Jan 22',
    endDate: 'Feb 2',
    startTime: 'Heure',
    endTime: 'Heure',
    options: {
      freeDelivery: false,
      seats: null,
      transmission: null,
      fuel: null,
    },
    ...initialState
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDateInPast = (day: number, month: number, year: number) => {
    const target = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return target < today;
  };

  const handleDateClick = (day: number, month: number, year: number) => {
    if (isDateInPast(day, month, year)) return;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: { day, month, year }, end: null });
      setSearch(prev => ({ ...prev, startDate: `${monthNames[month]} ${day}`, endDate: '...' }));
    } else {
      const startVal = new Date(selection.start.year, selection.start.month, selection.start.day).getTime();
      const endVal = new Date(year, month, day).getTime();

      if (endVal < startVal) {
        setSelection({ start: { day, month, year }, end: null });
        setSearch(prev => ({ ...prev, startDate: `${monthNames[month]} ${day}`, endDate: '...' }));
      } else {
        setSelection({ ...selection, end: { day, month, year } });
        setSearch(prev => ({ ...prev, endDate: `${monthNames[month]} ${day}` }));
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

  const toggleOption = (key: keyof SearchState['options'], value: any) => {
    setSearch(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: prev.options[key] === value ? null : value
      }
    }));
  };

  const handleSearchClick = () => {
    // On construit l'URL avec tous les paramètres
    const params = new URLSearchParams();
    if (search.location) params.set('city', search.location);
    if (search.options.transmission) params.set('transmission', search.options.transmission);
    if (search.options.fuel) params.set('fuel', search.options.fuel);
    if (search.options.seats) params.set('seats', search.options.seats.toString());
    
    window.location.hash = `#/search?${params.toString()}`;
    setActiveTab(null);
    onSearch(search);
  };

  const renderPopover = () => {
    if (!activeTab) return null;

    let positioningClass = "left-0";
    if (activeTab === 'date') positioningClass = "left-1/2 -translate-x-1/2 w-[720px]";
    if (activeTab.includes('time')) positioningClass = "right-[20%] w-[200px]";
    if (activeTab === 'options') positioningClass = "right-0 w-[420px]";

    return (
      <div 
        ref={popoverRef}
        className={`absolute top-full mt-4 bg-white rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-gray-50 z-[200] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ${positioningClass}`}
      >
        {activeTab === 'location' && (
          <div className="p-6 w-[450px]">
            <h4 className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-6 px-4">Destinations suggérées</h4>
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar px-2 space-y-1">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => { setSearch(s => ({ ...s, location: city.name })); setActiveTab('date'); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all text-left group ${search.location === city.name ? 'bg-[#f5f5f5]' : 'hover:bg-[#f8f8f8]'}`}
                >
                  <div className={`w-14 h-14 rounded-[1.3rem] flex items-center justify-center shrink-0 ${
                    city.icon === 'plane' ? 'bg-[#1D2B44]' : 
                    city.icon === 'building' ? 'bg-[#4B829F]' : 
                    city.icon === 'landmark' ? 'bg-[#A86E3A]' : 'bg-[#2A4E2F]'
                  } text-white shadow-sm transition-transform group-hover:scale-105`}>
                    {city.icon === 'plane' ? <Plane className="w-7 h-7" /> : city.icon === 'building' ? <Building className="w-7 h-7" /> : <Landmark className="w-7 h-7" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-gray-900 text-[15px]">{city.name}</div>
                    <div className="text-[12px] text-gray-400 font-bold leading-tight">{city.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'date' && (
          <div className="p-10">
            <div className="flex items-center justify-between mb-10 px-6">
               <button className="p-3 hover:bg-gray-50 rounded-full border border-gray-100 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
               <div className="flex gap-40">
                  <div className="font-black text-gray-700 text-[18px] tracking-tight">Janvier 2026</div>
                  <div className="font-black text-gray-700 text-[18px] tracking-tight">Février 2026</div>
               </div>
               <button className="p-3 hover:bg-gray-50 rounded-full border border-gray-100 transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="flex gap-16 px-4">
               {/* January Calendar */}
               <div className="grid grid-cols-7 gap-y-2 text-center">
                  {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map(d => <div key={d} className="text-[11px] font-black text-gray-400 mb-4">{d}</div>)}
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => {
                    const disabled = isDateInPast(d, 0, 2026);
                    const isStart = selection.start?.day === d && selection.start?.month === 0;
                    const isEnd = selection.end?.day === d && selection.end?.month === 0;
                    const range = isInRange(d, 0, 2026);
                    
                    return (
                      <div 
                        key={d} 
                        onClick={() => handleDateClick(d, 0, 2026)}
                        className={`w-11 h-11 flex items-center justify-center text-[13px] rounded-full cursor-pointer transition-all ${
                          isStart ? 'bg-gray-800 text-white font-black z-10' : 
                          isEnd ? 'bg-black text-white font-black z-10 scale-110 shadow-lg' :
                          range ? 'bg-gray-100 text-gray-900 font-bold' : 
                          disabled ? 'text-gray-200 cursor-not-allowed' : 'text-gray-900 font-bold hover:bg-gray-50'
                        }`}
                      >
                        {d}
                      </div>
                    );
                  })}
               </div>
               {/* February Calendar */}
               <div className="grid grid-cols-7 gap-y-2 text-center">
                  {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map(d => <div key={d} className="text-[11px] font-black text-gray-400 mb-4">{d}</div>)}
                  {Array.from({length: 28}, (_, i) => i + 1).map(d => {
                    const disabled = isDateInPast(d, 1, 2026);
                    const isStart = selection.start?.day === d && selection.start?.month === 1;
                    const isEnd = selection.end?.day === d && selection.end?.month === 1;
                    const range = isInRange(d, 1, 2026);
                    
                    return (
                      <div 
                        key={d} 
                        onClick={() => handleDateClick(d, 1, 2026)}
                        className={`w-11 h-11 flex items-center justify-center text-[13px] rounded-full cursor-pointer transition-all ${
                          isStart ? 'bg-gray-800 text-white font-black z-10' : 
                          isEnd ? 'bg-black text-white font-black z-10 scale-110 shadow-lg' :
                          range ? 'bg-gray-100 text-gray-900 font-bold' : 
                          disabled ? 'text-gray-200 cursor-not-allowed' : 'text-gray-900 font-bold hover:bg-gray-50'
                        }`}
                      >
                        {d}
                      </div>
                    );
                  })}
               </div>
            </div>
            
            <div className="mt-12 flex justify-end px-4">
               <button onClick={() => setActiveTab('time-start')} className="bg-black text-white px-12 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-black/10 uppercase tracking-widest">
                  Suivant
               </button>
            </div>
          </div>
        )}

        {activeTab.includes('time') && (
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-3">
            {TIMES.map(t => (
              <button 
                key={t}
                onClick={() => {
                  if(activeTab === 'time-start') {
                    setSearch(s => ({...s, startTime: t}));
                    setActiveTab('time-end');
                  } else {
                    setSearch(s => ({...s, endTime: t}));
                    setActiveTab('options');
                  }
                }}
                className={`w-full py-4 px-6 text-[14px] font-bold text-left transition-all rounded-2xl mb-1 ${
                  (activeTab === 'time-start' && search.startTime === t) || (activeTab === 'time-end' && search.endTime === t)
                  ? 'bg-[#f0f0f0] text-black scale-[0.98]' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'options' && (
          <div className="p-10 space-y-10">
            <div className="space-y-4">
                <h5 className="text-[15px] font-black text-gray-900">Livraison</h5>
                <div className="flex items-center justify-between">
                    <p className="text-[13px] text-gray-500 font-bold pr-10 leading-relaxed">Afficher uniquement les agences avec livraison gratuite</p>
                    <button 
                        onClick={() => setSearch(s => ({...s, options: {...s.options, freeDelivery: !s.options.freeDelivery}}))}
                        className={`transition-all active:scale-90 ${search.options.freeDelivery ? 'text-black' : 'text-gray-200'}`}
                    >
                        {search.options.freeDelivery ? <CheckSquare className="w-8 h-8 fill-black text-white" /> : <Square className="w-8 h-8 stroke-[1.5px]" />}
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                <h5 className="text-[15px] font-black text-gray-900">Sièges</h5>
                <div className="flex gap-3">
                    {[2, 4, 5, 7, 9].map(n => (
                        <button 
                            key={n}
                            onClick={() => toggleOption('seats', n)}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-[14px] font-black transition-all ${
                                search.options.seats === n ? 'bg-black text-white border-black shadow-lg' : 'border-gray-100 text-gray-900 hover:border-gray-400'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-5">
                <h5 className="text-[15px] font-black text-gray-900">Boîte</h5>
                <div className="flex gap-4">
                    {['Manual', 'Automatic'].map((type) => {
                        const val = type === 'Manual' ? 'Manuelle' : 'Automatique';
                        return (
                          <button 
                              key={type}
                              onClick={() => toggleOption('transmission', val)}
                              className={`px-8 py-3.5 rounded-full border-2 text-[14px] font-black transition-all ${
                                  search.options.transmission === val ? 'bg-black text-white border-black shadow-lg' : 'border-gray-100 text-gray-900 hover:border-gray-400'
                              }`}
                          >
                              {type}
                          </button>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-5">
                <h5 className="text-[15px] font-black text-gray-900">Carburant</h5>
                <div className="flex flex-wrap gap-4">
                    {['Essence', 'Diesel', 'Hybride', 'Électrique'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => toggleOption('fuel', type as FuelType)}
                            className={`px-8 py-3.5 rounded-full border-2 text-[14px] font-black transition-all ${
                                search.options.fuel === type ? 'bg-black text-white border-black shadow-lg' : 'border-gray-100 text-gray-900 hover:border-gray-400'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <button 
                    onClick={() => setSearch(s => ({...s, options: {freeDelivery: false, seats: null, transmission: null, fuel: null}}))}
                    className="text-gray-900 font-black text-[14px] underline hover:text-red-500 transition-colors"
                >
                    Réinitialiser
                </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative max-w-[1000px] mx-auto w-full">
      <div className="bg-white rounded-full shadow-[0_15px_50px_rgba(0,0,0,0.12)] flex items-center p-2.5 border border-gray-100 h-[88px] relative z-[200]">
        {/* Lieu */}
        <button 
          onClick={() => setActiveTab('location')}
          className={`flex-[1.2] flex flex-col items-start px-9 py-2 rounded-full transition-all text-left group ${activeTab === 'location' ? 'bg-[#f0f0f0]' : 'hover:bg-gray-50'}`}
        >
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-1">Lieu</span>
          <span className={`text-[13px] truncate w-full font-bold ${search.location ? 'text-black' : 'text-gray-400'}`}>
            {search.location || 'Chercher une destination'}
          </span>
        </button>

        <div className="w-[1.5px] h-10 bg-gray-100 mx-1"></div>

        {/* Date */}
        <button 
          onClick={() => setActiveTab('date')}
          className={`flex-[1.5] flex flex-col items-start px-9 py-2 rounded-full transition-all text-left ${activeTab === 'date' ? 'bg-[#f0f0f0]' : 'hover:bg-gray-50'}`}
        >
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-1">Date</span>
          <span className={`text-[13px] truncate w-full font-bold ${search.startDate ? 'text-black' : 'text-gray-400'}`}>
            {search.startDate ? `${search.startDate} - ${search.endDate}` : 'Ajouter une date'}
          </span>
        </button>

        <div className="w-[1.5px] h-10 bg-gray-100 mx-1"></div>

        {/* Heure Départ */}
        <button 
          onClick={() => setActiveTab('time-start')}
          className={`flex-1 flex flex-col items-start px-7 py-2 rounded-full transition-all text-left ${activeTab === 'time-start' ? 'bg-[#f0f0f0]' : 'hover:bg-gray-50'}`}
        >
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-1">Départ</span>
          <span className={`text-[13px] font-bold ${search.startTime !== 'Heure' ? 'text-black' : 'text-gray-400'}`}>
            {search.startTime}
          </span>
        </button>

        <div className="w-[1.5px] h-10 bg-gray-100 mx-1"></div>

        {/* Heure Retour */}
        <button 
          onClick={() => setActiveTab('time-end')}
          className={`flex-1 flex flex-col items-start px-7 py-2 rounded-full transition-all text-left ${activeTab === 'time-end' ? 'bg-[#f0f0f0]' : 'hover:bg-gray-50'}`}
        >
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-1">Retour</span>
          <span className={`text-[13px] font-bold ${search.endTime !== 'Heure' ? 'text-black' : 'text-gray-400'}`}>
            {search.endTime}
          </span>
        </button>

        <div className="w-[1.5px] h-10 bg-gray-100 mx-1"></div>

        {/* Options */}
        <button 
          onClick={() => setActiveTab('options')}
          className={`flex-1 flex flex-col items-start px-7 py-2 rounded-full transition-all text-left ${activeTab === 'options' ? 'bg-[#f0f0f0]' : 'hover:bg-gray-50'}`}
        >
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-1">Options</span>
          <span className="text-[13px] font-bold text-gray-400">Filtrer</span>
        </button>

        {/* Action Button */}
        <button 
          onClick={handleSearchClick}
          className="bg-black text-white w-[68px] h-[68px] rounded-full flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95 ml-2 shrink-0 shadow-2xl shadow-black/30 group"
        >
          <Search className="w-7 h-7 stroke-[3.5px] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {renderPopover()}
    </div>
  );
};

export default SearchBar;
