import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { QrCode, Wifi, CheckCircle, ScanLine } from 'lucide-react';

type ScanPhase = 'scanning' | 'detected' | 'connecting' | 'connected';

export function GatewayQRScanPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [phase, setPhase] = useState<ScanPhase>('scanning');

  useEffect(() => {
    // Step 1: Show initial message
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.qr.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    // Step 2: QR detected
    const timer2 = setTimeout(() => {
      setPhase('detected');
      setMessages((prev) => [
        ...prev,
        {
          id: '2',
          type: 'assistant',
          content: t('gateway.qr.detected'),
          timestamp: new Date(),
        },
      ]);
    }, 4000);

    // Step 3: Connecting to provisioning Wi-Fi
    const timer3 = setTimeout(() => {
      setPhase('connecting');
      setMessages((prev) => [
        ...prev,
        {
          id: '3',
          type: 'assistant',
          content: t('gateway.qr.connecting'),
          timestamp: new Date(),
        },
      ]);
    }, 5500);

    // Step 4: Connected
    const timer4 = setTimeout(() => {
      setPhase('connected');
      setMessages((prev) => [
        ...prev,
        {
          id: '4',
          type: 'assistant',
          content: t('gateway.qr.connected'),
          timestamp: new Date(),
        },
      ]);
    }, 7500);

    // Step 5: Navigate to WAN Config
    const timer5 = setTimeout(() => {
      navigate('/gateway/wanconfig');
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [t, navigate]);

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.qr.title')}
            </h1>
          </div>

          {/* QR Scanner Viewfinder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mx-auto w-64 h-64 mb-8"
          >
            {/* Scanner background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* QR Code icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {phase === 'scanning' && (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <QrCode className="w-20 h-20 text-white/40" />
                    </motion.div>
                  )}
                  {(phase === 'detected' || phase === 'connecting') && (
                    <motion.div
                      key="detected"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    >
                      <QrCode className="w-20 h-20 text-blue-400" />
                    </motion.div>
                  )}
                  {phase === 'connected' && (
                    <motion.div
                      key="connected"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <CheckCircle className="w-16 h-16 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        {t('gateway.qr.connected.label')}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scanning line animation */}
              {phase === 'scanning' && (
                <motion.div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                  initial={{ top: '15%' }}
                  animate={{ top: ['15%', '85%', '15%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>

            {/* Corner brackets */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(
              (pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-8 h-8`}
                  style={{
                    borderColor: phase === 'connected' ? '#4ade80' : phase === 'detected' ? '#60a5fa' : '#818cf8',
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderRadius: i === 0 ? '12px 0 0 0' : i === 1 ? '0 12px 0 0' : i === 2 ? '0 0 0 12px' : '0 0 12px 0',
                    borderRight: pos.includes('left') ? 'none' : undefined,
                    borderLeft: pos.includes('right') ? 'none' : undefined,
                    borderBottom: pos.includes('top') ? 'none' : undefined,
                    borderTop: pos.includes('bottom') ? 'none' : undefined,
                    transition: 'border-color 0.3s',
                  }}
                />
              )
            )}
          </motion.div>

          {/* Wi-Fi connecting animation */}
          <AnimatePresence>
            {phase === 'connecting' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Wifi className="w-5 h-5 text-blue-500" />
                </motion.div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {t('gateway.qr.connecting.label')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
