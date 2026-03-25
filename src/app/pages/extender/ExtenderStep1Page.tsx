import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { ActionCard } from '../../components/ActionCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { QrCode, Keyboard, Bluetooth, Router, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ScannedDevice {
  id: string;
  serialNumber: string;
  model: string;
  signalStrength: number;
}

export function ExtenderStep1Page() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  // Start Bluetooth scan on mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.step1.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    const timer2 = setTimeout(() => {
      setShowActions(true);
      // Auto-start Bluetooth scan
      startBluetoothScan();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t]);

  const startBluetoothScan = () => {
    setIsScanning(true);
    setScannedDevices([]);
    setScanComplete(false);

    // Simulate Bluetooth scanning with progressive device discovery
    const mockDevices: ScannedDevice[] = [
      { id: '1', serialNumber: 'EXT-2024-A1B2-C3D4', model: 'Gateway Extender Pro', signalStrength: 95 },
      { id: '2', serialNumber: 'EXT-2024-E5F6-G7H8', model: 'Gateway Extender', signalStrength: 82 },
      { id: '3', serialNumber: 'EXT-2024-I9J0-K1L2', model: 'Gateway Extender Plus', signalStrength: 68 },
    ];

    // Add devices progressively
    mockDevices.forEach((device, index) => {
      setTimeout(() => {
        setScannedDevices((prev) => [...prev, device]);
      }, 1000 + index * 1200);
    });

    // Complete scan
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 4500);
  };

  const handleDeviceSelect = (device: ScannedDevice) => {
    console.log('ExtenderStep1Page - Bluetooth device selected, setting skipPowerOn: true');
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: `${t('extender.step1.selected')}: ${device.serialNumber}`,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      // Device found via Bluetooth is already powered on, skip step4
      navigate('/extender/step3', { state: { skipPowerOn: true } });
    }, 500);
  };

  const handleScanQR = () => {
    console.log('ExtenderStep1Page - QR scan selected, setting skipPowerOn: true');
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: t('extender.step1.scan'),
        timestamp: new Date(),
      },
    ]);

    // In a real app, would open camera for QR scanning
    // For demo, we'll simulate a scanned serial number
    // QR scanning also means device is powered on, skip step4
    setTimeout(() => {
      navigate('/extender/step3', { state: { skipPowerOn: true } });
    }, 500);
  };

  const handleManualEntry = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: t('extender.step1.manual'),
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      navigate('/extender/step2');
    }, 500);
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-500';
    if (strength >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getSignalBars = (strength: number) => {
    if (strength >= 80) return 3;
    if (strength >= 60) return 2;
    return 1;
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.step1.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          {/* Bluetooth Scan Results */}
          {showActions && (
            <div className="mt-8">
              {/* Scanning Header */}
              <div className="flex items-center justify-between mb-4 px-4">
                <div className="flex items-center gap-2">
                  <Bluetooth className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {t('extender.step1.bluetooth.scanning')}
                  </span>
                </div>
                {isScanning && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
              </div>

              {/* Device List */}
              {scannedDevices.length > 0 && (
                <div className="space-y-2 mb-6">
                  {scannedDevices.map((device, index) => (
                    <motion.button
                      key={device.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleDeviceSelect(device)}
                      className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg active:scale-[0.98]"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Router className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 text-left rtl:text-right">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {device.model}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {device.serialNumber}
                          </div>
                        </div>
                        <div className={`flex flex-col items-center gap-1 ${getSignalColor(device.signalStrength)}`}>
                          <div className="flex items-end gap-0.5 h-5">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                  i < getSignalBars(device.signalStrength)
                                    ? 'bg-current'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                style={{ height: `${(i + 1) * 33}%` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium">{device.signalStrength}%</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Scanning Status */}
              {isScanning && scannedDevices.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
                  <p>{t('extender.step1.bluetooth.searching')}</p>
                </div>
              )}

              {/* No Devices Found */}
              {scanComplete && scannedDevices.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Bluetooth className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t('extender.step1.bluetooth.none')}
                  </p>
                  <button
                    onClick={startBluetoothScan}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {t('extender.step1.bluetooth.rescan')}
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    {t('extender.step1.or')}
                  </span>
                </div>
              </div>

              {/* Alternative Options */}
              <div className="space-y-3">
                <ActionCard
                  icon={QrCode}
                  title={t('extender.step1.scan')}
                  onClick={handleScanQR}
                  variant="secondary"
                />
                <ActionCard
                  icon={Keyboard}
                  title={t('extender.step1.manual')}
                  onClick={handleManualEntry}
                  variant="secondary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatLayout>
  );
}