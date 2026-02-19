import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AIPackageId } from '../types';
import { AI_PACKAGES } from '../constants';

const AdminLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAdmin(code)) {
      setError('Código de acesso inválido.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-dark-card p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Acesso Administrativo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código de Acesso"
          id="adminCode"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" size="lg">Entrar</Button>
      </form>
    </div>
  );
};

const AdminPanel: React.FC = () => {
    const { 
        users, 
        paymentAttempts, 
        packagePrices, 
        updatePackagePrice, 
        siteMessages, 
        updateSiteMessage, 
        updateUser,
        trialDurationHours,
        updateTrialDuration,
        promotionMessage,
        updatePromotionMessage,
    } = useAuth();

    const payingUsers = users.filter(u => u.purchasedPackages.length > 0).length;
    const totalRevenue = paymentAttempts
        .filter(p => p.status === 'success')
        .reduce((acc, p) => acc + (packagePrices[p.packageId] || 0), 0);

    const handlePriceChange = (id: AIPackageId, value: string) => {
        const price = parseFloat(value);
        if (!isNaN(price)) {
            updatePackagePrice(id, price);
        }
    }
    
    const grantPackage = (email: string, packageId: AIPackageId) => {
        const user = users.find(u => u.email === email);
        if (user && packageId) {
            const updatedPackages = packageId === AIPackageId.Premium 
                ? Object.values(AIPackageId)
                : [...new Set([...user.purchasedPackages, packageId])];
            updateUser({ ...user, purchasedPackages: updatedPackages });
            alert(`Pacote ${packageId} liberado para ${email}`);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-dark-card p-4 rounded-lg text-center">
                    <h3 className="text-gray-400 text-sm font-medium">Total de Usuários</h3>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                 <div className="bg-dark-card p-4 rounded-lg text-center">
                    <h3 className="text-gray-400 text-sm font-medium">Clientes Pagantes</h3>
                    <p className="text-3xl font-bold text-brand-secondary">{payingUsers}</p>
                </div>
                 <div className="bg-dark-card p-4 rounded-lg text-center">
                    <h3 className="text-gray-400 text-sm font-medium">Receita Total</h3>
                    <p className="text-3xl font-bold text-green-500">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* General Settings */}
                 <div className="bg-dark-card p-4 rounded-lg lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Configurações Gerais</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="trial-duration" className="text-gray-300">Duração do Teste Grátis (horas)</label>
                            <Input id="trial-duration" type="number" value={trialDurationHours} onChange={e => updateTrialDuration(parseInt(e.target.value) || 0)} className="w-full mt-1"/>
                        </div>
                        <div>
                            <label htmlFor="promo-message" className="text-gray-300">Mensagem de Promoção</label>
                            <Input id="promo-message" type="text" value={promotionMessage} onChange={e => updatePromotionMessage(e.target.value)} className="w-full mt-1"/>
                        </div>
                    </div>
                </div>

                {/* Users */}
                <div className="bg-dark-card p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Usuários Cadastrados ({users.length})</h2>
                    <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                        {users.map(user => (
                            <div key={user.id} className="bg-slate-800 p-3 rounded">
                                <p className="font-semibold">{user.email} {user.name && `(${user.name})`}</p>
                                <p className="text-xs text-gray-400">
                                    Trial: {user.trial.used ? (user.trial.active ? 'Ativo' : 'Expirado') : 'Não usado'} | Pacotes: {user.purchasedPackages.length}
                                </p>
                                <div className="mt-2">
                                     <select onChange={(e) => grantPackage(user.email, e.target.value as AIPackageId)} className="bg-slate-700 text-xs p-1 rounded w-full">
                                        <option value="">Liberar pacote...</option>
                                        {Object.values(AIPackageId).map(id => <option key={id} value={id}>{AI_PACKAGES.find(p=>p.id === id)?.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Attempts */}
                <div className="bg-dark-card p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Histórico de Pagamentos ({paymentAttempts.length})</h2>
                     <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                        {[...paymentAttempts].reverse().map(attempt => (
                            <div key={attempt.id} className="bg-slate-800 p-3 rounded">
                                <p className="font-semibold">{users.find(u=>u.id === attempt.userId)?.email}</p>
                                <p className="text-sm">Pacote: {attempt.packageId} | Método: {attempt.method}</p>
                                <p className="text-xs text-gray-400">{new Date(attempt.date).toLocaleString('pt-BR')}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prices */}
                 <div className="bg-dark-card p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Editar Preços dos Pacotes</h2>
                    <div className="space-y-2">
                       {Object.entries(packagePrices).map(([id, price]) => (
                           <div key={id} className="flex items-center justify-between">
                               <label htmlFor={`price-${id}`} className="text-gray-300">{AI_PACKAGES.find(p=>p.id === id)?.name}</label>
                               <div className="flex items-center">
                                  <span className="mr-1">R$</span>
                                  <Input id={`price-${id}`} type="number" value={price} onChange={e => handlePriceChange(id as AIPackageId, e.target.value)} className="w-24 text-right"/>
                               </div>
                           </div>
                       ))}
                    </div>
                 </div>
                
                 {/* Messages */}
                 <div className="bg-dark-card p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Editar Mensagens do Site</h2>
                    <div className="space-y-4">
                        {Object.entries(siteMessages).map(([key, value]) => (
                            <div key={key}>
                                <label className="capitalize text-sm text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <Input type="text" value={value} onChange={e => updateSiteMessage(key, e.target.value)} />
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    );
}

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminPanel />;
};

export default AdminPage;