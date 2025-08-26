import { RegisterForm, GameForm, ScoreUpdateForm } from '@/types';

// Validation Utility Functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateDisplayName = (displayName: string): boolean => {
  return displayName.length >= 2 && displayName.length <= 30;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// Form Validation Functions
export const validateRegisterForm = (data: RegisterForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.username) {
    errors.username = 'Username is required';
  } else if (!validateUsername(data.username)) {
    errors.username = 'Username must be 3-20 characters, letters, numbers, and underscores only';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.displayName) {
    errors.displayName = 'Display name is required';
  } else if (!validateDisplayName(data.displayName)) {
    errors.displayName = 'Display name must be 2-30 characters';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateGameForm = (data: GameForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name) {
    errors.name = 'Game name is required';
  } else if (data.name.length < 3 || data.name.length > 100) {
    errors.name = 'Game name must be 3-100 characters';
  }

  if (!data.sport) {
    errors.sport = 'Sport is required';
  }

  if (!data.homeTeam) {
    errors.homeTeam = 'Home team is required';
  } else if (data.homeTeam.length < 2 || data.homeTeam.length > 50) {
    errors.homeTeam = 'Team name must be 2-50 characters';
  }

  if (!data.awayTeam) {
    errors.awayTeam = 'Away team is required';
  } else if (data.awayTeam.length < 2 || data.awayTeam.length > 50) {
    errors.awayTeam = 'Team name must be 2-50 characters';
  }

  if (data.homeTeam === data.awayTeam) {
    errors.awayTeam = 'Home and away teams must be different';
  }

  if (!data.gameDate) {
    errors.gameDate = 'Game date is required';
  } else {
    const gameDate = new Date(data.gameDate);
    const now = new Date();
    if (gameDate < now) {
      errors.gameDate = 'Game date must be in the future';
    }
  }

  // Validate payout structure
  const totalPayout = Object.values(data.payoutStructure).reduce((sum, val) => sum + val, 0);
  if (totalPayout !== 100) {
    errors.payoutStructure = 'Payout percentages must total 100%';
  }

  return errors;
};

export const validateScoreUpdate = (data: ScoreUpdateForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  const scores = Object.entries(data);
  for (const [key, value] of scores) {
    if (value !== undefined && value !== null) {
      if (value < 0 || value > 999) {
        errors[key] = 'Score must be between 0 and 999';
      }
    }
  }

  return errors;
};

// Input Sanitization
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeDisplayName = (displayName: string): string => {
  return displayName.trim().replace(/[<>&"']/g, '');
};