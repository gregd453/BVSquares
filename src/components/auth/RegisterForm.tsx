import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { useAuth } from '@/hooks/useAuth';
import { RegisterForm as RegisterFormType } from '@/types';
import { validateRegisterForm } from '@/utils/validation';
import { formatApiError } from '@/utils/formatters';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormType>({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(formData);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
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
            Create Player Account
          </h2>
          <p className="text-neutral-600 mt-2">
            Join BV Squares to start playing in sports betting squares games
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
            <p className="text-error text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            placeholder="Choose a unique username"
            required
            disabled={isLoading}
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="Enter your email address"
            required
            disabled={isLoading}
          />

          <FormField
            label="Display Name"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleInputChange}
            error={errors.displayName}
            placeholder="Name shown in squares (must be unique)"
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
            placeholder="Create a secure password"
            required
            disabled={isLoading}
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
          />

          <div className="bg-neutral-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">
              Account Requirements:
            </h4>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Username: 3-20 characters, letters, numbers, underscores only</li>
              <li>• Display Name: Must be unique across all players</li>
              <li>• Password: At least 8 characters</li>
            </ul>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
            By creating an account, you agree to our terms of service and privacy policy.
            This platform is for entertainment purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;