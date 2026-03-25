import { useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { Sofa, BedDouble, Utensils, Bath, Briefcase, Warehouse, MapPin } from 'lucide-react';

export function ExtenderRoomPage() {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { t, isRTL } = useLanguage();
  const { mainLocation, setRoomLocation } = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showMainLocation, setShowMainLocation] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRoom, setCustomRoom] = useState('');

  // Check if we should skip the power on step (from Bluetooth/QR scan)
  const skipPowerOn = routerLocation.state?.skipPowerOn || false;

  // Debug: Log the skipPowerOn value
  useEffect(() => {
    console.log('ExtenderRoomPage - skipPowerOn:', skipPowerOn);
    console.log('ExtenderRoomPage - routerLocation.state:', routerLocation.state);
  }, [skipPowerOn, routerLocation.state]);

  const roomOptions = [
    { id: 'living', icon: Sofa, label: t('extender.room.living') },
    { id: 'bedroom', icon: BedDouble, label: t('extender.room.bedroom') },
    { id: 'kitchen', icon: Utensils, label: t('extender.room.kitchen') },
    { id: 'bathroom', icon: Bath, label: t('extender.room.bathroom') },
    { id: 'office', icon: Briefcase, label: t('extender.room.office') },
    { id: 'garage', icon: Warehouse, label: t('extender.room.garage') },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('extender.room.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowMainLocation(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setShowOptions(true);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t]);

  const handleRoomSelect = (room: string) => {
    setRoomLocation(room);
    setMessages((prev) => [
      ...prev,
      {
        id: '2',
        type: 'user',
        content: room,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      // Always navigate to the merged connecting page
      navigate('/extender/wifi');
    }, 500);
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
    setShowOptions(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoom.trim()) {
      handleRoomSelect(customRoom.trim());
    }
  };

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('extender.room.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {isTyping && <TypingIndicator />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Main Location Info */}
            {showMainLocation && mainLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {t('extender.room.main.location')}
                    </p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                      {mainLocation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Room Options Grid */}
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 mt-6"
              >
                {roomOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => handleRoomSelect(option.label)}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                      {option.label}
                    </span>
                  </motion.button>
                ))}

                {/* Custom Room Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: roomOptions.length * 0.08 }}
                  onClick={handleCustomClick}
                  className="col-span-2 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('extender.room.custom')}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Custom Input */}
            {showCustomInput && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleCustomSubmit}
                className="mt-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={customRoom}
                    onChange={(e) => setCustomRoom(e.target.value)}
                    placeholder={t('extender.room.custom.placeholder')}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                    autoFocus
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button
                    type="submit"
                    disabled={!customRoom.trim()}
                    className="w-full mt-4 px-6 py-3 bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('extender.room.continue')}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}