import { motion } from 'motion/react';
import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function DemoInfoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { isRTL } = useLanguage();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
    >
      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo Features:</strong> Try the language selector (🌐), theme toggle (🌙/☀️), 
            and white-label settings (⚙️) in the header. This app supports English, Spanish, and Hebrew (with RTL).
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
