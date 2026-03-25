import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { X } from 'lucide-react';

interface SkipButtonProps {
  onSkip: () => void;
}

export function SkipButton({ onSkip }: SkipButtonProps) {
  const { t } = useLanguage();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={onSkip}
      className="fixed top-20 right-4 z-20 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
      aria-label={t('skip')}
    >
      <span>{t('skip')}</span>
      <X className="w-4 h-4" aria-hidden="true" />
    </motion.button>
  );
}
