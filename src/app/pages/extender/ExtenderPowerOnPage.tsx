import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { MapPin, Power, Clock, CheckCircle } from 'lucide-react';

export function ExtenderPowerOnPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const instructions = [
    { icon: MapPin, text: t('extender.poweron.instruction1') },
    { icon: Power, text: t('extender.poweron.instruction2') },
    { icon: Clock, text: t('extender.poweron.instruction3') },
  ];

  useEffect(() => {
    // Show initial message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.poweron.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowInstructions(true);
    }, 1000);

    // Show confirm button
    const timer2 = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t]);

  const handleContinue = () => {
    navigate('/extender/step1');
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.poweron.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 pb-24">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}

            {/* Power On Instructions Card */}
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="space-y-4">
                  {instructions.map((instruction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <instruction.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {instruction.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Continue Button */}
            {showButton && (
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
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{t('extender.poweron.confirm')}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}