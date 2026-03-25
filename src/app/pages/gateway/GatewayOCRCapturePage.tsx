import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { ActionCard } from '../../components/ActionCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { Camera, FileText, Eye, CheckCircle, Edit3, ScanLine } from 'lucide-react';

type OCRPhase = 'prompt' | 'scanning' | 'extracting' | 'review';

interface ExtractedCredentials {
  wanType: 'pppoe' | 'dhcp' | 'static';
  username?: string;
  password?: string;
}

export function GatewayOCRCapturePage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<OCRPhase>('scanning');
  const [credentials, setCredentials] = useState<ExtractedCredentials>({
    wanType: 'pppoe',
    username: 'user@isp.com',
    password: '••••••••',
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUsername, setEditUsername] = useState('user@isp.com');
  const [editPassword, setEditPassword] = useState('mypassword123');

  useEffect(() => {
    const timer3 = setTimeout(() => {
      setPhase('extracting');
      setMessages((prev) => [
        ...prev,
        {
          id: '3',
          type: 'assistant',
          content: t('gateway.ocr.extracting'),
          timestamp: new Date(),
        },
      ]);
    }, 2500);

    const timer4 = setTimeout(() => {
      setPhase('review');
      setMessages((prev) => [
        ...prev,
        {
          id: '4',
          type: 'assistant',
          content: t('gateway.ocr.extracted'),
          timestamp: new Date(),
        },
      ]);
    }, 4500);

    return () => {
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [t]);

  const handleStartCapture = () => {
    setPhase('scanning');
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: t('gateway.ocr.capture.start'),
        timestamp: new Date(),
      },
    ]);

    // Simulate scanning
    setTimeout(() => {
      setPhase('extracting');
      setMessages((prev) => [
        ...prev,
        {
          id: '3',
          type: 'assistant',
          content: t('gateway.ocr.extracting'),
          timestamp: new Date(),
        },
      ]);
    }, 2500);

    // Show extracted results
    setTimeout(() => {
      setPhase('review');
      setMessages((prev) => [
        ...prev,
        {
          id: '4',
          type: 'assistant',
          content: t('gateway.ocr.extracted'),
          timestamp: new Date(),
        },
      ]);
    }, 4500);
  };

  const handleSkipOCR = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: 'skip',
        type: 'user',
        content: t('gateway.ocr.skip'),
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => {
      navigate('/gateway/wanconfig');
    }, 500);
  };

  const handleConfirm = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: '5',
        type: 'user',
        content: t('gateway.ocr.confirm'),
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => {
      navigate('/gateway/location');
    }, 500);
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    setCredentials({
      wanType: 'pppoe',
      username: editUsername,
      password: '••••••••',
    });
    setShowEditForm(false);
  };

  // Simulated detected text fields for OCR visual
  const detectedFields = [
    { label: 'Account', value: 'user@isp.com', delay: 0 },
    { label: 'Password', value: '••••••••', delay: 0.2 },
    { label: 'Type', value: 'PPPoE', delay: 0.4 },
  ];

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.ocr.title')}
            </h1>
          </div>

          {/* OCR Viewfinder / Document Scanner */}
          <AnimatePresence mode="wait">
            {(phase === 'scanning' || phase === 'extracting') && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative mx-auto w-full max-w-sm h-64 mb-8 rounded-2xl overflow-hidden"
              >
                {/* Document background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
                  {/* Simulated document content lines */}
                  <div className="absolute inset-0 p-6 space-y-3">
                    <div className="h-3 bg-gray-300/40 dark:bg-gray-600/40 rounded w-2/3" />
                    <div className="h-3 bg-gray-300/40 dark:bg-gray-600/40 rounded w-full" />
                    <div className="h-3 bg-gray-300/40 dark:bg-gray-600/40 rounded w-4/5" />
                    <div className="h-4 mt-4" />
                    {/* Highlighted extracted fields */}
                    {phase === 'extracting' &&
                      detectedFields.map((field, i) => (
                        <motion.div
                          key={field.label}
                          initial={{ opacity: 0, backgroundColor: 'rgba(59, 130, 246, 0)' }}
                          animate={{
                            opacity: 1,
                            backgroundColor: ['rgba(59, 130, 246, 0)', 'rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.1)'],
                          }}
                          transition={{ delay: field.delay, duration: 0.8 }}
                          className="flex items-center gap-2 px-2 py-1 rounded"
                        >
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-16">
                            {field.label}:
                          </span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: field.delay + 0.3 }}
                            className="text-sm font-semibold text-blue-700 dark:text-blue-300"
                          >
                            {field.value}
                          </motion.span>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: field.delay + 0.6, type: 'spring' }}
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          </motion.div>
                        </motion.div>
                      ))}
                  </div>

                  {/* Scanning line */}
                  {phase === 'scanning' && (
                    <motion.div
                      className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      initial={{ top: '10%' }}
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>

                {/* Corner brackets */}
                {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(
                  (pos, i) => (
                    <div
                      key={i}
                      className={`absolute ${pos} w-6 h-6`}
                      style={{
                        borderColor: phase === 'extracting' ? '#22c55e' : '#3b82f6',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderRadius: i === 0 ? '8px 0 0 0' : i === 1 ? '0 8px 0 0' : i === 2 ? '0 0 0 8px' : '0 0 8px 0',
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
            )}
          </AnimatePresence>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Extracted Credentials Review Card */}
            {phase === 'review' && !showEditForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800"
              >
                <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {t('gateway.ocr.review.title')}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('gateway.ocr.review.type')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      PPPoE
                    </span>
                  </div>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('gateway.ocr.review.username')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {credentials.username}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('gateway.ocr.review.password')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {credentials.password}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-green-500/20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {t('gateway.ocr.review.confirm')}
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      {t('gateway.ocr.review.edit')}
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Edit Form */}
            {showEditForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800 space-y-4"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t('gateway.ocr.edit.title')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('gateway.ocr.review.username')}
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('gateway.ocr.review.password')}
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEdit}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg"
                >
                  {t('gateway.ocr.edit.save')}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action Buttons — prompt phase */}
        {phase === 'prompt' && !isTyping && (
          <div className="space-y-3 mt-8">
            <ActionCard
              icon={Camera}
              title={t('gateway.ocr.capture.button')}
              description={t('gateway.ocr.capture.desc')}
              onClick={handleStartCapture}
              variant="primary"
            />
            <ActionCard
              icon={Edit3}
              title={t('gateway.ocr.skip')}
              description={t('gateway.ocr.skip.desc')}
              onClick={handleSkipOCR}
              variant="secondary"
            />
          </div>
        )}
      </div>
    </ChatLayout>
  );
}
