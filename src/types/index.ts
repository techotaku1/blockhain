// Tipado para los registros de puntos del usuario (userPoints)
export interface UserPoint {
  id: number;
  userId: string;
  puntos: number;
  descripcion: string | null;
  fecha: Date;
}

// Tipado para usuarios
export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}

// Tipado para progreso de recompensas
export interface UserRewardProgress {
  id: number;
  userId: string;
  rewardId: string;
  progress: number;
  completed: boolean;
  updatedAt: Date;
}

// Tipado para historial de sitios visitados
export interface UserSiteHistory {
  id: number;
  userId: string;
  siteName: string;
  siteUrl?: string | null;
  visitedAt: Date;
}

// Tipado para historial de acciones del usuario
export interface UserHistory {
  id: number;
  userId: string;
  action: string;
  points: number;
  createdAt: Date;
}

// Tipado para reportes de zona
export interface ReporteZona {
  id: number;
  userId: string;
  lugar: string;
  hora: string;
  imagenUrl?: string | null;
  estado: string; // 'En revisión' | 'Revisado'
  puntos: number;
  createdAt: Date;
}
