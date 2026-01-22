
export type Transmission = 'Manuelle' | 'Automatique';
export type FuelType = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';
export type CarCategory = 'Economy' | 'Standard' | 'SUV / 4x4' | 'Luxury' | 'Luxury SUV' | 'Van / MPV' | 'Minibus' | 'Sport';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  price_per_day: number;
  deposit: number;
  category: CarCategory;
  transmission: Transmission;
  fuel_type: FuelType;
  seats: number;
  image_url: string;
  agency_name: string;
  agency_id?: string;
  rating: number;
  reviews_count: number;
  location_lat?: number;
  location_lng?: number;
  is_verified_partner: boolean;
}

export interface SearchState {
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  options: {
    freeDelivery: boolean;
    seats: number | null;
    transmission: Transmission | null;
    fuel: FuelType | null;
  };
}

export interface BookingDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  deliveryType: 'pickup' | 'delivery';
  paymentType: 'pickup' | 'online';
}
