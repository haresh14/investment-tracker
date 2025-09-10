import type { FC } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

interface UserDropdownProps {
  user: any;
  onSignOut: () => void;
}

const UserDropdown: FC<UserDropdownProps> = ({ user, onSignOut }) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
          <span className="text-sm font-semibold text-center">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
        <li className="px-0 py-2">
          <div className="text-base font-medium text-base-content">
            {user?.email?.split('@')[0] || 'User'}
          </div>
        </li>
        <li className="px-0 pb-2">
          <div className="text-sm text-base-content/60">
            {user?.email}
          </div>
        </li>
        <div className="divider my-2"></div>
        <li>
          <button onClick={onSignOut} className="text-error hover:bg-error/10 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      path: '/withdrawals',
      label: 'Withdrawals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  return (
    <header className="bg-base-100 border-b border-base-300 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary text-primary-content rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-base-content">Investment Tracker</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-2 py-1 transition-colors ${
                  isActivePage(item.path)
                    ? 'text-primary font-medium border-b-2 border-primary'
                    : 'text-base-content/70 hover:text-base-content'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* Desktop User Dropdown */}
            <div className="hidden md:block">
              <UserDropdown user={user} onSignOut={handleSignOut} />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-base-300 bg-base-50">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile User Info at Top */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-base-300">
                <div className="w-10 h-10 bg-primary text-primary-content rounded-full flex items-center justify-center">
                  <span className="font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base-content">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-1 mb-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      isActivePage(item.path)
                        ? 'bg-primary text-primary-content font-medium'
                        : 'text-base-content hover:bg-base-200'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Sign Out */}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-3 py-3 text-error hover:bg-error/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Page Title Section */}
      {(title || subtitle) && (
        <div className="bg-base-200/50 border-t border-base-300">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center lg:text-left">
              {title && (
                <h1 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-base-content/70 text-sm lg:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
