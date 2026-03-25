import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChatLayout } from '../components/ChatLayout';
import { ChatMessage, Message } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { ActionCard } from '../components/ActionCard';
import { DemoInfoBanner } from '../components/DemoInfoBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { Router, Repeat } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    // Simulate assistant typing
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('welcome.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);

    const timer2 = setTimeout(() => {
      setShowActions(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t]);

  const handleSetupGateway = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: t('welcome.setup.gateway'),
        timestamp: new Date(),
      },
    ]);
    
    setTimeout(() => {
      navigate('/gateway/step1');
    }, 500);
  };

  const handleSetupExtender = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: t('welcome.setup.extender'),
        timestamp: new Date(),
      },
    ]);
    
    setTimeout(() => {
      navigate('/extender/gatewayselection');
    }, 500);
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8">
        <div>
          {/* Demo Info Banner */}
          <DemoInfoBanner />
          
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('welcome.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-3 mt-8">
            <ActionCard
              icon={Router}
              title={t('welcome.setup.gateway')}
              description={t('welcome.gateway.desc')}
              onClick={handleSetupGateway}
              variant="primary"
            />
            <ActionCard
              icon={Repeat}
              title={t('welcome.setup.extender')}
              description={t('welcome.extender.desc')}
              onClick={handleSetupExtender}
              variant="secondary"
            />
            <button
              onClick={() => navigate('/error')}
              className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
            >
              Demo: View error recovery flow
            </button>
          </div>
        )}
      </div>
    </ChatLayout>
  );
}