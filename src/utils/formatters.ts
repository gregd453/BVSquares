import { Game, GameScores, Winner } from '@/types';

// Date Formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Game Status Formatting
export const formatGameStatus = (status: Game['status']): string => {
  switch (status) {
    case 'setup':
      return 'Setup';
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

export const getGameStatusColor = (status: Game['status']): string => {
  switch (status) {
    case 'setup':
      return 'bg-neutral-100 text-neutral-800';
    case 'active':
      return 'bg-success text-white';
    case 'completed':
      return 'bg-neutral-400 text-white';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

// Sport Formatting
export const formatSport = (sport: Game['sport']): string => {
  switch (sport) {
    case 'football':
      return '🏈 Football';
    case 'basketball':
      return '🏀 Basketball';
    case 'soccer':
      return '⚽ Soccer';
    default:
      return sport;
  }
};

// Score Formatting
export const formatScore = (score: number | undefined): string => {
  return score !== undefined ? score.toString() : '-';
};

export const getLastDigit = (score: number): number => {
  return score % 10;
};

// Square Position Formatting
export const formatSquarePosition = (row: number, col: number): string => {
  return `Row ${row}, Col ${col}`;
};

export const getSquareId = (row: number, col: number): string => {
  return `${row}-${col}`;
};

// Winner Formatting
export const formatWinnerPeriod = (period: Winner['period']): string => {
  switch (period) {
    case 'Q1':
      return '1st Quarter';
    case 'Q2':
      return '2nd Quarter';
    case 'Q3':
      return '3rd Quarter';
    case 'Q4':
      return '4th Quarter';
    case 'Final':
      return 'Final Score';
    default:
      return period;
  }
};

// Payout Formatting
export const formatPayout = (amount: number): string => {
  return `${amount}%`;
};

// Time Formatting
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Username/Display Name Formatting
export const formatDisplayName = (displayName: string): string => {
  return displayName.length > 15 ? `${displayName.substring(0, 12)}...` : displayName;
};

// Grid Helpers
export const getSquareBackgroundColor = (status: 'available' | 'requested' | 'approved'): string => {
  switch (status) {
    case 'available':
      return 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200';
    case 'requested':
      return 'bg-warning/10 border-warning text-warning-dark';
    case 'approved':
      return 'bg-primary-100 border-primary-500 text-primary-900';
    default:
      return 'bg-neutral-50 border-neutral-200';
  }
};

// Error Message Formatting
export const formatApiError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'An unexpected error occurred';
};