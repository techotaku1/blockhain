// Tipado para los registros de puntos del usuario (userPoints)
export type UserPoint = {
  id: number;
  userId: string;
  puntos: number;
  descripcion: string | null;
  fecha: Date;
};

// Tipado para usuarios
export type User = {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
};

// Tipado para progreso de recompensas
export type UserRewardProgress = {
  id: number;
  userId: string;
  rewardId: string;
  progress: number;
  completed: boolean;
  updatedAt: Date;
};

// Tipado para historial de sitios visitados
export type UserSiteHistory = {
  id: number;
  userId: string;
  siteName: string;
  siteUrl?: string | null;
  visitedAt: Date;
};

// Tipado para historial de acciones del usuario
export type UserHistory = {
  id: number;
  userId: string;
  action: string;
  points: number;
  createdAt: Date;
};

// Tipado para reportes de zona
export type ReporteZona = {
  id: number;
  userId: string;
  lugar: string;
  hora: string;
  imagenUrl?: string | null;
  estado: string; // 'En revisión' | 'Revisado'
  puntos: number;
  createdAt: Date;
};
