
export enum AIPackageId {
  Banners = 'banners',
  Capas = 'capas',
  FotosPerfil = 'fotos-perfil',
  ArtesGerais = 'artes-gerais',
  Thumbnails = 'thumbnails',
  CartoesDigitais = 'cartoes-digitais',
  Posts = 'posts',
  Logotipos = 'logotipos',
  Premium = 'premium',
}

export interface AIPackage {
  id: AIPackageId;
  name: string;
  price: number;
  description: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  trial: {
    active: boolean;
    activatedAt: number | null;
    expiresAt: number | null;
    used: boolean;
  };
  purchasedPackages: AIPackageId[];
}

export interface PaymentAttempt {
  id: string;
  userId: string;
  packageId: AIPackageId;
  status: 'pending' | 'success' | 'failed';
  method: 'pix' | 'card';
  date: number;
}
