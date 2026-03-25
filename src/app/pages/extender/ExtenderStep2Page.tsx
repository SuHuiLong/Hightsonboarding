import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export function ExtenderStep2Page() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.step2.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowInput(true);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (serialNumber.length < 10) {
      setError(t('extender.step2.invalid'));
      return;
    }

    setError('');
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: serialNumber,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      navigate('/extender/step3');
    }, 500);
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.step2.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Serial Number Input */}
            {showInput && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => {
                      setSerialNumber(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder={t('extender.step2.placeholder')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      error 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                    autoFocus
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                  <button
                    type="submit"
                    className={`w-full mt-4 px-6 py-3 bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      isRTL ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <span>{t('extender.step2.submit')}</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
