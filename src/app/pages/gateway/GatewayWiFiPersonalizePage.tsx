import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { Wifi, Eye, EyeOff, Shield, ShieldCheck, ShieldAlert, MapPin } from 'lucide-react';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export function GatewayWiFiPersonalizePage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { mainLocation, setMainLocation } = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [showWiFi, setShowWiFi] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomLocationInput, setShowCustomLocationInput] = useState(false);

  const locationOptions = [
    { id: 'home', label: t('gateway.wifi.location.home'), value: 'Home' },
    { id: 'office', label: t('gateway.wifi.location.office'), value: 'Office' },
    { id: 'factory', label: t('gateway.wifi.location.factory'), value: 'Factory' },
    { id: 'shop', label: t('gateway.wifi.location.shop'), value: 'Shop' },
  ];

  const suggestedSSIDs = [
    `${mainLocation || 'Home'}-WiFi`,
    `${mainLocation || 'Home'}-Network`,
    `My${mainLocation || 'Home'}Net`,
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.wifi.location.message'),
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

  const handleLocationSelect = (locationLabel: string, locationValue: string) => {
    setMainLocation(locationValue);
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: locationLabel,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setShowLocation(false);
      setShowWiFi(true);
      setMessages((prev) => [
        ...prev,
        {
          id: '3',
          type: 'assistant',
          content: t('gateway.wifi.message'),
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  const handleCustomLocationClick = () => {
    setShowCustomLocationInput(true);
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      handleLocationSelect(customLocation.trim(), customLocation.trim());
    }
  };

  const handleContinue = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '4',
        type: 'user',
        content: `SSID: ${ssid}`,
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => {
      navigate('/gateway/apply');
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
              {t('gateway.wifi.title')}
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
                className="space-y-6 mt-4"
              >
                {/* Location Selection */}
                {showLocation && (
                  <div className="grid grid-cols-2 gap-3">
                    {locationOptions.map((option, index) => (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        onClick={() => handleLocationSelect(option.label, option.value)}
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all duration-200"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {option.label}
                        </span>
                      </motion.button>
                    ))}

                    {/* Custom Location Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: locationOptions.length * 0.08 }}
                      onClick={handleCustomLocationClick}
                      className="col-span-2 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-3 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-200"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('gateway.wifi.location.custom')}
                      </span>
                    </motion.button>
                  </div>
                )}

                {/* Custom Location Input */}
                {showLocation && showCustomLocationInput && (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCustomLocationSubmit}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        placeholder={t('gateway.wifi.location.custom.placeholder')}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                        autoFocus
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <button
                        type="submit"
                        disabled={!customLocation.trim()}
                        className={`w-full mt-4 px-6 py-3 bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                      >
                        {t('continue')}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* WiFi Settings */}
                {showWiFi && (
                  <>
                    {/* SSID Input */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t('gateway.wifi.ssid.label')}
                      </label>
                      <input
                        type="text"
                        value={ssid}
                        onChange={(e) => setSSID(e.target.value)}
                        placeholder={t('gateway.wifi.ssid.placeholder')}
                        maxLength={32}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />

                      {/* SSID Suggestions */}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {t('gateway.wifi.ssid.suggestions')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedSSIDs.map((suggestion) => (
                            <motion.button
                              key={suggestion}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSSID(suggestion)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                ssid === suggestion
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                              }`}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t('gateway.wifi.password.label')}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t('gateway.wifi.password.placeholder')}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base pr-12"
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
                              animate={{ width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }}
                              className={`h-full ${strengthConfig[strength].color} rounded-full transition-all`}
                            />
                          </div>
                          <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <StrengthIcon className={`w-3.5 h-3.5 ${strengthConfig[strength].textColor}`} />
                            <span className={`text-xs font-medium ${strengthConfig[strength].textColor}`}>
                              {strengthConfig[strength].label}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Network Preview Card */}
                    {ssid && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800"
                      >
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                          {t('gateway.wifi.preview')}
                        </p>
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{ssid}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              WPA3 • 5GHz / 2.4GHz
                            </p>
                          </div>
                          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                            <div className="flex gap-0.5 items-end">
                              {[1, 2, 3, 4].map((bar) => (
                                <div
                                  key={bar}
                                  className={`w-1 rounded-full bg-indigo-500 dark:bg-indigo-400`}
                                  style={{ height: `${bar * 4 + 4}px` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {showWiFi && (
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
