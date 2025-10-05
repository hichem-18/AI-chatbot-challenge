import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { tokenManager } from '../utils/api';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = tokenManager.isAuthenticated();
  const userInfo = tokenManager.getUserInfo();

  const handleLogout = () => {
    tokenManager.removeToken();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? "/chat" : "/"} 
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('app.title')}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/chat')
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('navigation.chat')}
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('navigation.profile')}
                </Link>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {userInfo?.username || userInfo?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium"
                  >
                    {t('navigation.logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('navigation.home')}
                </Link>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  {t('navigation.signup')}
                </Link>
              </>
            )}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <LanguageSwitcher />
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;