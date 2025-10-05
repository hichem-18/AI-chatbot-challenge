import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authAPI, chatAPI, tokenManager } from '../utils/api';

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = tokenManager.getUserInfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, summaryResponse] = await Promise.all([
          authAPI.getProfile(),
          chatAPI.getUserSummary()
        ]);
        
        setUser(profileResponse.data.data);
        setStats(summaryResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('profile.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('profile.personalInfo')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.username')}
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.username || userInfo?.username}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.email')}
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.email || userInfo?.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('profile.language')}
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.language_preference === 'ar' ? 'العربية' : 'English'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('profile.statistics')}
            </h2>
            {stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 dark:bg-primary-900 p-3 rounded-lg">
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {t('profile.totalMessages')}
                  </p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                    {stats.statistics?.totalMessages || 0}
                  </p>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-900 p-3 rounded-lg">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {t('profile.totalConversations')}
                  </p>
                  <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">
                    {stats.statistics?.totalConversations || 0}
                  </p>
                </div>
                <div className="bg-success-50 p-3 rounded-lg">
                  <p className="text-sm text-success-600">
                    {t('profile.englishMessages')}
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {stats.statistics?.englishMessages || 0}
                  </p>
                </div>
                <div className="bg-warning-50 p-3 rounded-lg">
                  <p className="text-sm text-warning-600">
                    {t('profile.arabicMessages')}
                  </p>
                  <p className="text-2xl font-bold text-warning-700">
                    {stats.statistics?.arabicMessages || 0}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {t('common.loading')}
              </p>
            )}
          </div>
        </div>

        {/* User Summary */}
        {stats?.summary && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('profile.userSummary')}
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                {stats.summary.text}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('profile.lastActivity')}: {new Date(stats.summary.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;