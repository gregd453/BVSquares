import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePage = (path: string): boolean => {
    return router.pathname === path;
  };

  const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ 
    href, 
    children, 
    onClick 
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActivePage(href)
          ? 'bg-primary-100 text-primary-700'
          : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2"
            >
              <div className="bg-primary-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">
                BV
              </div>
              <span className="text-xl font-bold text-neutral-900">
                BV Squares
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/games">Games</NavLink>
            
            {isAuthenticated && user ? (
              <>
                {user.userType === 'player' && (
                  <NavLink href="/dashboard">Dashboard</NavLink>
                )}
                {user.userType === 'admin' && (
                  <>
                    <NavLink href="/admin/dashboard">Admin</NavLink>
                    <NavLink href="/admin/games">Manage Games</NavLink>
                    <NavLink href="/admin/requests">Requests</NavLink>
                  </>
                )}
              </>
            ) : null}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-neutral-600">
                  Welcome, <span className="font-medium">{user.displayName}</span>
                  {user.userType === 'admin' && (
                    <span className="ml-1 text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              href="/games" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Games
            </NavLink>
            
            {isAuthenticated && user ? (
              <>
                {user.userType === 'player' && (
                  <NavLink 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                )}
                {user.userType === 'admin' && (
                  <>
                    <NavLink 
                      href="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </NavLink>
                    <NavLink 
                      href="/admin/games"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Manage Games
                    </NavLink>
                    <NavLink 
                      href="/admin/requests"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Requests
                    </NavLink>
                  </>
                )}
                
                <div className="px-3 py-2 border-t border-neutral-200 mt-2 pt-2">
                  <div className="text-sm text-neutral-600 mb-2">
                    Logged in as <span className="font-medium">{user.displayName}</span>
                    {user.userType === 'admin' && (
                      <span className="ml-1 text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button
                    variant="tertiary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="px-3 py-2 border-t border-neutral-200 mt-2 pt-2 space-y-2">
                <Button
                  variant="tertiary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    router.push('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    router.push('/register');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;