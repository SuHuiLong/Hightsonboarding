import { motion } from 'motion/react';
import { Wifi, Signal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Device {
  id: string;
  name: string;
  model: string;
  signal: number;
  status: 'online' | 'offline';
}

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { t, isRTL } = useLanguage();

  const getSignalStrength = (signal: number) => {
    if (signal >= 80) return { bars: 4, color: 'text-green-500' };
    if (signal >= 60) return { bars: 3, color: 'text-yellow-500' };
    if (signal >= 40) return { bars: 2, color: 'text-orange-500' };
    return { bars: 1, color: 'text-red-500' };
  };

  const signalInfo = getSignalStrength(device.signal);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 flex items-center justify-center flex-shrink-0">
          <Wifi className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{device.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('device.model')}: {device.model}
          </p>
          
          <div className={`flex items-center gap-4 mt-3 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row'}`}>
            <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <Signal className={`w-4 h-4 ${signalInfo.color}`} aria-hidden="true" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t('device.signal')}: {device.signal}%
              </span>
            </div>
            
            <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-2 h-2 rounded-full ${
                  device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}
                aria-hidden="true"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {device.status === 'online'
                  ? t('device.status.online')
                  : t('device.status.offline')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
