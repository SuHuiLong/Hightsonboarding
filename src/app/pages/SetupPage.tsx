import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChatLayout } from '../components/ChatLayout';
import { ChatMessage, Message } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { SetupProgress } from '../components/SetupProgress';
import { SkipButton } from '../components/SkipButton';
import { useLanguage } from '../contexts/LanguageContext';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export function SetupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: t('setup.connecting'), status: 'pending' },
    { id: '2', label: t('setup.configuring'), status: 'pending' },
    { id: '3', label: t('setup.securing'), status: 'pending' },
    { id: '4', label: t('setup.finalizing'), status: 'pending' },
  ]);

  useEffect(() => {
    // Initial message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('setup.start'),
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
    }, 9500);

    // Navigate to success
    const navTimer = setTimeout(() => {
      navigate('/success');
    }, 10500);

    return () => {
      clearTimeout(timer1);
      stepTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
      clearTimeout(navTimer);
    };
  }, [t, navigate]);

  return (
    <ChatLayout>
      <SkipButton onSkip={() => navigate('/success')} />
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
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