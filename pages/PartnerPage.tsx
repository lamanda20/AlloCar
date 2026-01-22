
import React from 'react';
import { UserPlus, Car, CalendarCheck, CheckCircle, ChevronRight } from 'lucide-react';

const PartnerPage: React.FC = () => {
  const steps = [
    {
      title: 'Inscrivez-vous',
      desc: 'Indiquez les informations de votre agence (nom, localisation). Notre équipe examinera ensuite votre demande.',
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3209/3209931.png" className="w-20 h-20" alt="step1" />,
    },
    {
      title: 'Ajoutez vos voitures (après validation)',
      desc: 'Renseignez la marque, le prix et les règles applicables pour chaque véhicule.',
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3082/3082167.png" className="w-20 h-20" alt="step2" />,
    },
    {
      title: 'Finalisez',
      desc: 'Une fois publiées, vos annonces peuvent commencer à recevoir et gérer des réservations.',
      icon: <img src="https://cdn-icons-png.flaticon.com/512/1004/1004733.png" className="w-20 h-20" alt="step3" />,
    }
  ];

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-12">
          <h1 className="text-6xl md:text-8xl font-black text-[#2A4E2F] leading-tight">
            Il est facile de<br/>commencer sur AlloCar
          </h1>
        </div>

        <div className="flex-1 space-y-12">
            {steps.map((step, i) => (
                <div key={i} className="flex gap-8 group">
                    <div className="shrink-0 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                        {step.icon}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 flex justify-end">
          <button className="bg-[#1D3621] text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl">
              Commencer
          </button>
      </section>
    </div>
  );
};

export default PartnerPage;
