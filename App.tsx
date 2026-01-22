
import React, { useState, useEffect, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailsPage from './pages/CarDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import PartnerPage from './pages/PartnerPage';
import { translations } from './translations';

type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const t = translations[lang];

  const renderRoute = () => {
    if (route === '#/' || route === '') return <HomePage />;
    if (route.startsWith('#/car/')) {
      const id = route.split('#/car/')[1];
      return <CarDetailsPage id={id} />;
    }
    if (route.startsWith('#/checkout/')) {
      const id = route.split('#/checkout/')[1];
      return <CheckoutPage id={id} />;
    }
    if (route === '#/partner') return <PartnerPage />;
    
    return <HomePage />;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="min-h-screen flex flex-col bg-[#fcfcfc] selection:bg-[#2A4E2F] selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {renderRoute()}
        </main>
        <Footer />
        
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-12 right-12 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-5 rounded-full hover:shadow-[0_15px_50px_rgba(0,0,0,0.18)] transition-all z-40 group"
        >
          <div className="w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#2A4E2F] stroke-[2.5px] group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
          </div>
        </button>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
