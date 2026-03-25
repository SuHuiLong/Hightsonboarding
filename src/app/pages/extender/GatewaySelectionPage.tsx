import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGateway } from '../../contexts/GatewayContext';
import { Router, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export function GatewaySelectionPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { gateways, setSelectedGateway } = useGateway();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (gateways.length === 0) {
        // No gateways available
        setMessages([
          {
            id: '1',
            type: 'assistant',
            content: t('gateway.select.nogateways'),
            timestamp: new Date(),
          },
        ]);
      } else {
        // Show gateway selection
        setMessages([
          {
            id: '1',
            type: 'assistant',
            content: t('gateway.select.message'),
            timestamp: new Date(),
          },
        ]);
      }
      setIsTyping(false);
      setShowOptions(true);
    }, 1000);

    return () => clearTimeout(timer1);
  }, [t, gateways.length]);

  const handleSelectGateway = (gatewayId: string) => {
    setSelectedGatewayId(gatewayId);
    const gateway = gateways.find((gw) => gw.id === gatewayId);
    if (gateway) {
      setSelectedGateway(gateway);
    }
  };

  const handleContinue = () => {
    if (selectedGatewayId) {
      navigate('/extender/poweron');
    }
  };

  const handleSetupGateway = () => {
    navigate('/gateway/step1');
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.select.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 pb-32">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}

            {/* No Gateways - Show Setup Option */}
            {showOptions && gateways.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Info Card */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {t('gateway.select.required')}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t('gateway.select.required.desc')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Setup Gateway Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSetupGateway}
                  className="w-full p-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Router className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {t('welcome.setup.gateway')}
                      </h3>
                      <p className="text-sm text-blue-100">
                        {t('gateway.select.setup.first')}
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Gateway List */}
            {showOptions && gateways.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {gateways.map((gateway) => (
                  <motion.button
                    key={gateway.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectGateway(gateway.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedGatewayId === gateway.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedGatewayId === gateway.id
                            ? 'bg-blue-500'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <Router
                          className={`w-6 h-6 ${
                            selectedGatewayId === gateway.id
                              ? 'text-white'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {gateway.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              gateway.status === 'online'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {gateway.status === 'online'
                              ? t('device.status.online')
                              : t('device.status.offline')}
                          </span>
                          {selectedGatewayId === gateway.id && (
                            <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('gateway.success.location')}: {gateway.location}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {t('gateway.success.ssid')}: {gateway.setupSSID}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}

                {/* Add Another Gateway Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSetupGateway}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <div className="flex items-center gap-3 justify-center">
                    <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('gateway.select.add.another')}
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {showOptions && gateways.length > 0 && selectedGatewayId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-gray-950 dark:via-gray-950 to-transparent"
          >
            <div className="max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
              >
                {t('continue')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </ChatLayout>
  );
}
