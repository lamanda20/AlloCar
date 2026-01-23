
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import { CATEGORIES } from '../constants';
import { SearchState, Car, Transmission, FuelType } from '../types';
import { ChevronRight, ChevronLeft, ChevronDown, Loader2, Database, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../App';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  const getParams = () => new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(getParams());

  useEffect(() => {
    const handleHashChange = () => {
      setSearchParams(getParams());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setCars(data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des voitures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    if (filterCategory && car.category !== filterCategory) return false;

    const cityParam = searchParams.get('city');
    if (cityParam && cityParam !== 'Toutes les villes' && !car.city.toLowerCase().includes(cityParam.toLowerCase())) return false;

    const transParam = searchParams.get('transmission');
    if (transParam && car.transmission !== transParam) return false;

    const fuelParam = searchParams.get('fuel');
    if (fuelParam && car.fuel_type !== fuelParam) return false;

    const seatsParam = searchParams.get('seats');
    if (seatsParam && car.seats !== parseInt(seatsParam)) return false;

    return true;
  });

  const groupedByCity = filteredCars.reduce((acc, car) => {
    if (!acc[car.city]) acc[car.city] = [];
    acc[car.city].push(car);
    return acc;
  }, {} as Record<string, Car[]>);

  const clearFilters = () => {
    window.location.hash = '#/';
    setFilterCategory(null);
  };

  const hasActiveFilters = searchParams.toString() !== '' || filterCategory !== null;

  return (
    <div className="pb-20">
      <section className="relative w-full mt-[100px] px-6">
        <div className="relative h-[550px] w-full max-w-[1400px] mx-auto">
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden z-0">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Hero Background"
              className="w-full h-full object-cover brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <div className="mb-12 flex flex-col items-center">
                 <h1 className="text-4xl md:text-[54px] font-black text-white leading-[1.1] uppercase tracking-tight max-w-[900px]">
                    {t.heroTitle}
                 </h1>
            </div>

            <div className="w-full max-w-5xl">
                <SearchBar onSearch={() => {}} initialState={{
                  location: searchParams.get('city') || '',
                  options: {
                    freeDelivery: false,
                    seats: searchParams.get('seats') ? parseInt(searchParams.get('seats')!) : null,
                    transmission: searchParams.get('transmission') as Transmission || null,
                    fuel: searchParams.get('fuel') as FuelType || null,
                  }
                }} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-12 mb-16">
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
          <div className="flex items-center gap-1.5 px-5 py-3.5 bg-[#f5f5f5] rounded-full border border-gray-100 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-[13px] font-medium text-gray-500">{t.sortBy}</span>
            <span className="text-[13px] font-bold text-gray-900">{t.recent}</span>
            <ChevronDown className="w-4 h-4 text-gray-900 stroke-[2.5px]" />
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2"></div>

          {CATEGORIES.map(cat => (
            <button 
              key={cat.label}
              onClick={() => setFilterCategory(cat.label === filterCategory ? null : cat.label)}
              className={`flex-shrink-0 px-7 py-3.5 rounded-full font-bold text-[13px] transition-all duration-200 whitespace-nowrap ${filterCategory === cat.label ? 'bg-black text-white shadow-lg' : 'bg-[#f5f5f5] text-gray-900 border border-transparent hover:border-gray-300'}`}
            >
              {cat.label}
            </button>
          ))}

          {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-2 px-5 py-3.5 bg-red-50 text-red-600 rounded-full font-bold text-[13px] hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
                {t.searchReset}
              </button>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#2A4E2F]" />
            <p className="text-gray-400 font-bold">{t.loadingCars}</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 gap-6 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <Database className="w-16 h-16 text-gray-200" />
            <div className="text-center">
                <h3 className="text-xl font-black text-gray-900">{t.noCars}</h3>
                <p className="text-gray-500 font-medium">{t.noCarsDesc}</p>
                <button 
                    onClick={clearFilters}
                    className="mt-6 text-[#2A4E2F] font-black underline"
                >
                    {t.seeCatalog}
                </button>
            </div>
          </div>
        ) : (
          (Object.entries(groupedByCity) as [string, Car[]][]).map(([city, cityCars]) => (
            <div key={city} className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-[22px] font-black text-gray-900 flex items-center gap-2 group cursor-pointer">
                  {city} 
                  <span className="ml-2 text-xs font-bold text-[#2A4E2F] bg-[#2A4E2F]/10 px-3 py-1 rounded-full uppercase tracking-widest">{cityCars.length} {t.carsCount}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 stroke-[3px] group-hover:translate-x-1 transition-transform" />
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {cityCars.map(car => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    onClick={(id) => window.location.hash = `#/car/${id}`} 
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
