
import React from 'react';
import { Car } from '../types';
import { Heart, Users, Fuel, Settings, Star } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onClick: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  return (
    <div 
      onClick={() => onClick(car.id)}
      className="bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col gap-6 group cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h3 className="text-[17px] font-black text-gray-900 leading-tight">{car.brand}</h3>
          <p className="text-[13px] font-medium text-gray-400">{car.model} {car.year}</p>
        </div>
        <button className="p-2.5 bg-gray-50 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-[160px] w-full flex items-center justify-center p-2">
        <img 
          src={car.image_url} 
          alt={`${car.brand} ${car.model}`}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-50">
        <div className="space-y-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-black text-gray-900">{car.price_per_day}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">MAD /jour</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold">
                <Users className="w-3.5 h-3.5 stroke-[2.5px]" />
                <span>{car.seats}</span>
             </div>
             <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase">
                <Settings className="w-3.5 h-3.5 stroke-[2.5px]" />
                <span>{car.transmission[0]}</span>
             </div>
             <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase">
                <Fuel className="w-3.5 h-3.5 stroke-[2.5px]" />
                <span>{car.fuel_type[0]}</span>
             </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-lg">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-[12px] font-black text-gray-900">{car.rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] font-black text-[#2A4E2F] uppercase tracking-widest">{car.city}</span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
