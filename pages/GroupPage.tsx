
import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GROUP_CODE } from '../constants';

const GroupPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === GROUP_CODE) {
      setHasAccess(true);
      setError('');
    } else {
      setError('Código inválido. Tente novamente.');
    }
  };
  
  if(hasAccess) {
    return (
        <div className="max-w-md mx-auto mt-10 text-center bg-dark-card p-8 rounded-lg shadow-xl">
             <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Grupo Oficial!</h1>
             <p className="text-gray-300">Acesso liberado. Aqui você encontrará novidades, tutoriais e suporte exclusivo.</p>
             <Button className="mt-6" onClick={() => window.location.reload()}>Voltar</Button>
        </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-dark-card p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Grupo Oficial HZ Rede</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código de Acesso"
          id="groupCode"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código do grupo"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" size="lg">Liberar Acesso</Button>
      </form>
    </div>
  );
};

export default GroupPage;
