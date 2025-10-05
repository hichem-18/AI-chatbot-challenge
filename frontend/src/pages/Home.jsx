import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🤖</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              {t('app.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('app.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="btn-primary px-8 py-3 text-lg"
            >
              {t('navigation.signup')}
            </Link>
            <Link
              to="/login"
              className="btn-outline px-8 py-3 text-lg"
            >
              {t('navigation.login')}
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Multi-Language
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Support for English and Arabic with proper RTL
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced LangGraph agent with intelligent routing
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rich Conversations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Persistent memory and conversation management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;