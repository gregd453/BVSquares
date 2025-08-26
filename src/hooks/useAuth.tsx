import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, AuthContextType, RegisterForm } from '@/types';
import apiClient from '@/utils/apiClient';

// Auth State Management
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'AUTH_ERROR':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'AUTH_LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token Storage Utils
const TOKEN_KEY = 'bv_squares_token';

const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

const setStoredToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const removeStoredToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      
      if (!token) {
        dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
        return;
      }

      try {
        const response = await apiClient.getCurrentUser(token);
        if (response.success && response.data) {
          dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        } else {
          removeStoredToken();
          dispatch({ type: 'AUTH_ERROR', payload: 'Invalid token' });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        removeStoredToken();
        dispatch({ type: 'AUTH_ERROR', payload: 'Authentication failed' });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await apiClient.login(username, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setStoredToken(token);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Login failed' });
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterForm): Promise<void> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await apiClient.register(data);
      
      if (response.success && response.data) {
        // After successful registration, auto-login
        await login(data.username, data.password);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Registration failed' });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      removeStoredToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    const token = getStoredToken();
    
    if (!token) {
      dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
      return;
    }

    try {
      const response = await apiClient.getCurrentUser(token);
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        throw new Error('Failed to refresh user');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      removeStoredToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Guard Components
interface AuthGuardProps {
  children: React.ReactNode;
  userType?: 'player' | 'admin';
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  userType, 
  fallback = <div>Access denied</div> 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (userType && user.userType !== userType) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Player-only guard
export const PlayerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard userType="player" fallback={<div>Player access only</div>}>
    {children}
  </AuthGuard>
);

// Admin-only guard
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard userType="admin" fallback={<div>Admin access only</div>}>
    {children}
  </AuthGuard>
);

export default useAuth;