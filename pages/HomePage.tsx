
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import TrialModal from '../components/TrialModal';
import { AI_PACKAGES } from '../constants';
import { AIPackageId } from '../types';

const PackageCard: React.FC<{ pkg: typeof AI_PACKAGES[0], onPurchase: (id: AIPackageId) => void }> = ({ pkg, onPurchase }) => {
    return (
        <div className="bg-dark-card rounded-lg shadow-lg p-6 flex flex-col border border-dark-border hover:border-brand-secondary transition-all duration-300">
            <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
            <p className="text-gray-400 mt-2 flex-grow">{pkg.description}</p>
            <div className="mt-6">
                <p className="text-3xl font-bold text-white">R$ {pkg.price.toFixed(2).replace('.', ',')}</p>
                <Button onClick={() => onPurchase(pkg.id)} variant="primary" className="w-full mt-4">
                    Comprar Agora
                </Button>
            </div>
        </div>
    );
}


const HomePage: React.FC = () => {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = (packageId: AIPackageId) => {
    if (user) {
        navigate(`/payment/${packageId}`);
    } else {
        setIsTrialModalOpen(true);
    }
  }

  return (
    <div className="text-center">
      <section className="py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Crie Artes Incríveis com Inteligência Artificial
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
          Transforme suas ideias em banners, logotipos, posts e muito mais, em segundos.
        </p>
        <div className="mt-8">
          <Button onClick={() => setIsTrialModalOpen(true)} variant="primary" size="lg">
            Testar Agora por 1 Dia (Grátis)
          </Button>
        </div>
      </section>
      
      <section id="packages" className="py-16">
        <h2 className="text-3xl font-bold text-white mb-10">Nossos Pacotes de IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AI_PACKAGES.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} onPurchase={handlePurchase} />
            ))}
        </div>
      </section>

      <TrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} />
    </div>
  );
};

export default HomePage;
