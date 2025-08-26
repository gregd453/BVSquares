import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/LoadingSpinner';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      // Redirect based on user type
      if (user.userType === 'admin') {
        router.replace('/admin/dashboard');
      } else {
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
        <title>Player Login - BV Squares</title>
        <meta name="description" content="Login to your BV Squares player account to request squares and join games." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold">
                BV
              </div>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-neutral-600">
              Login to your player account to continue
            </p>
          </div>

          <LoginForm userType="player" />

          {/* Admin Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Looking for admin access?{' '}
              <button
                onClick={() => router.push('/admin/login')}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Admin Login
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center justify-center space-x-1"
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

export default LoginPage;