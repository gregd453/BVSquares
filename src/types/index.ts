// Core Entity Types
export interface User {
  id: string;
  username: string;
  displayName: string; // Must be unique across all users
  email: string;
  userType: 'player' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  name: string;
  sport: 'football' | 'basketball' | 'soccer';
  homeTeam: string;
  awayTeam: string;
  gameDate: string;
  status: 'setup' | 'active' | 'completed';
  payoutStructure: PayoutStructure;
  rowNumbers?: number[]; // 0-9, assigned by admin
  colNumbers?: number[]; // 0-9, assigned by admin
  scores: GameScores;
  createdAt: string;
  updatedAt: string;
}

export interface Square {
  id: string;
  gameId: string;
  row: number; // 0-9
  col: number; // 0-9
  playerId?: string;
  playerDisplayName?: string;
  status: 'available' | 'requested' | 'approved';
  requestedAt?: string;
  approvedAt?: string;
}

export interface SquareRequest {
  id: string;
  gameId: string;
  squareId: string;
  playerId: string;
  playerDisplayName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  row: number;
  col: number;
}

// Supporting Types
export interface PayoutStructure {
  firstQuarter: number;
  secondQuarter: number;
  thirdQuarter: number;
  finalScore: number;
}

export interface GameScores {
  homeQ1?: number;
  awayQ1?: number;
  homeQ2?: number;
  awayQ2?: number;
  homeQ3?: number;
  awayQ3?: number;
  homeQ4?: number;
  awayQ4?: number;
  homeFinal?: number;
  awayFinal?: number;
}

export interface Winner {
  period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Final';
  playerId?: string;
  playerDisplayName?: string;
  homeScore: number;
  awayScore: number;
  winningNumbers: {
    home: number;
    away: number;
  };
  payout: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  count: number;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface GameForm {
  name: string;
  sport: 'football' | 'basketball' | 'soccer';
  homeTeam: string;
  awayTeam: string;
  gameDate: string;
  payoutStructure: PayoutStructure;
}

export interface ScoreUpdateForm {
  homeQ1?: number;
  awayQ1?: number;
  homeQ2?: number;
  awayQ2?: number;
  homeQ3?: number;
  awayQ3?: number;
  homeQ4?: number;
  awayQ4?: number;
}

// Auth Context Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Component Props Types
export interface SquareCellProps {
  square: Square;
  gameStatus: Game['status'];
  isLoggedIn: boolean;
  currentUserId?: string;
  onSquareClick: (square: Square) => void;
  rowNumber?: number;
  colNumber?: number;
}

export interface GameGridProps {
  game: Game;
  squares: Square[];
  onSquareClick: (square: Square) => void;
  currentUser?: User;
}

// Utility Types
export type SquareStatus = Square['status'];
export type GameStatus = Game['status'];
export type UserType = User['userType'];
export type SportType = Game['sport'];