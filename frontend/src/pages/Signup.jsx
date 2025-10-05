import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI, tokenManager } from '../utils/api';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      const { token } = response.data.data;
      tokenManager.setToken(token);
      navigate('/chat');
    } catch (error) {
      setError(error.message || t('auth.signupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.signup')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('common.welcome')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="notification-error">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-primary mt-1"
                placeholder={t('auth.username')}
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-primary mt-1"
                placeholder={t('auth.email')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-primary mt-1"
                placeholder={t('auth.password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-primary mt-1"
                placeholder={t('auth.confirmPassword')}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {loading && <div className="spinner mr-2" />}
            {t('auth.signupButton')}
          </button>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">{t('auth.alreadyHaveAccount')} </span>
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              {t('auth.switchToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;