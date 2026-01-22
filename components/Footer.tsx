
import React from 'react';
import { Phone, Mail, Send, Facebook, Instagram, MessageSquare } from 'lucide-react';
import { useLanguage } from '../App';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[#fcfcfc] border-t border-gray-100 pt-20 pb-10 px-6 md:px-20 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div>
          <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">{t.footerExplorer}</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-500">
            <li><a href="#/" className="hover:text-black transition-colors">{t.sortBy} {t.carsCount}</a></li>
            <li><a href="#/" className="hover:text-black transition-colors">{t.returnHome}</a></li>
            <li><a href="#/" className="hover:text-black transition-colors">À propos de nous</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Partenaires</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-500">
            <li><a href="#/partner" className="hover:text-black transition-colors">Annoncez votre voiture</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">{t.footerSupport}</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-500">
            <li><a href="#" className="hover:text-black transition-colors">Contacter</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Conditions générales</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Politique de confidentialité</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">{t.footerContact}</h4>
          <ul className="space-y-6">
            <li className="flex items-center gap-4 text-sm font-bold text-gray-700">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                 <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <span>+212 708-282195</span>
            </li>
            <li className="flex items-center gap-4 text-sm font-bold text-gray-700">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <span>contact.allocar@gmail.com</span>
            </li>
            <li className="mt-8">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                   <Mail className="w-5 h-5 text-gray-300 group-focus-within:text-[#2A4E2F] transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="Entrez votre e-mail ici" 
                  className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-4 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-[#2A4E2F]/10 font-medium text-sm transition-all"
                />
                <button className="absolute right-2 top-2 bg-[#2A4E2F] p-2.5 rounded-xl text-white hover:bg-[#1D3621] transition-all active:scale-95 shadow-lg shadow-green-900/10">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            © 2025 ALLOCAR {t.footerRights}
          </p>
        </div>

        <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-tighter">
                   <GlobeIcon />
                   Français
                </div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">MAD</span>
            </div>
            <div className="flex items-center gap-6">
                <a href="#" className="transition-transform hover:scale-110">
                  <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2] stroke-none" />
                </a>
                <a href="#" className="transition-transform hover:scale-110">
                  <Instagram className="w-5 h-5 text-[#E4405F]" />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

const GlobeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default Footer;
