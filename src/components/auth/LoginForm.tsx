import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm as LoginFormType } from '@/types';
import { validateEmail, validateUsername } from '@/utils/validation';
import { formatApiError } from '@/utils/formatters';

interface LoginFormProps {
  userType?: 'player' | 'admin';
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  userType = 'player',
  onSuccess 
}) => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormType>({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username) && !validateEmail(formData.username)) {
      newErrors.username = 'Please enter a valid username or email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.username, formData.password);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect based on user type
        if (userType === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setApiError(formatApiError(error));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-neutral-900">
            {userType === 'admin' ? 'Admin Login' : 'Player Login'}
          </h2>
          <p className="text-neutral-600 mt-2">
            {userType === 'admin' 
              ? 'Access the admin dashboard to manage games and requests'
              : 'Login to request squares and track your games'
            }
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
            <p className="text-error text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username or Email"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            placeholder="Enter your username or email"
            required
            disabled={isLoading}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {userType === 'player' && (
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        )}

        {userType === 'admin' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">
              Admin accounts are created manually.{' '}
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Contact support
              </Link>{' '}
              for access.
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link
            href={userType === 'admin' ? '/login' : '/admin/login'}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            {userType === 'admin' ? '← Player Login' : 'Admin Login →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;