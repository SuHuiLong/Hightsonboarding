import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { Home, Building2, Coffee, Store, MapPin } from 'lucide-react';

export function GatewayLocationPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { setMainLocation } = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLocation, setCustomLocation] = useState('');

  // Get username from localStorage
  const username = localStorage.getItem('username') || 'User';

  const locationOptions = [
    { id: 'myhome', icon: Home, label: `${username}${t('gateway.location.myhome.suffix')}` },
    { id: 'floor1', icon: Building2, label: t('gateway.location.floor1') },
    { id: 'floor2', icon: Building2, label: t('gateway.location.floor2') },
    { id: 'floor3', icon: Building2, label: t('gateway.location.floor3') },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.location.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowOptions(true);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [t]);

  const handleLocationSelect = (location: string) => {
    setMainLocation(location);
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: location,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      navigate('/gateway/wanconfig');
    }, 500);
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
    setShowOptions(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      handleLocationSelect(customLocation.trim());
    }
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.location.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Location Options */}
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 mt-6"
              >
                {locationOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLocationSelect(option.label)}
                    className={`w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex items-center gap-4 ${
                      isRTL ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <option.icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                  </motion.button>
                ))}

                {/* Custom Location Button */}
                <motion.button
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: locationOptions.length * 0.1 }}
                  onClick={handleCustomClick}
                  className={`w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-200 flex items-center gap-4 ${
                    isRTL ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {t('gateway.location.custom')}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Custom Input */}
            {showCustomInput && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleCustomSubmit}
                className="mt-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder={t('gateway.location.custom.placeholder')}
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
                    {t('gateway.location.continue')}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}