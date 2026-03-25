import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { Wifi, Globe, Network, CheckCircle } from 'lucide-react';

type WANType = 'dhcp' | 'pppoe' | 'static';

export function GatewayWANConfigPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedWAN, setSelectedWAN] = useState<WANType>('dhcp');
  const [showForm, setShowForm] = useState(false);
  
  // PPPoE form
  const [pppoeUsername, setPppoeUsername] = useState('');
  const [pppoePassword, setPppoePassword] = useState('');
  
  // Static IP form
  const [staticIP, setStaticIP] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [gateway, setGateway] = useState('');
  const [dns1, setDns1] = useState('');
  const [dns2, setDns2] = useState('');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: t('gateway.wan.message'),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setShowOptions(true);
    }, 1000);

    return () => clearTimeout(timer1);
  }, [t]);

  const handleSelectWAN = (type: WANType) => {
    setSelectedWAN(type);
    if (type === 'dhcp') {
      // DHCP doesn't need additional config
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  };

  const handleContinue = () => {
    // Store WAN config (you can add to context or pass via navigation state)
    const wanConfig = {
      type: selectedWAN,
      ...(selectedWAN === 'pppoe' && {
        username: pppoeUsername,
        password: pppoePassword,
      }),
      ...(selectedWAN === 'static' && {
        ip: staticIP,
        subnet: subnetMask,
        gateway: gateway,
        dns1: dns1,
        dns2: dns2,
      }),
    };
    
    console.log('WAN Config:', wanConfig);
    navigate('/gateway/step2');
  };

  const isFormValid = () => {
    if (selectedWAN === 'dhcp') return true;
    if (selectedWAN === 'pppoe') return pppoeUsername && pppoePassword;
    if (selectedWAN === 'static') return staticIP && subnetMask && gateway && dns1;
    return false;
  };

  const wanOptions = [
    {
      type: 'dhcp' as WANType,
      icon: Wifi,
      title: t('gateway.wan.dhcp.title'),
      description: t('gateway.wan.dhcp.desc'),
      recommended: true,
    },
    {
      type: 'pppoe' as WANType,
      icon: Globe,
      title: t('gateway.wan.pppoe.title'),
      description: t('gateway.wan.pppoe.desc'),
      recommended: false,
    },
    {
      type: 'static' as WANType,
      icon: Network,
      title: t('gateway.wan.static.title'),
      description: t('gateway.wan.static.desc'),
      recommended: false,
    },
  ];

  return (
    <ChatLayout>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col py-8">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('gateway.wan.title')}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 pb-32">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}

            {/* WAN Type Options */}
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {wanOptions.map((option) => (
                  <motion.button
                    key={option.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectWAN(option.type)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedWAN === option.type
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedWAN === option.type
                            ? 'bg-blue-500'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <option.icon
                          className={`w-5 h-5 ${
                            selectedWAN === option.type
                              ? 'text-white'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {option.title}
                          </h3>
                          {option.recommended && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                              {t('gateway.wan.recommended')}
                            </span>
                          )}
                          {selectedWAN === option.type && (
                            <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* PPPoE Form */}
            <AnimatePresence>
              {showForm && selectedWAN === 'pppoe' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 space-y-4"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {t('gateway.wan.pppoe.config')}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.pppoe.username')}
                    </label>
                    <input
                      type="text"
                      value={pppoeUsername}
                      onChange={(e) => setPppoeUsername(e.target.value)}
                      placeholder={t('gateway.wan.pppoe.username.placeholder')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.pppoe.password')}
                    </label>
                    <input
                      type="password"
                      value={pppoePassword}
                      onChange={(e) => setPppoePassword(e.target.value)}
                      placeholder={t('gateway.wan.pppoe.password.placeholder')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static IP Form */}
            <AnimatePresence>
              {showForm && selectedWAN === 'static' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 space-y-4"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {t('gateway.wan.static.config')}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.static.ip')}
                    </label>
                    <input
                      type="text"
                      value={staticIP}
                      onChange={(e) => setStaticIP(e.target.value)}
                      placeholder="192.168.1.100"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.static.subnet')}
                    </label>
                    <input
                      type="text"
                      value={subnetMask}
                      onChange={(e) => setSubnetMask(e.target.value)}
                      placeholder="255.255.255.0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.static.gateway')}
                    </label>
                    <input
                      type="text"
                      value={gateway}
                      onChange={(e) => setGateway(e.target.value)}
                      placeholder="192.168.1.1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.static.dns1')}
                    </label>
                    <input
                      type="text"
                      value={dns1}
                      onChange={(e) => setDns1(e.target.value)}
                      placeholder="8.8.8.8"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gateway.wan.static.dns2')} ({t('gateway.wan.optional')})
                    </label>
                    <input
                      type="text"
                      value={dns2}
                      onChange={(e) => setDns2(e.target.value)}
                      placeholder="8.8.4.4"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Continue Button */}
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-gray-950 dark:via-gray-950 to-transparent"
          >
            <div className="max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                disabled={!isFormValid()}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('continue')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </ChatLayout>
  );
}
