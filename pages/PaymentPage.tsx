
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AI_PACKAGES, PIX_COPY_PASTE, PIX_QR_CODE_URL } from '../constants';
import { AIPackageId } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const PaymentPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: AIPackageId }>();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { purchasePackage } = useAuth();
  
  const pkg = AI_PACKAGES.find(p => p.id === packageId);

  if (!pkg) {
    return <div className="text-center text-red-500">Pacote não encontrado.</div>;
  }
  
  const handlePayment = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
        purchasePackage(pkg.id, paymentMethod);
        setIsLoading(false);
        alert('Pagamento aprovado com sucesso!');
        navigate('/dashboard');
    }, 2000);
  }

  return (
    <div className="max-w-2xl mx-auto bg-dark-card p-8 rounded-lg shadow-xl border border-dark-border">
      <h1 className="text-3xl font-bold text-center mb-2">Finalizar Pagamento</h1>
      <p className="text-center text-gray-400 mb-6">Você está comprando: <span className="font-bold text-brand-secondary">{pkg.name}</span></p>

      <div className="bg-slate-800 p-4 rounded-lg text-center mb-6">
        <span className="text-gray-400">Total a pagar</span>
        <p className="text-4xl font-bold text-white">R$ {pkg.price.toFixed(2).replace('.', ',')}</p>
      </div>

      <div className="flex justify-center border border-dark-border rounded-lg p-1 mb-6 bg-slate-800">
        <button onClick={() => setPaymentMethod('pix')} className={`w-1/2 py-2 rounded-md transition ${paymentMethod === 'pix' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}>Pagar com Pix</button>
        <button onClick={() => setPaymentMethod('card')} className={`w-1/2 py-2 rounded-md transition ${paymentMethod === 'card' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}>Pagar com Cartão</button>
      </div>

      {paymentMethod === 'pix' && (
        <div className="text-center space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold">Pague com Pix</h3>
            <img src={PIX_QR_CODE_URL} alt="QR Code Pix" className="mx-auto border-4 border-white rounded-lg"/>
            <p className="text-gray-400">Ou use o Pix Copia e Cola:</p>
            <div className="bg-slate-800 p-3 rounded-lg border border-dark-border">
                <p className="text-sm break-all">{PIX_COPY_PASTE}</p>
            </div>
            <Button onClick={handlePayment} isLoading={isLoading} className="w-full mt-4" size="lg">Confirmar Pagamento</Button>
        </div>
      )}

      {paymentMethod === 'card' && (
         <div className="space-y-4 animate-fade-in">
            <Input label="Nome no cartão" id="cardName" placeholder="Como está no cartão" />
            <Input label="Número do cartão" id="cardNumber" placeholder="0000 0000 0000 0000" />
            <div className="flex gap-4">
                <Input label="Validade" id="cardExpiry" placeholder="MM/AA" />
                <Input label="CVV" id="cardCvv" placeholder="123" />
            </div>
             <Button onClick={handlePayment} isLoading={isLoading} className="w-full mt-4" size="lg">Pagar com Cartão</Button>
        </div>
      )}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default PaymentPage;
