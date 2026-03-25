import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { Wifi, Eye, EyeOff, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export function ExtenderWiFiPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { roomLocation, mainLocation } = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const location = roomLocation || mainLocation || 'Home';
  const suggestedSSIDs = [
    `${location}-WiFi`,
    `${location}-Network`,
    `My${location}Net`,
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.wifi.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowForm(true);
    }, 1000);

    return () => clearTimeout(timer1);
  }, [t]);

  const getPasswordStrength = (pw: string): PasswordStrength => {
    if (pw.length < 8) return 'weak';
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"|,.<>?]/.test(pw);
    const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;
    if (score >= 3 && pw.length >= 12) return 'strong';
    if (score >= 2 && pw.length >= 8) return 'medium';
    return 'weak';
  };

  const strength = getPasswordStrength(password);
  const strengthConfig = {
    weak: {
      label: t('gateway.wifi.password.weak'),
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      icon: ShieldAlert,
      width: 'w-1/3',
    },
    medium: {
      label: t('gateway.wifi.password.medium'),
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      icon: Shield,
      width: 'w-2/3',
    },
    strong: {
      label: t('gateway.wifi.password.strong'),
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      icon: ShieldCheck,
      width: 'w-full',
    },
  };

  const isFormValid = ssid.trim().length >= 1 && password.length >= 8;

  const handleContinue = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: `SSID: ${ssid}`,
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => {
      navigate('/extender/connecting');
    }, 500);
  };

  const StrengthIcon = strengthConfig[strength].icon;

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.wifi.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Wi-Fi Configuration Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5"
              >
                {/* SSID Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Wifi className="w-4 h-4 text-indigo-500" />
                    {t('gateway.wifi.ssid.label')}
                  </label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSSID(e.target.value)}
                    placeholder={t('gateway.wifi.ssid.placeholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />

                  {/* SSID Suggestions */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('gateway.wifi.ssid.suggestions')}:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSSIDs.map((suggested) => (
                        <button
                          key={suggested}
                          type="button"
                          onClick={() => setSSID(suggested)}
                          className="px-3 py-1 rounded-full text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                          {suggested}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <StrengthIcon className={`w-4 h-4 ${strengthConfig[strength].textColor}`} />
                    {t('gateway.wifi.password.label')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('gateway.wifi.password.placeholder')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base pr-12 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: strengthConfig[strength].width }}
                          className={`h-full rounded-full ${strengthConfig[strength].color}`}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className={`text-xs font-medium ${strengthConfig[strength].textColor}`}>
                        {strengthConfig[strength].label}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Network Preview */}
                {isFormValid && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800"
                  >
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      {t('gateway.wifi.preview')}
                    </p>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{ssid}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{'•'.repeat(Math.min(password.length, 12))}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={!isFormValid}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('continue')}
            </motion.button>
          </motion.div>
        )}
      </div>
    </ChatLayout>
  );
}
