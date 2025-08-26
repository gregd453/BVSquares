import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BV Squares - Sports Betting Squares Game</title>
        <meta name="description" content="Create and manage sports betting squares with admin approval workflows. Play football, basketball, and soccer squares games." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <AuthProvider>
        <div className="min-h-screen bg-neutral-50 flex flex-col">
          <Header />
          
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}

export default MyApp;