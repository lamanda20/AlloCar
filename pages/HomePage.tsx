
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import { CATEGORIES } from '../constants';
import { SearchState, Car } from '../types';
import { ChevronRight, ChevronLeft, ChevronDown, Loader2, Database, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const HomePage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.hash.split('?')[1]));

  // Écouter les changements de hash pour mettre à jour les filtres
  useEffect(() => {
    const handleHashChange = () => {
      setSearchParams(new URLSearchParams(window.location.hash.split('?')[1]));
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

  const handleSearch = (state: SearchState) => {
    // La SearchBar gère déjà le changement de hash dans son propre code.
    // Cette fonction peut rester vide ou servir à des effets secondaires.
  };

  // Logique de filtrage combinée (Catégorie + URL Params)
  const filteredCars = cars.filter(car => {
    // Filtre par catégorie (boutons du haut)
    if (filterCategory && car.category !== filterCategory) return false;

    // Filtre par ville (SearchBar)
    const cityParam = searchParams.get('city');
    if (cityParam && !car.city.toLowerCase().includes(cityParam.toLowerCase())) return false;

    // Filtre par transmission (Options)
    const transParam = searchParams.get('transmission');
    if (transParam && car.transmission !== transParam) return false;

    // Filtre par carburant (Options)
    const fuelParam = searchParams.get('fuel');
    if (fuelParam && car.fuel_type !== fuelParam) return false;

    // Filtre par sièges (Options)
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
            <div className="mb-8 flex flex-col items-center">
                 <img src="https://i.ibb.co/L5hYwB6/image.png" alt="CAN 2025" className="h-20 mb-6 drop-shadow-xl" />
                 <h1 className="text-4xl md:text-[54px] font-black text-white leading-[1.1] uppercase tracking-tight max-w-[900px]">
                    LOUEZ VOTRE VOITURE ET VIVEZ LA COMPÉTITION EN TOUTE LIBERTÉ
                 </h1>
            </div>

            <div className="w-full max-w-5xl">
                <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-12 mb-16">
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
          <div className="flex items-center gap-1.5 px-5 py-3.5 bg-[#f5f5f5] rounded-full border border-gray-100 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-[13px] font-medium text-gray-500">Trier par :</span>
            <span className="text-[13px] font-bold text-gray-900">Plus récents</span>
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
                Réinitialiser
              </button>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#2A4E2F]" />
            <p className="text-gray-400 font-bold">Recherche dans la flotte...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 gap-6 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <Database className="w-16 h-16 text-gray-200" />
            <div className="text-center">
                <h3 className="text-xl font-black text-gray-900">Aucun résultat trouvé</h3>
                <p className="text-gray-500 font-medium">Essayez de modifier vos filtres ou de chercher dans une autre ville.</p>
                <button 
                    onClick={clearFilters}
                    className="mt-6 text-[#2A4E2F] font-black underline"
                >
                    Voir toutes les voitures
                </button>
            </div>
          </div>
        ) : (
          Object.entries(groupedByCity).map(([city, cityCars]) => (
            <div key={city} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[22px] font-black text-gray-900 flex items-center gap-2 group cursor-pointer">
                  Voitures à {city} 
                  <span className="ml-2 text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{cityCars.length}</span>
                  <ChevronRight className="w-6 h-6 text-gray-900 stroke-[3px] group-hover:translate-x-1 transition-transform" />
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
