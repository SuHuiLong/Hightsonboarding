import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../components/ChatLayout';
import { ChatMessage, Message } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { ActionCard } from '../components/ActionCard';
import { useLanguage } from '../contexts/LanguageContext';
import { RefreshCw, Settings, Headphones, AlertCircle } from 'lucide-react';

export function ErrorPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showReasons, setShowReasons] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const errorReasons = [
    t('error.reason.power'),
    t('error.reason.distance'),
    t('error.reason.network'),
  ];

  useEffect(() => {
    // Show error message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('error.connection'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowReasons(true);
    }, 1000);

    // Show solutions
    const timer2 = setTimeout(() => {
      setIsTyping(true);
    }, 2500);

    const timer3 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: '2',
          type: 'assistant',
          content: t('error.solutions'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowActions(true);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [t]);

  const handleRetry = () => {
    navigate('/detect');
  };

  const handleManualSetup = () => {
    // In real app, would navigate to manual setup flow
    alert('Manual setup would start here');
  };

  const handleContactSupport = () => {
    // In real app, would open support chat/form
    alert('Support contact would open here');
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Error Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4"
            >
              <AlertCircle className="w-10 h-10 text-white" aria-hidden="true" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('error.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Error Reasons */}
            {showReasons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 my-4"
              >
                <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {errorReasons.map((reason, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-2 text-sm text-orange-900 dark:text-orange-200 ${
                        isRTL ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                      <span>{reason}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {isTyping && <TypingIndicator />}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-3 mt-8">
            <ActionCard
              icon={RefreshCw}
              title={t('error.retry.setup')}
              onClick={handleRetry}
              variant="primary"
            />
            <ActionCard
              icon={Settings}
              title={t('error.manual.setup')}
              onClick={handleManualSetup}
              variant="secondary"
            />
            <ActionCard
              icon={Headphones}
              title={t('error.contact.support')}
              onClick={handleContactSupport}
              variant="outline"
            />
          </div>
        )}
      </div>
    </ChatLayout>
  );
}
