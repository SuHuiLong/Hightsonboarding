import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { Wifi } from 'lucide-react';

export interface Message {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { isRTL, t } = useLanguage();
  const { config } = useWhiteLabel();
  const isAssistant = message.type === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${
        isAssistant ? '' : 'justify-end'
      }`}
      role="article"
      aria-label={isAssistant ? t('a11y.message.assistant') : t('a11y.message.user')}
    >
      {isAssistant && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600"
          style={{
            background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
          }}
          aria-hidden="true"
        >
          <Wifi className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            : 'bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 text-white'
        }`}
        style={
          !isAssistant
            ? {
                background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
              }
            : undefined
        }
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>

      {!isAssistant && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-300 dark:bg-gray-700"
          aria-hidden="true"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">U</span>
        </div>
      )}
    </motion.div>
  );
}
