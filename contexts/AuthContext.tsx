
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, AIPackageId, PaymentAttempt } from '../types';
import { ADMIN_CODE, AI_PACKAGES, PURCHASE_EMAIL_RECIPIENT } from '../constants';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  users: User[];
  paymentAttempts: PaymentAttempt[];
  startTrial: (email: string, name?: string) => Promise<boolean>;
  purchasePackage: (packageId: AIPackageId, method: 'pix' | 'card') => void;
  loginAdmin: (code: string) => boolean;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  addPaymentAttempt: (attempt: Omit<PaymentAttempt, 'id' | 'date'>) => void;
  updatePackagePrice: (packageId: AIPackageId, newPrice: number) => void;
  siteMessages: { [key: string]: string };
  updateSiteMessage: (key: string, value: string) => void;
  packagePrices: { [key in AIPackageId]: number };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('hz_users', []);
  const [paymentAttempts, setPaymentAttempts] = useLocalStorage<PaymentAttempt[]>('hz_payment_attempts', []);
  const [currentUserEmail, setCurrentUserEmail] = useLocalStorage<string | null>('hz_current_user', null);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('hz_is_admin', false);
  const [packagePrices, setPackagePrices] = useLocalStorage<{[key in AIPackageId]: number}>(
    'hz_package_prices', 
    AI_PACKAGES.reduce((acc, pkg) => ({...acc, [pkg.id]: pkg.price}), {} as {[key in AIPackageId]: number})
  );
  const [siteMessages, setSiteMessages] = useLocalStorage<{[key: string]: string}>(
    'hz_site_messages',
    {
      trialUsed: "Você já utilizou seu teste gratuito. Para continuar, compre um pacote.",
      trialExpired: "Seu teste grátis acabou. Compre um pacote para continuar."
    }
  );
  
  const user = users.find(u => u.email === currentUserEmail) || null;

  const checkTrialStatus = useCallback(() => {
    if (user && user.trial.active && user.trial.expiresAt && Date.now() > user.trial.expiresAt) {
      const updatedUser = { ...user, trial: { ...user.trial, active: false } };
      setUsers(prevUsers => prevUsers.map(u => u.email === user.email ? updatedUser : u));
    }
  }, [user, setUsers]);

  useEffect(() => {
    const interval = setInterval(checkTrialStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkTrialStatus]);

  const startTrial = async (email: string, name?: string): Promise<boolean> => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser && existingUser.trial.used) {
      alert(siteMessages.trialUsed);
      return false;
    }

    const now = Date.now();
    const newUser: User = {
      id: `user_${now}`,
      email,
      name,
      trial: {
        active: true,
        activatedAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
        used: true,
      },
      purchasedPackages: [],
    };

    if (existingUser) {
        setUsers(users.map(u => u.email === email ? newUser : u));
    } else {
        setUsers([...users, newUser]);
    }
    setCurrentUserEmail(email);
    return true;
  };

  const purchasePackage = (packageId: AIPackageId, method: 'pix' | 'card') => {
    if (!user) return;
    const purchasedPackages = packageId === AIPackageId.Premium 
        ? Object.values(AIPackageId)
        : [...new Set([...user.purchasedPackages, packageId])];

    const updatedUser = { ...user, purchasedPackages };
    updateUser(updatedUser);

    addPaymentAttempt({ userId: user.id, packageId, status: 'success', method });

    // Simulate sending email
    const purchasedItem = AI_PACKAGES.find(p => p.id === packageId);
    console.log(`
      --- E-MAIL DE COMPRA SIMULADO ---
      Para: ${PURCHASE_EMAIL_RECIPIENT}
      Comprador: ${user.name || 'N/A'}
      E-mail: ${user.email}
      Forma de Pagamento: ${method}
      Pacote: ${purchasedItem?.name}
      Data e Hora: ${new Date().toLocaleString('pt-BR')}
      ---------------------------------
    `);
  };
  
  const loginAdmin = (code: string): boolean => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUserEmail(null);
    setIsAdmin(false);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const addPaymentAttempt = (attempt: Omit<PaymentAttempt, 'id' | 'date'>) => {
    const newAttempt: PaymentAttempt = {
      ...attempt,
      id: `pay_${Date.now()}`,
      date: Date.now()
    };
    setPaymentAttempts(prev => [...prev, newAttempt]);
  };

  const updatePackagePrice = (packageId: AIPackageId, newPrice: number) => {
    setPackagePrices(prev => ({...prev, [packageId]: newPrice}));
  };

  const updateSiteMessage = (key: string, value: string) => {
    setSiteMessages(prev => ({...prev, [key]: value}));
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, users, paymentAttempts, startTrial, purchasePackage, loginAdmin, logout, updateUser, addPaymentAttempt, siteMessages, updateSiteMessage, packagePrices, updatePackagePrice }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
