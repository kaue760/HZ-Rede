
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              HZ<span className="text-brand-secondary">Rede</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/group" className="text-gray-300 hover:text-white transition-colors">
              Grupo Oficial
            </Link>
            {isAdmin && (
                 <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                 Painel ADM
               </Link>
            )}
            {user ? (
              <>
                 <Button onClick={() => navigate('/dashboard')} variant="secondary" size="sm">Dashboard</Button>
                 <Button onClick={handleLogout} variant="accent" size="sm">Sair</Button>
              </>
            ) : (
                <Button onClick={() => navigate('/')} variant="primary" size="sm">Entrar</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
