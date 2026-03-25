import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { SetupProgress } from '../../components/SetupProgress';
import { useLanguage } from '../../contexts/LanguageContext';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export function ExtenderConnectingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: t('extender.step5.scanning'), status: 'pending' },
    { id: '2', label: t('extender.step5.authenticating'), status: 'pending' },
    { id: '3', label: t('extender.step5.connecting'), status: 'pending' },
    { id: '4', label: t('extender.step5.finalizing'), status: 'pending' },
  ]);

  // Show connecting message and start progress
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.step5.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [t]);

  // Progress through connection steps
  useEffect(() => {
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
    }, 9500);

    // Navigate to success
    const navTimer = setTimeout(() => {
      navigate('/extender/success');
    }, 10500);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.step5.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}

            {/* Progress - Show after message appears */}
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