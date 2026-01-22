
import React from 'react';
import { Phone, Mail, Send, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#fcfcfc] border-t border-gray-100 pt-16 pb-8 px-6 md:px-20 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <h4 className="font-bold mb-6">Explorer</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#/" className="hover:text-black">Rechercher des voitures</a></li>
            <li><a href="#/" className="hover:text-black">Accueil</a></li>
            <li><a href="#/" className="hover:text-black">À propos de nous</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Partenaires</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#/partner" className="hover:text-black">Annoncez votre voiture</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Assistance</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Contacter</a></li>
            <li><a href="#" className="hover:text-black">Conditions générales</a></li>
            <li><a href="#" className="hover:text-black">Politique de confidentialité</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Coordonnées</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4" />
              <span>+212 708-282195</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span>contact.cardnd@gmail.com</span>
            </li>
            <li className="mt-6">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Entrez votre e-mail ici" 
                  className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-[#2A4E2F]"
                />
                <button className="absolute right-2 top-1.5 bg-[#2A4E2F] p-2 rounded-md text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-gray-500">© 2025 CARDND Tous droits réservés. Réalisé par OPEN LLUNA.</p>
        <div className="flex items-center gap-6">
            <div className="flex gap-4 grayscale opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            </div>
            <div className="flex items-center gap-4 text-gray-400">
                <Facebook className="w-4 h-4 hover:text-[#2A4E2F] cursor-pointer" />
                <Instagram className="w-4 h-4 hover:text-[#2A4E2F] cursor-pointer" />
                <Twitter className="w-4 h-4 hover:text-[#2A4E2F] cursor-pointer" />
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
