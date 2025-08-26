import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">
                BV
              </div>
              <span className="text-xl font-bold text-neutral-900">
                BV Squares
              </span>
            </div>
            <p className="text-neutral-600 mb-4 max-w-md">
              The premier platform for managing sports betting squares with admin approval workflows. 
              Create games, request squares, and track winners in a fun and organized way.
            </p>
            <div className="flex space-x-4">
              <span className="text-sm text-neutral-500">
                🏈 Football
              </span>
              <span className="text-sm text-neutral-500">
                🏀 Basketball
              </span>
              <span className="text-sm text-neutral-500">
                ⚽ Soccer
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Browse Games
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Game Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-500 text-sm">
            © {currentYear} BV Squares. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-neutral-500">
            Built with{' '}
            <span className="text-red-500" aria-label="love">❤️</span>
            {' '}using the Claude Development Pipeline
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 text-center max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> This platform is for entertainment purposes only. 
            No actual money is exchanged through this system. Users are responsible for any external 
            financial arrangements. Please gamble responsibly and in accordance with local laws.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;