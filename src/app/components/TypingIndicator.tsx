import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { Wifi } from 'lucide-react';

export function TypingIndicator() {
  const { isRTL, t } = useLanguage();
  const { config } = useWhiteLabel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      role="status"
      aria-live="polite"
      aria-label={t('a11y.typing')}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600"
        style={{
          background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
        }}
        aria-hidden="true"
      >
        <Wifi className="w-4 h-4 text-white" />
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
