
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AI_PACKAGES } from '../constants';
import { AIPackageId } from '../types';
import { Button } from '../components/ui/Button';
import { GoogleGenAI } from '@google/genai';
import CountdownTimer from '../components/ui/CountdownTimer';

// A chave da API é injetada do ambiente
const API_KEY = process.env.API_KEY;

// Componente de Ferramenta de IA Funcional
const AITool: React.FC<{ toolName: string }> = ({ toolName }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Por favor, insira um prompt para gerar a imagem.');
            return;
        }
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            if (!API_KEY) {
                throw new Error("API Key não encontrada. Verifique a configuração do ambiente.");
            }
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }],
                },
            });

            let imageFound = false;
            if (response.candidates && response.candidates.length > 0) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64Data = part.inlineData.data;
                        const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`;
                        setGeneratedImage(imageUrl);
                        imageFound = true;
                        break; // Para após encontrar a primeira imagem
                    }
                }
            }

            if (!imageFound) {
                 setError('A resposta da IA não continha uma imagem. Tente um prompt diferente.');
            }

        } catch (e: any) {
            console.error(e);
            setError(`Ocorreu um erro ao gerar a imagem: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-dark-card p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{toolName}</h2>
            <p className="text-gray-400 mb-4">Descreva a imagem que você deseja criar. Seja o mais detalhado possível para melhores resultados.</p>
            
            <div className="space-y-4">
                <textarea 
                    className="w-full bg-slate-800 border border-dark-border rounded-md p-3 h-28 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary transition" 
                    placeholder="Ex: Um astronauta surfando em uma onda cósmica com planetas ao fundo, estilo synthwave..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                />
                <Button 
                    onClick={handleGenerate} 
                    isLoading={isLoading}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full"
                    size="lg"
                >
                    {isLoading ? 'Gerando Imagem...' : 'Gerar'}
                </Button>
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            <div className="mt-6">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg p-8 border-2 border-dashed border-dark-border">
                        <svg className="animate-spin h-10 w-10 text-brand-secondary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-lg font-semibold text-white">Sua imagem está sendo criada...</p>
                        <p className="text-gray-400">Isso pode levar alguns instantes.</p>
                    </div>
                )}
                {generatedImage && (
                    <div className="animate-fade-in">
                        <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
                        <img src={generatedImage} alt="Imagem gerada pela IA" className="rounded-lg w-full h-auto object-contain border border-dark-border" />
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};


const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AIPackageId>(AIPackageId.Banners);
  const { user, siteMessages, expireCurrentUserTrial } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Should be redirected by ProtectedRoute
  }

  const hasAccess = (packageId: AIPackageId): boolean => {
    if (user.trial.active) return true;
    if (user.purchasedPackages.includes(AIPackageId.Premium)) return true;
    return user.purchasedPackages.includes(packageId);
  };
  
  const isTrialExpired = user.trial.used && !user.trial.active && user.purchasedPackages.length === 0;

  const renderContent = () => {
    if (isTrialExpired) {
      return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-center p-4 z-10">
            <h2 className="text-3xl font-bold text-white mb-4">{siteMessages.trialExpired}</h2>
            <Button onClick={() => navigate('/')} size="lg">Ver Pacotes</Button>
        </div>
      );
    }
    
    const activePackage = AI_PACKAGES.find(p => p.id === activeTab);
    return hasAccess(activeTab) ? 
        <AITool toolName={activePackage?.name || ''} /> : 
        (
            <div className="text-center bg-dark-card p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Acesso Bloqueado</h2>
                <p className="text-gray-300 mb-6">Você não tem acesso a esta ferramenta. Por favor, compre o pacote para continuar.</p>
                <Button onClick={() => navigate(`/payment/${activeTab}`)}>Comprar {activePackage?.name}</Button>
            </div>
        );
  }

  return (
    <>
      {user && user.trial.active && user.trial.expiresAt && (
        <div className="bg-brand-primary/80 border border-brand-secondary text-white p-3 rounded-lg mb-6 text-center flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 shadow-lg">
          <p className="font-semibold">Seu teste grátis termina em:</p>
          <CountdownTimer 
            expiryTimestamp={user.trial.expiresAt}
            onExpire={expireCurrentUserTrial}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <nav className="flex flex-col space-y-2">
            {AI_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setActiveTab(pkg.id)}
                className={`text-left p-3 rounded-md transition-colors text-sm font-medium ${
                  activeTab === pkg.id
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-300 hover:bg-dark-card hover:text-white'
                }`}
              >
                {pkg.name}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-grow md:w-3/4 lg:w-4/5 relative">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default DashboardPage;