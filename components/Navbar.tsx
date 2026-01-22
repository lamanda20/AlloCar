
import React, { useState, useEffect, useRef } from 'react';
import { Globe, Menu, User, LogOut, ClipboardList, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../App';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { lang, setLang, t, user, setUser } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDropdownOpen(false);
    window.location.hash = '#/';
  };

  const openAuth = (view: 'login' | 'signup') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-[100] px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#/'}>
          <div className="w-9 h-9 bg-[#2A4E2F] rounded-full flex items-center justify-center">
              <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">{t.brand}</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.hash = '#/partner'}
            className="hidden md:block text-sm font-bold text-gray-800 hover:text-[#2A4E2F] transition-colors"
          >
            {t.partner}
          </button>
          
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-black uppercase">{lang}</span>
              </button>

              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-4 bg-white hover:shadow-lg border border-gray-200 rounded-full transition-all text-gray-700 active:scale-95"
              >
                <Menu className="w-5 h-5 stroke-[2.5px]" />
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                  {user ? (
                    <div className="w-full h-full bg-[#2A4E2F] text-white flex items-center justify-center font-black text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
                  {user ? (
                    <>
                      <div className="px-6 py-3 border-b border-gray-50 mb-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Connecté en tant que</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { window.location.hash = '#/my-bookings'; setIsDropdownOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                        <ClipboardList className="w-5 h-5 text-gray-400" />
                        Mes Réservations
                      </button>
                      <div className="h-px bg-gray-50 my-2 mx-6"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors text-sm font-bold text-red-500">
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => openAuth('signup')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-sm font-black text-gray-900">
                        <UserPlus className="w-5 h-5 text-gray-400" />
                        S'inscrire
                      </button>
                      <button onClick={() => openAuth('login')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600">
                        <LogIn className="w-5 h-5 text-gray-400" />
                        Connexion
                      </button>
                    </>
                  )}
                </div>
              )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authView} 
      />
    </>
  );
};

export default Navbar;
