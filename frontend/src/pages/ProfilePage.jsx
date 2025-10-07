import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { chatAPI } from '../utils/api';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { statistics, fetchStatistics } = useChatContext();
  
  // State management
  const [userSummary, setUserSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user summary (statistics are already loaded in ChatContext)
      await fetchUserSummary();
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSummary = async () => {
    try {
      const response = await chatAPI.getUserSummary({ language: selectedLanguage });
      
      if (response.data.success && response.data.data.summary) {
        setUserSummary({
          summary: response.data.data.summary.text,
          lastUpdated: response.data.data.summary.updatedAt
        });
      } else {
        // No summary available yet
        setUserSummary(null);
      }
    } catch (error) {
      console.error('Error fetching user summary:', error);
      // Set default message when no summary exists
      setUserSummary(null);
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    // TODO: Update user preference in backend
  };

  const regenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await chatAPI.generateUserSummary({ language: selectedLanguage });
      
      if (response.data.success && response.data.data.summary) {
        setUserSummary({
          summary: response.data.data.summary.text,
          lastUpdated: response.data.data.summary.updatedAt
        });
      } else {
        // Handle case where generation failed
        console.warn('Summary generation failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error regenerating summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    // TODO: Implement delete account API call
    setShowDeleteModal(false);
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 dark:text-gray-300">{t('profile.notLoggedIn')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 text-white/80 hover:text-white transition-colors duration-300 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">{t('common.back') || 'Back'}</span>
      </Link>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-6xl">👤</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-full border-4 border-white dark:border-gray-800 shadow-lg">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {t('profile.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* User Information Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 group-hover:shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('profile.userInfo')}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {t('profile.email')}
                    </label>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {t('profile.language')}
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full p-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                    >
                      <option value="en">{t('languages.english')}</option>
                      <option value="ar">{t('languages.arabic')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 group-hover:shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('profile.statistics')}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {t('profile.totalConversations')}
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.totalConversations}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {t('profile.totalMessages')}
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {statistics.totalMessages}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">English</div>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {statistics.englishMessages}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200/50 dark:border-orange-700/50">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">العربية</div>
                        <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                          {statistics.arabicMessages}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {statistics.lastActivity && (
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Last Activity</div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {new Date(statistics.lastActivity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary and Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Summary Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 group-hover:shadow-2xl border-l-4 border-l-pink-500">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t('profile.aiSummary')}
                    </h2>
                  </div>
                  <button
                    onClick={regenerateSummary}
                    disabled={summaryLoading}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <span className={`text-xl ${summaryLoading ? 'animate-spin' : ''}`}>
                      🔄
                    </span>
                    {summaryLoading ? t('profile.generating') : t('profile.regenerate')}
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50/80 to-orange-50/80 dark:from-pink-900/20 dark:to-orange-900/20 rounded-2xl p-6 backdrop-blur-sm border border-pink-200/50 dark:border-pink-700/50">
                  {summaryLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-600"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-pink-200 dark:border-pink-800"></div>
                      </div>
                    </div>
                  ) : userSummary ? (
                    <div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {userSummary.summary}
                      </p>
                      {userSummary.lastUpdated && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-2">🕒</span>
                          {t('profile.lastUpdated')}: {new Date(userSummary.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🤖</div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('profile.noSummary') || 'No AI summary available yet'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {t('profile.noSummaryDesc') || 'Start chatting to generate your personalized summary'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 group-hover:shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('profile.accountActions')}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <span className="text-2xl group-hover:animate-bounce">🗑️</span>
                    {t('profile.deleteAccount')}
                  </button>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700/50">
                    ⚠️ This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative max-w-md w-full animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('profile.confirmDelete')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('profile.deleteWarning')}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t('profile.confirmDeleteButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;