
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AI_PACKAGES } from '../constants';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }
  
  const purchased = AI_PACKAGES.filter(pkg => user.purchasedPackages.includes(pkg.id));

  return (
    <div className="max-w-2xl mx-auto bg-dark-card p-8 rounded-lg shadow-xl border border-dark-border">
      <h1 className="text-3xl font-bold mb-6">Perfil</h1>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Nome</label>
          <p className="text-lg text-white">{user.name || 'Não informado'}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">E-mail</label>
          <p className="text-lg text-white">{user.email}</p>
        </div>
        <div>
            <h2 className="text-xl font-semibold mt-6 mb-3">Status do Teste Gratuito</h2>
            {user.trial.used ? (
                <p className={`text-lg ${user.trial.active ? 'text-green-400' : 'text-red-400'}`}>
                    {user.trial.active 
                        ? `Ativo, expira em ${new Date(user.trial.expiresAt!).toLocaleString('pt-BR')}` 
                        : 'Expirado'}
                </p>
            ) : (
                <p className="text-lg text-gray-300">Não ativado.</p>
            )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-3">Pacotes Comprados</h2>
          {purchased.length > 0 ? (
            <ul className="space-y-2">
              {purchased.map(pkg => (
                <li key={pkg.id} className="bg-slate-800 p-3 rounded-md">{pkg.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Você ainda não comprou nenhum pacote.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
