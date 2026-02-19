
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { AI_PACKAGES } from '../constants';
import { AIPackageId } from '../types';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrialModal: React.FC<TrialModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedIA, setSelectedIA] = useState<AIPackageId>(AIPackageId.Banners);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { startTrial } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('O e-mail é obrigatório.');
      return;
    }
    setError('');
    setIsLoading(true);

    const success = await startTrial(email, name);

    setIsLoading(false);
    if (success) {
      onClose();
      navigate('/dashboard');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ativar Teste Gratuito por 1 Dia">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome (opcional)"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
        <Input
          label="E-mail (obrigatório)"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          required
        />
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                Ativar Teste Grátis
            </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TrialModal;
