import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/LoadingSpinner';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      // Redirect to dashboard after successful registration
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return <PageLoader text="Loading..." />;
  }

  if (isAuthenticated) {
    return <PageLoader text="Redirecting to dashboard..." />;
  }

  return (
    <>
      <Head>
        <title>Create Account - BV Squares</title>
        <meta name="description" content="Create your BV Squares player account to start joining sports betting squares games." />
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
              Join BV Squares
            </h1>
            <p className="mt-2 text-neutral-600">
              Create your player account to start playing
            </p>
          </div>

          <RegisterForm />

          {/* Back to Home */}
          <div className="mt-8 text-center">
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

export default RegisterPage;