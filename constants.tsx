
import { Car } from './types';

export const THEME_GREEN = '#2A4E2F';
export const THEME_GREEN_DARK = '#1D3621';

export const CATEGORIES: { label: string; icon?: string }[] = [
  { label: 'Economy' },
  { label: 'Standard' },
  { label: 'SUV / 4x4' },
  { label: 'Luxury' },
  { label: 'Luxury SUV' },
  { label: 'Van / MPV' },
  { label: 'Minibus' },
  { label: 'Sport' },
];

export const CITIES = [
  { name: 'Toutes les villes', desc: 'Rechercher dans tout le Maroc', icon: 'globe' },
  { name: 'Casablanca', desc: 'Capitale économique', icon: 'building' },
  { name: 'Marrakech', desc: 'La ville rouge', icon: 'landmark' },
  { name: 'Rabat', desc: 'Capitale administrative', icon: 'building' },
  { name: 'Tanger', desc: 'La porte du Nord', icon: 'building' },
  { name: 'Agadir', desc: 'Station balnéaire', icon: 'landmark' },
  { name: 'Fès', desc: 'Cœur spirituel', icon: 'landmark' },
  { name: 'Meknès', desc: 'Ville Impériale', icon: 'landmark' },
  { name: 'Oujda', desc: 'Capitale de l\'Oriental', icon: 'building' },
  { name: 'Kénitra', desc: 'Porte du Gharb', icon: 'building' },
  { name: 'Tétouan', desc: 'La colombe blanche', icon: 'landmark' },
  { name: 'Safi', desc: 'Cité de la poterie', icon: 'landmark' },
  { name: 'El Jadida', desc: 'Cité Mazagan', icon: 'landmark' },
  { name: 'Nador', desc: 'Perle de la Méditerranée', icon: 'landmark' },
  { name: 'Béni Mellal', desc: 'Au pied de l\'Atlas', icon: 'building' },
  { name: 'Mohammédia', desc: 'Cité des fleurs', icon: 'building' },
  { name: 'Laâyoune', desc: 'Capitale du Sahara', icon: 'building' },
  { name: 'Dakhla', desc: 'Paradis des surfeurs', icon: 'landmark' },
  { name: 'Essaouira', desc: 'Cité des Alizés', icon: 'landmark' },
  { name: 'Ouarzazate', desc: 'Porte du désert', icon: 'landmark' },
  { name: 'Ifrane', desc: 'La petite Suisse', icon: 'landmark' },
];

export const TIMES = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${String(hours).padStart(2, '0')}:${minutes}`;
});
