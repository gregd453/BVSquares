import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/LoadingSpinner';

const AdminLoginPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      // Redirect based on user type
      if (user.userType === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        // Non-admin users should go to regular dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return <PageLoader text="Loading..." />;
  }

  if (isAuthenticated) {
    return <PageLoader text="Redirecting..." />;
  }

  return (
    <>
      <Head>
        <title>Admin Login - BV Squares</title>
        <meta name="description" content="Admin login for BV Squares game management and square approval." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-secondary-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold relative">
                BV
                <div className="absolute -top-1 -right-1 bg-warning text-neutral-900 text-xs px-2 py-1 rounded-full">
                  Admin
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Admin Access
            </h1>
            <p className="mt-2 text-neutral-600">
              Login to manage games and approve square requests
            </p>
          </div>

          <LoginForm userType="admin" />

          {/* Player Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Not an admin?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Player Login
              </button>
            </p>
          </div>

          {/* Admin Info */}
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-secondary-900 mb-1">
                  Admin Account Required
                </h4>
                <p className="text-xs text-secondary-700">
                  Admin accounts are created manually for security. Contact support to request admin access.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center justify-center space-x-1 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;