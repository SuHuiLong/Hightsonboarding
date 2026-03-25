import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

interface SetupProgressProps {
  steps: Step[];
}

export function SetupProgress({ steps }: SetupProgressProps) {
  const { isRTL, t } = useLanguage();
  const { config } = useWhiteLabel();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
      role="progressbar"
      aria-label={t('a11y.progress')}
      aria-valuenow={steps.filter((s) => s.status === 'complete').length}
      aria-valuemin={0}
      aria-valuemax={steps.length}
    >
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className="relative">
              {step.status === 'complete' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500"
                >
                  <Check className="w-4 h-4 text-white" aria-hidden="true" />
                </motion.div>
              ) : step.status === 'active' ? (
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500"
                  style={{
                    background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
                  }}
                >
                  <Loader2 className="w-4 h-4 text-white animate-spin" aria-hidden="true" />
                </motion.div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              )}
            </div>
            
            <span
              className={`text-sm flex-1 ${
                step.status === 'complete'
                  ? 'text-gray-600 dark:text-gray-400 line-through'
                  : step.status === 'active'
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-500 dark:text-gray-500'
              } ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
