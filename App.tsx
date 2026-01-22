
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailsPage from './pages/CarDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import PartnerPage from './pages/PartnerPage';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] selection:bg-[#2A4E2F] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        {renderRoute()}
      </main>
      <Footer />
      
      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-white border border-gray-100 shadow-xl p-4 rounded-full hover:bg-gray-50 transition-all z-40 group"
      >
        <div className="w-6 h-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#2A4E2F] group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </div>
      </button>
    </div>
  );
};

export default App;
