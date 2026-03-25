import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
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

export function ExtenderStep3Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: t('extender.step3.registering'), status: 'pending' },
    { id: '2', label: t('extender.step3.binding'), status: 'pending' },
    { id: '3', label: t('extender.step3.whitelisting'), status: 'pending' },
  ]);

  // Check if we should skip the power on step (from Bluetooth/QR scan)
  const skipPowerOn = location.state?.skipPowerOn || false;

  useEffect(() => {
    console.log('ExtenderStep3Page - skipPowerOn:', skipPowerOn);
    console.log('ExtenderStep3Page - location.state:', location.state);
    
    // Initial message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.step3.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    // Progress through steps
    const stepTimers = [2000, 3500, 5000].map((delay, index) =>
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
    }, 6500);

    // Show success message
    const messageTimer = setTimeout(() => {
      setIsTyping(true);
    }, 7000);

    const message2Timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: '2',
          type: 'assistant',
          content: t('extender.step3.authorized'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 8000);

    // Navigate to next step
    const navTimer = setTimeout(() => {
      navigate('/extender/room', { state: { skipPowerOn } });
    }, 9000);

    return () => {
      clearTimeout(timer1);
      stepTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
      clearTimeout(messageTimer);
      clearTimeout(message2Timer);
      clearTimeout(navTimer);
    };
  }, [t, navigate, skipPowerOn]);

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.step3.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                {index > 0 && isTyping && <TypingIndicator />}
                <ChatMessage message={message} />
              </div>
            ))}
            
            {messages.length === 1 && !isTyping && (
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