import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Button from '@/components/ui/Button';
import BaseCard from '@/components/ui/BaseCard';
import { useAuth } from '@/hooks/useAuth';

const HomePage: NextPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Head>
        <title>BV Squares - Sports Betting Squares Game</title>
        <meta name="description" content="The premier platform for managing sports betting squares with admin approval workflows. Create games, request squares, and track winners." />
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                Welcome to{' '}
                <span className="text-gradient">BV Squares</span>
              </h1>
              <p className="text-xl sm:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                The premier platform for managing sports betting squares with admin approval workflows. 
                Create games, request squares, and track winners in a fun and organized way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      onClick={() => window.location.href = user?.userType === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => window.location.href = '/games'}
                    >
                      Browse Games
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => window.location.href = '/register'}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => window.location.href = '/games'}
                    >
                      Browse Games
                    </Button>
                  </>
                )}
              </div>

              <p className="text-sm text-neutral-500 mt-4">
                Free to play • No payments required • Entertainment only
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                BV Squares makes it easy to set up and manage sports betting squares games with friends and colleagues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <BaseCard className="text-center p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  1. Create Account
                </h3>
                <p className="text-neutral-600">
                  Sign up as a player with a unique display name that will appear in your squares.
                </p>
              </BaseCard>

              {/* Step 2 */}
              <BaseCard className="text-center p-8">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  2. Request Squares
                </h3>
                <p className="text-neutral-600">
                  Browse games and click on squares to request them. Your requests need admin approval.
                </p>
              </BaseCard>

              {/* Step 3 */}
              <BaseCard className="text-center p-8">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  3. Play & Win
                </h3>
                <p className="text-neutral-600">
                  Once approved, watch the game and see if your square combinations match the winning scores!
                </p>
              </BaseCard>
            </div>
          </div>
        </section>

        {/* Sports Section */}
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Multiple Sports Supported
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Create squares games for your favorite sports with customizable payout structures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BaseCard className="text-center p-8">
                <div className="text-6xl mb-4">🏈</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Football</h3>
                <p className="text-neutral-600">
                  Perfect for NFL games, college football, and Super Bowl parties.
                </p>
              </BaseCard>

              <BaseCard className="text-center p-8">
                <div className="text-6xl mb-4">🏀</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Basketball</h3>
                <p className="text-neutral-600">
                  Great for NBA games, March Madness, and championship games.
                </p>
              </BaseCard>

              <BaseCard className="text-center p-8">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Soccer</h3>
                <p className="text-neutral-600">
                  Exciting for World Cup matches, league games, and tournaments.
                </p>
              </BaseCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of players enjoying fair and fun sports squares games.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-50">
                    Create Player Account
                  </Button>
                </Link>
                <Link href="/games">
                  <Button variant="tertiary" size="lg" className="text-white border-white hover:bg-white/10">
                    Browse Games
                  </Button>
                </Link>
              </div>

              <p className="text-white/75 text-sm mt-6">
                No credit card required • Always free to play
              </p>
            </div>
          </section>
        )}

        {/* Footer Info */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">For Players</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><Link href="/games" className="hover:text-primary-600">Browse Games</Link></li>
                  <li><Link href="/register" className="hover:text-primary-600">Create Account</Link></li>
                  <li><Link href="/help" className="hover:text-primary-600">How to Play</Link></li>
                  <li><Link href="/rules" className="hover:text-primary-600">Game Rules</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">For Admins</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><Link href="/admin/login" className="hover:text-primary-600">Admin Login</Link></li>
                  <li><Link href="/contact" className="hover:text-primary-600">Request Admin Access</Link></li>
                  <li><Link href="/help/admin" className="hover:text-primary-600">Admin Guide</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><Link href="/help" className="hover:text-primary-600">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-primary-600">Contact Us</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
                <div className="text-sm text-neutral-600 space-y-2">
                  <p>This platform is for entertainment purposes only.</p>
                  <p>No actual money is exchanged.</p>
                  <p>Please gamble responsibly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;