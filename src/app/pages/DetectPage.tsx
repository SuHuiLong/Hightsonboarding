import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChatLayout } from '../components/ChatLayout';
import { ChatMessage, Message } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { ActionCard } from '../components/ActionCard';
import { DeviceCard } from '../components/DeviceCard';
import { SkipButton } from '../components/SkipButton';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, XCircle } from 'lucide-react';

export function DetectPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showDevice, setShowDevice] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const mockDevice = {
    id: '1',
    name: 'Gateway Pro Router',
    model: 'GW-5000',
    signal: 85,
    status: 'online' as const,
  };

  useEffect(() => {
    // Step 1: Show searching message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('detect.searching'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    // Step 2: Show device found message
    const timer2 = setTimeout(() => {
      setIsTyping(true);
    }, 3000);

    const timer3 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: '2',
          type: 'assistant',
          content: t('detect.found'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowDevice(true);
    }, 4500);

    // Step 3: Show confirmation question
    const timer4 = setTimeout(() => {
      setIsTyping(true);
    }, 5000);

    const timer5 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: '3',
          type: 'assistant',
          content: t('detect.confirm'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowActions(true);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [t]);

  const handleConfirm = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '4',
        type: 'user',
        content: t('detect.correct'),
        timestamp: new Date(),
      },
    ]);
    
    setTimeout(() => {
      navigate('/setup');
    }, 500);
  };

  const handleReject = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '4',
        type: 'user',
        content: t('detect.not.mine'),
        timestamp: new Date(),
      },
    ]);
    
    // Simulate retry - in real app, would search again
    setTimeout(() => {
      navigate('/error');
    }, 500);
  };

  return (
    <ChatLayout>
      <SkipButton onSkip={() => navigate('/success')} />
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {showDevice && (
              <div className="my-4">
                <DeviceCard device={mockDevice} />
              </div>
            )}
            
            {isTyping && <TypingIndicator />}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-3 mt-8">
            <ActionCard
              icon={CheckCircle}
              title={t('detect.correct')}
              onClick={handleConfirm}
              variant="primary"
            />
            <ActionCard
              icon={XCircle}
              title={t('detect.not.mine')}
              onClick={handleReject}
              variant="outline"
            />
          </div>
        )}
      </div>
    </ChatLayout>
  );
}