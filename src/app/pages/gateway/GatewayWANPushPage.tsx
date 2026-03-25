import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { SetupProgress } from '../../components/SetupProgress';
import { useLanguage } from '../../contexts/LanguageContext';
import { Upload, Globe, Shield, CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export function GatewayWANPushPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: t('gateway.wanpush.step1'), status: 'pending' },
    { id: '2', label: t('gateway.wanpush.step2'), status: 'pending' },
    { id: '3', label: t('gateway.wanpush.step3'), status: 'pending' },
    { id: '4', label: t('gateway.wanpush.step4'), status: 'pending' },
  ]);
  const [showInternetStatus, setShowInternetStatus] = useState(false);

  useEffect(() => {
    // Initial message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.wanpush.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    // Progress through steps
    const stepTimers = [2000, 4000, 6000, 8000].map((delay, index) =>
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => {
            if (i < index) return { ...step, status: 'complete' };
            if (i === index) return { ...step, status: 'active' };
            return step;
          })
        );
      }, delay)
    );

    // Complete all steps
    const finalTimer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((step) => ({ ...step, status: 'complete' }))
      );
      setShowInternetStatus(true);
      setMessages((prev) => [
        ...prev,
        {
          id: '2',
          type: 'assistant',
          content: t('gateway.wanpush.success'),
          timestamp: new Date(),
        },
      ]);
    }, 9500);

    // Navigate to Wi-Fi personalize
    const navTimer = setTimeout(() => {
      navigate('/gateway/wifi-personalize');
    }, 11500);

    return () => {
      clearTimeout(timer1);
      stepTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
      clearTimeout(navTimer);
    };
  }, [t, navigate]);

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.wanpush.title')}
            </h1>
          </div>

          {/* Upload animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(99, 102, 241, 0.4)',
                    '0 0 0 20px rgba(99, 102, 241, 0)',
                    '0 0 0 0 rgba(99, 102, 241, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: showInternetStatus ? 0 : Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"
              >
                {showInternetStatus ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Upload className="w-10 h-10 text-white" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {!isTyping && (
              <div className="mt-6">
                <SetupProgress steps={steps} />
              </div>
            )}

            {/* Internet Connected Status */}
            {showInternetStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 mt-4"
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200 text-sm">
                      {t('gateway.wanpush.internet.connected')}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {t('gateway.wanpush.internet.desc')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
