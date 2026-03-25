import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { LucideIcon } from 'lucide-react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';

interface ActionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  disabled?: boolean;
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  variant = 'primary',
  disabled = false,
}: ActionCardProps) {
  const { isRTL } = useLanguage();
  const { config } = useWhiteLabel();

  const variants = {
    primary: `bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 text-white hover:shadow-lg`,
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
    outline: 'border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-indigo-500 dark:hover:border-indigo-400',
    accent: 'bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 text-white hover:shadow-lg shadow-orange-500/30',
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl p-4 ${variants[variant]} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={
        variant === 'primary'
          ? {
              background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
            }
          : undefined
      }
    >
      <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <div className="font-medium">{title}</div>
          {description && (
            <div
              className={`text-sm mt-1 ${
                variant === 'primary' || variant === 'accent'
                  ? 'text-white/80'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}