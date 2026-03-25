import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { ActionCard } from '../../components/ActionCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { useLocation } from '../../contexts/LocationContext';
import { useGateway } from '../../contexts/GatewayContext';
import { Wifi, CheckCircle, MapPin, Plus, Home } from 'lucide-react';

export function GatewaySuccessPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { config } = useWhiteLabel();
  const { mainLocation } = useLocation();
  const { gateways } = useGateway();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Get the actual WiFi SSID from the most recently added gateway
  const latestGateway = gateways.length > 0 ? gateways[gateways.length - 1] : null;
  const wifiSSID = latestGateway?.setupSSID || 'Gateway-Onboarding';

  useEffect(() => {
    // Gateway is already added by QuickSetupPage or other setup flows
    // No need to add it again here

    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.success.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowStats(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      setShowActions(true);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t, mainLocation]);

  const stats = [
    { icon: Wifi, label: t('gateway.success.ssid'), value: wifiSSID },
    { icon: CheckCircle, label: t('gateway.success.status'), value: 'Online' },
    { icon: MapPin, label: t('gateway.success.location'), value: mainLocation || 'Home' },
  ];

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.success.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          {/* Network Stats */}
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between ${
                    isRTL ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500"
                      style={{
                        background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
                      }}
                    >
                      <stat.icon className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-3 mt-8">
            <ActionCard
              icon={Plus}
              title={t('gateway.success.add.extender')}
              onClick={() => navigate('/extender/poweron')}
              variant="primary"
            />
            <ActionCard
              icon={Home}
              title={t('gateway.success.finish')}
              onClick={() => navigate('/')}
              variant="secondary"
            />
          </div>
        )}
      </div>
    </ChatLayout>
  );
}