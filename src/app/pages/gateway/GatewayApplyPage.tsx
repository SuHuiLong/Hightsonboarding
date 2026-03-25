import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { SetupProgress } from '../../components/SetupProgress';
import { useLanguage } from '../../contexts/LanguageContext';
import { Wifi, RadioTower, ArrowRightLeft, CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export function GatewayApplyPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: t('gateway.apply.step1'), status: 'pending' },
    { id: '2', label: t('gateway.apply.step2'), status: 'pending' },
    { id: '3', label: t('gateway.apply.step3'), status: 'pending' },
    { id: '4', label: t('gateway.apply.step4'), status: 'pending' },
  ]);
  const [showSwitchAnimation, setShowSwitchAnimation] = useState(false);
  const [switchPhase, setSwitchPhase] = useState<'old' | 'switching' | 'new'>('old');

  useEffect(() => {
    // Initial message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.apply.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    // Progress through steps
    const stepTimers = [2000, 4500, 7000, 9500].map((delay, index) =>
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => {
            if (i < index) return { ...step, status: 'complete' };
            if (i === index) return { ...step, status: 'active' };
            return step;
          })
        );

        // Show switch animation during step 3
        if (index === 2) {
          setShowSwitchAnimation(true);
          setSwitchPhase('switching');
        }
      }, delay)
    );

    // Complete all steps and show new network
    const finalTimer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((step) => ({ ...step, status: 'complete' }))
      );
      setSwitchPhase('new');
      setMessages((prev) => [
        ...prev,
        {
          id: '2',
          type: 'assistant',
          content: t('gateway.apply.success'),
          timestamp: new Date(),
        },
      ]);
    }, 11000);

    // Navigate to success
    const navTimer = setTimeout(() => {
      navigate('/gateway/success');
    }, 13000);

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
              {t('gateway.apply.title')}
            </h1>
          </div>

          {/* Wi-Fi Switch Animation */}
          <AnimatePresence>
            {showSwitchAnimation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-4">
                    {/* Old Network */}
                    <motion.div
                      animate={{
                        opacity: switchPhase === 'old' ? 1 : switchPhase === 'switching' ? 0.4 : 0.2,
                        scale: switchPhase === 'old' ? 1 : 0.9,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        switchPhase === 'new' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <Wifi className={`w-7 h-7 ${
                          switchPhase === 'new' ? 'text-gray-400' : 'text-blue-500'
                        }`} />
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center max-w-[80px] truncate">
                        GW-Setup
                      </span>
                    </motion.div>

                    {/* Arrow Animation */}
                    <motion.div
                      animate={{
                        scale: switchPhase === 'switching' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.6, repeat: switchPhase === 'switching' ? Infinity : 0 }}
                    >
                      <ArrowRightLeft className={`w-6 h-6 ${
                        switchPhase === 'switching' ? 'text-indigo-500' : 'text-gray-300 dark:text-gray-600'
                      }`} />
                    </motion.div>

                    {/* New Network */}
                    <motion.div
                      animate={{
                        opacity: switchPhase === 'new' ? 1 : switchPhase === 'switching' ? 0.6 : 0.3,
                        scale: switchPhase === 'new' ? 1 : 0.9,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        switchPhase === 'new'
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {switchPhase === 'new' ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            <CheckCircle className="w-7 h-7 text-white" />
                          </motion.div>
                        ) : (
                          <Wifi className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <span className={`text-xs font-medium text-center max-w-[80px] truncate ${
                        switchPhase === 'new'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {t('gateway.apply.new.network')}
                      </span>
                    </motion.div>
                  </div>

                  {/* Status label */}
                  <div className="text-center mt-4">
                    <AnimatePresence mode="wait">
                      {switchPhase === 'switching' && (
                        <motion.p
                          key="switching"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                          {t('gateway.apply.switching')}
                        </motion.p>
                      )}
                      {switchPhase === 'new' && (
                        <motion.p
                          key="switched"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-green-600 dark:text-green-400 font-medium"
                        >
                          {t('gateway.apply.switched')}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
