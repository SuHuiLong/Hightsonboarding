import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Cloud, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { TopBar } from '../components/TopBar';

export function LoginPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields for Cloud login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleLogin = () => {
    setShowError(false);
    setFormError('');

    if (!agreedToTerms) {
      setShowError(true);
      return;
    }

    // Validate email
    if (!email.trim()) {
      setFormError(t('login.error.email'));
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError(t('login.error.email.invalid'));
      return;
    }

    // Validate password
    if (!password.trim()) {
      setFormError(t('login.error.password'));
      return;
    }

    if (password.length < 6) {
      setFormError(t('login.error.password.short'));
      return;
    }

    // Store login info
    localStorage.setItem('loginMethod', 'cloud');
    localStorage.setItem('username', email);
    
    // Navigate to welcome page
    navigate('/welcome');
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreedToTerms(checked);
    setShowError(false);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Bar with Language, Dark Mode, and Settings */}
      <TopBar showLogo={false} showSettings={true} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pt-16 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <Cloud className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('login.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Form Fields */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('login.form.title')}
            </h2>

            <div className="space-y-3">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('login.form.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none ${
                    formError && formError.includes(t('login.error.email'))
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {formError && formError.includes(t('login.error.email')) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.form.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-4 ${
                    isRTL ? 'pl-12 pr-4' : 'pr-12 pl-4'
                  } rounded-xl border-2 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none ${
                    formError && formError.includes(t('login.error.password'))
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button
                  type="button"
                  className={`absolute top-1/2 ${
                    isRTL ? 'left-4' : 'right-4'
                  } transform -translate-y-1/2`}
                  onClick={handlePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                {formError && formError.includes(t('login.error.password')) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Terms & Agreements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <label
              className="flex items-start gap-3 cursor-pointer group"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => handleTermsChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500 ${
                  showError && !agreedToTerms
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {agreedToTerms && (
                    <Check className="w-full h-full text-white p-0.5" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${
                  showError && !agreedToTerms
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {t('login.terms.agree')}{' '}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // In real app, open terms modal or page
                      window.open('#', '_blank');
                    }}
                    className="text-blue-500 hover:text-blue-600 inline-flex items-center gap-1 underline"
                  >
                    {t('login.terms.link')}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </p>
                {showError && !agreedToTerms && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {t('login.terms.required')}
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
              agreedToTerms
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            {t('login.button')}
          </motion.button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {t('login.footer')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
