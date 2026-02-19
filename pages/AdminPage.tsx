
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AIPackageId } from '../types';

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(code)) {
      onLogin();
    } else {
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
    const { users, paymentAttempts, packagePrices, updatePackagePrice, siteMessages, updateSiteMessage, updateUser } = useAuth();

    const handlePriceChange = (id: AIPackageId, value: string) => {
        const price = parseFloat(value);
        if (!isNaN(price)) {
            updatePackagePrice(id, price);
        }
    }

    const handleMessageChange = (key: string, value: string) => {
        updateSiteMessage(key, value);
    }
    
    const grantPackage = (email: string, packageId: AIPackageId) => {
        const user = users.find(u => u.email === email);
        if (user) {
            const updatedPackages = [...new Set([...user.purchasedPackages, packageId])];
            updateUser({ ...user, purchasedPackages: updatedPackages });
            alert(`Pacote ${packageId} liberado para ${email}`);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                     <select onChange={(e) => grantPackage(user.email, e.target.value as AIPackageId)} className="bg-slate-700 text-xs p-1 rounded">
                                        <option>Liberar pacote...</option>
                                        {Object.values(AIPackageId).map(id => <option key={id} value={id}>{id}</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Attempts */}
                <div className="bg-dark-card p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Tentativas de Pagamento ({paymentAttempts.length})</h2>
                     <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                        {paymentAttempts.map(attempt => (
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
                               <label htmlFor={`price-${id}`} className="text-gray-300">{id}</label>
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
                                <Input type="text" value={value} onChange={e => handleMessageChange(key, e.target.value)} />
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
  const [loggedIn, setLoggedIn] = useState(isAdmin);

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminPanel />;
};

export default AdminPage;
