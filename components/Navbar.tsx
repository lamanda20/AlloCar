
import React from 'react';
import { Globe, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-[100] px-6 py-4 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#/'}>
        <div className="w-9 h-9 bg-[#2A4E2F] rounded-full flex items-center justify-center">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Cardnd</span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.location.hash = '#/partner'}
          className="hidden md:block text-sm font-bold text-gray-800 hover:text-[#2A4E2F] transition-colors"
        >
          Devenir Partenaire
        </button>
        <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
              <Globe className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 p-1.5 pl-3 bg-white hover:shadow-md border border-gray-200 rounded-full transition-all text-gray-700">
              <Menu className="w-5 h-5" />
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
