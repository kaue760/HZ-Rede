
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { AIPackageId } from '../types';
import { AI_PACKAGES } from '../constants';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedIA, setSelectedIA] = useState<AIPackageId>(AIPackageId.Banners);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { startTrial, loginUser } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('O e-mail é obrigatório.');
      return;
    }
    setError('');
    setIsLoading(true);

    if (isLoginView) {
      // Login
      const success = loginUser(email);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Nenhum usuário encontrado com este e-mail. Crie uma conta.');
      }
    } else {
      // Register and start trial
      const success = await startTrial(email, name);
      // Even if trial was used, we log in and navigate
      navigate('/dashboard');
    }
    setIsLoading(false);
  };
  
  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    const mockEmail = `user@${provider.toLowerCase()}.com`;
    startTrial(mockEmail, `Usuário ${provider}`);
    navigate('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-dark-card p-8 rounded-lg shadow-xl border border-dark-border">
      <div className="flex border-b border-dark-border mb-6">
        <button
          onClick={() => setIsLoginView(true)}
          className={`flex-1 py-3 font-bold text-lg transition-colors ${isLoginView ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}
        >
          Entrar
        </button>
        <button
          onClick={() => setIsLoginView(false)}
          className={`flex-1 py-3 font-bold text-lg transition-colors ${!isLoginView ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}
        >
          Criar Conta
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">{isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta e comece o teste'}</h1>

      <form onSubmit={handleAuthAction} className="space-y-4">
        {!isLoginView && (
          <Input label="Nome (opcional)" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
        )}
        <Input label="E-mail" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />
        <Input label="Senha" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        
        {!isLoginView && (
           <Select
              label="Qual IA deseja usar primeiro?"
              id="ia-select"
              value={selectedIA}
              onChange={(e) => setSelectedIA(e.target.value as AIPackageId)}
            >
              {AI_PACKAGES.map(pkg => (
                <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
              ))}
            </Select>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          {isLoginView ? 'Entrar' : 'Criar Conta e Ativar Teste'}
        </Button>
      </form>
      
      <div className="flex items-center my-6">
          <hr className="flex-grow border-dark-border" />
          <span className="px-2 text-gray-400 text-sm">OU</span>
          <hr className="flex-grow border-dark-border" />
      </div>
      
       <div className="space-y-3">
          <Button variant="secondary" className="w-full" onClick={() => handleSocialLogin('Google')}>
              Entrar com Google
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => handleSocialLogin('Facebook')}>
              Entrar com Facebook
          </Button>
       </div>
    </div>
  );
};

export default LoginPage;
