import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { ActionCard } from '../../components/ActionCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle, Power, Cable, Lightbulb } from 'lucide-react';

export function GatewayStep1Page() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAction, setShowAction] = useState(false);

  const instructions = [
    { icon: Power, text: t('gateway.step1.instruction1') },
    { icon: Cable, text: t('gateway.step1.instruction2') },
    { icon: Lightbulb, text: t('gateway.step1.instruction3') },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.step1.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowInstructions(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setShowAction(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t]);

  const handleReady = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: t('gateway.step1.ready'),
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      navigate('/gateway/location');
    }, 500);
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.step1.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Instructions */}
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 my-4"
              >
                <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {instructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className={`flex items-start gap-3 text-sm text-blue-900 dark:text-blue-200 ${
                        isRTL ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <instruction.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <span className="flex-1 pt-1">{instruction.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {showAction && (
          <div className="mt-8">
            <ActionCard
              icon={CheckCircle}
              title={t('gateway.step1.ready')}
              onClick={handleReady}
              variant="primary"
            />
          </div>
        )}
      </div>
    </ChatLayout>
  );
}