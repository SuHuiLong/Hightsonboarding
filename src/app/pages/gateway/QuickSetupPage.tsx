import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChatLayout } from '../../components/ChatLayout';
import { ChatMessage, Message } from '../../components/ChatMessage';
import { TypingIndicator } from '../../components/TypingIndicator';
import { SetupProgress } from '../../components/SetupProgress';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { useGateway } from '../../contexts/GatewayContext';
import {
  Zap, Eye, EyeOff, Shield, ShieldCheck, ShieldAlert, Wifi,
  Router, Signal, Bluetooth, Keyboard, ChevronDown, ChevronUp,
  RefreshCw, CheckCircle, Loader2, AlertCircle, MapPin, Lock
} from 'lucide-react';

type Phase = 'choose' | 'gw-ready' | 'ext-gateway' | 'ext-device' | 'running' | 'done';
type DeviceType = 'gateway' | 'extender';
type EntryMode = 'bt' | 'manual';
type PasswordStrength = 'weak' | 'medium' | 'strong';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

interface ScannedDevice {
  id: string;
  serialNumber: string;
  model: string;
  signalStrength: number;
}

const RANDOM_LOCATIONS = ['Home', 'Office', 'Living Room', 'Bedroom', 'Kitchen', 'Study'];

function genLocation() {
  return RANDOM_LOCATIONS[Math.floor(Math.random() * RANDOM_LOCATIONS.length)];
}

function genSSID(loc: string) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${loc.replace(/\s+/g, '')}-${suffix}`;
}

function genPassword() {
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$';
  const all = upper + lower + digits + symbols;
  const required = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  const rest = Array.from({ length: 8 }, () => all[Math.floor(Math.random() * all.length)]);
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
}

const MOCK_DEVICES: ScannedDevice[] = [
  { id: '1', serialNumber: 'EXT-2024-A1B2-C3D4', model: 'Heights Extender Pro', signalStrength: 87 },
  { id: '2', serialNumber: 'EXT-2024-E5F6-G7H8', model: 'Heights Extender Lite', signalStrength: 72 },
];

export function QuickSetupPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { setMainLocation } = useLocation();
  const { gateways, addGateway, setSelectedGateway } = useGateway();

  const [phase, setPhase] = useState<Phase>('choose');
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);

  // Editable values (pre-filled with auto-generated defaults)
  const [autoLocation, setAutoLocation] = useState('');
  const [autoSSID, setAutoSSID] = useState('');
  const [autoPassword, setAutoPassword] = useState('');
  const [showAdvPassword, setShowAdvPassword] = useState(false);

  // Extender: gateway selection
  const [selectedGatewayId, setSelectedGatewayId] = useState('');

  // Extender: device entry
  const [entryMode, setEntryMode] = useState<EntryMode>('bt');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [manualSerial, setManualSerial] = useState('');
  const [manualModel, setManualModel] = useState('');

  // Running phase
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const hasStarted = useRef(false);

  const effectiveLocation = autoLocation;
  const effectiveSSID = autoSSID;
  const effectivePassword = autoPassword;

  const initAutoValues = () => {
    const loc = genLocation();
    const s = genSSID(loc);
    const p = genPassword();
    setAutoLocation(loc);
    setAutoSSID(s);
    setAutoPassword(p);
  };

  const handleChooseGateway = () => {
    setDeviceType('gateway');
    initAutoValues();
    setPhase('gw-ready');
  };

  const handleChooseExtender = () => {
    setDeviceType('extender');
    setPhase('ext-gateway');
  };

  const handleSelectGateway = (id: string) => {
    setSelectedGatewayId(id);
    const gw = gateways.find((g) => g.id === id);
    if (gw) setSelectedGateway(gw);
  };

  const handleExtGatewayContinue = () => {
    initAutoValues();
    setEntryMode('bt');
    setScannedDevices([]);
    setScanComplete(false);
    setSelectedDeviceId('');
    setPhase('ext-device');
  };

  const startBTScan = () => {
    setIsScanning(true);
    setScannedDevices([]);
    setScanComplete(false);
    setSelectedDeviceId('');
    setTimeout(() => setScannedDevices([MOCK_DEVICES[0]]), 1800);
    setTimeout(() => {
      setScannedDevices(MOCK_DEVICES);
      setIsScanning(false);
      setScanComplete(true);
    }, 3200);
  };

  useEffect(() => {
    if (phase === 'ext-device' && entryMode === 'bt') {
      startBTScan();
    }
  }, [phase]);

  const switchToManual = () => {
    setEntryMode('manual');
    setIsScanning(false);
  };

  const switchToBT = () => {
    setEntryMode('bt');
    startBTScan();
  };

  const extDeviceReady = entryMode === 'bt'
    ? !!selectedDeviceId
    : manualSerial.trim().length > 0 && manualModel.trim().length > 0;

  const addMessage = (id: string, content: string) => {
    setMessages((prev) => [...prev, { id, type: 'assistant', content, timestamp: new Date() }]);
  };

  const runAutomation = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    setMainLocation(effectiveLocation);
    setIsTyping(true);

    const gwSteps: Step[] = [
      { id: '1', label: t('quick.step.qr'), status: 'pending' },
      { id: '2', label: t('quick.step.wan'), status: 'pending' },
      { id: '3', label: t('quick.step.wifi'), status: 'pending' },
      { id: '4', label: t('quick.step.apply'), status: 'pending' },
    ];
    const extSteps: Step[] = [
      { id: '1', label: t('quick.step.bt'), status: 'pending' },
      { id: '2', label: t('quick.step.link'), status: 'pending' },
      { id: '3', label: t('quick.step.wifi'), status: 'pending' },
      { id: '4', label: t('quick.step.apply'), status: 'pending' },
    ];
    const initialSteps = deviceType === 'gateway' ? gwSteps : extSteps;
    setSteps(initialSteps);

    const activate = (index: number) => {
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i < index ? 'complete' : i === index ? 'active' : 'pending',
        }))
      );
    };
    const complete = (index: number) => {
      setSteps((prev) =>
        prev.map((s, i) => ({ ...s, status: i <= index ? 'complete' : 'pending' }))
      );
    };

    setTimeout(() => { setIsTyping(false); addMessage('m1', t('quick.running.start')); }, 800);

    if (deviceType === 'gateway') {
      setTimeout(() => activate(0), 1400);
      setTimeout(() => { complete(0); addMessage('m2', t('quick.running.qr')); }, 3000);
      setTimeout(() => activate(1), 3400);
      setTimeout(() => { complete(1); addMessage('m3', t('quick.running.wan')); }, 5200);
      setTimeout(() => activate(2), 5600);
      setTimeout(() => { complete(2); addMessage('m4', t('quick.running.wifi').replace('{ssid}', effectiveSSID)); }, 7400);
      setTimeout(() => activate(3), 7800);
      setTimeout(() => {
        complete(3);
        addGateway({
          id: `gw-${Date.now()}`,
          name: effectiveSSID,
          location: effectiveLocation,
          setupSSID: effectiveSSID,
          status: 'online',
          createdAt: new Date(),
        });
        setPhase('done');
      }, 9800);
    } else {
      setTimeout(() => activate(0), 1400);
      setTimeout(() => { complete(0); addMessage('m2', t('quick.running.bt')); }, 3000);
      setTimeout(() => activate(1), 3400);
      setTimeout(() => { complete(1); addMessage('m3', t('quick.running.link')); }, 5200);
      setTimeout(() => activate(2), 5600);
      setTimeout(() => { complete(2); addMessage('m4', t('quick.running.extender.wifi')); }, 7400);
      setTimeout(() => activate(3), 7800);
      setTimeout(() => { complete(3); setPhase('done'); }, 9800);
    }
  };

  useEffect(() => {
    if (phase === 'running') runAutomation();
  }, [phase]);

  const handleRepair = () => {
    hasStarted.current = false;
    setMessages([]);
    setSteps([]);
    setIsTyping(false);
    setPhase('running');
  };

  const handleRepeatExtender = () => {
    hasStarted.current = false;
    setMessages([]);
    setSteps([]);
    setIsTyping(false);
    setManualSerial('');
    setManualModel('');
    setSelectedDeviceId('');
    setScannedDevices([]);
    setScanComplete(false);
    setEntryMode('bt');
    initAutoValues();
    setPhase('ext-device');
  };

  const handleFinish = () => {
    navigate(deviceType === 'gateway' ? '/gateway/success' : '/extender/success');
  };

  const getPasswordStrength = (pw: string): PasswordStrength => {
    if (pw.length < 8) return 'weak';
    const score = [
      /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[!@#$%^&*]/.test(pw),
    ].filter(Boolean).length;
    return score >= 3 && pw.length >= 12 ? 'strong' : 'medium';
  };

  return (
    <ChatLayout>
      <div className={`min-h-[calc(100vh-5rem)] flex flex-col py-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Zap className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('quick.title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('quick.subtitle')}</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── CHOOSE ── */}
          {phase === 'choose' && (
            <motion.div key="choose"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              <p className={`text-sm font-medium text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('quick.choose.title')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleChooseGateway}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Router className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{t('quick.choose.gateway')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('quick.choose.gateway.desc')}</p>
                  </div>
                </motion.button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleChooseExtender}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Signal className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{t('quick.choose.extender')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('quick.choose.extender.desc')}</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── GATEWAY READY ── */}
          {phase === 'gw-ready' && (
            <motion.div key="gw-ready"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              <p className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('quick.auto.desc')}
              </p>

              {/* Editable fields pre-filled with auto-generated values */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type="text" value={autoLocation} onChange={(e) => setAutoLocation(e.target.value)}
                    placeholder={t('quick.form.location.placeholder')}
                    className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500">
                  <Wifi className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type="text" value={autoSSID} onChange={(e) => setAutoSSID(e.target.value)}
                    placeholder={t('quick.form.ssid.placeholder')}
                    className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type={showAdvPassword ? 'text' : 'password'} value={autoPassword} onChange={(e) => setAutoPassword(e.target.value)}
                    placeholder={t('quick.form.password.placeholder')}
                    className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  <button type="button" onClick={() => setShowAdvPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    {showAdvPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('running')}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-5 h-5" />
                {t('quick.start')}
              </motion.button>
            </motion.div>
          )}

          {/* ── EXT GATEWAY ── */}
          {phase === 'ext-gateway' && (
            <motion.div key="ext-gateway"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <p className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('quick.extender.select')}
              </p>
              {gateways.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <AlertCircle className="w-12 h-12 text-amber-400" />
                  <p className="text-gray-500 dark:text-gray-400">{t('quick.extender.nogateways')}</p>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/welcome')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
                  >
                    {t('quick.extender.add.gateway')}
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {gateways.map((gw) => (
                      <motion.button key={gw.id} whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectGateway(gw.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selectedGatewayId === gw.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                          <Router className="w-5 h-5 text-white" />
                        </div>
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{gw.name}</p>
                          <p className="text-xs text-gray-500">{gw.location}</p>
                        </div>
                        {selectedGatewayId === gw.id && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                      </motion.button>
                    ))}
                  </div>
                  {selectedGatewayId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleExtGatewayContinue}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                    >
                      {t('continue')}
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── EXT DEVICE ── */}
          {phase === 'ext-device' && (
            <motion.div key="ext-device"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Mode tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button onClick={switchToBT}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    entryMode === 'bt' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bluetooth className="w-4 h-4" />{t('quick.extender.bt.tab')}
                </button>
                <button onClick={switchToManual}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    entryMode === 'manual' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Keyboard className="w-4 h-4" />{t('quick.extender.manual.tab')}
                </button>
              </div>

              {entryMode === 'bt' && (
                <div className="space-y-3">
                  {(isScanning || scannedDevices.length === 0) && (
                    <div className="flex items-center gap-3 py-6 justify-center text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-sm">{t('quick.extender.bt.scanning')}</span>
                    </div>
                  )}
                  {scannedDevices.map((dev) => (
                    <motion.button key={dev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDeviceId(dev.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        selectedDeviceId === dev.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                      } ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                        <Bluetooth className="w-5 h-5 text-white" />
                      </div>
                      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{dev.model}</p>
                        <p className="text-xs text-gray-500">{dev.serialNumber}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Signal className="w-3 h-3" />{dev.signalStrength}%
                      </div>
                      {selectedDeviceId === dev.id && <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />}
                    </motion.button>
                  ))}
                </div>
              )}

              {entryMode === 'manual' && (
                <div className="space-y-3">
                  <input type="text" value={manualSerial} onChange={(e) => setManualSerial(e.target.value)}
                    placeholder={t('quick.extender.manual.serial.placeholder')}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  <input type="text" value={manualModel} onChange={(e) => setManualModel(e.target.value)}
                    placeholder={t('quick.extender.manual.model.placeholder')}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              )}

              {/* Editable location & Wi-Fi info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-purple-500">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type="text" value={autoLocation} onChange={(e) => setAutoLocation(e.target.value)}
                    placeholder={t('quick.form.location.placeholder')}
                    className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-purple-500">
                  <Wifi className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type="text" value={autoSSID} onChange={(e) => setAutoSSID(e.target.value)}
                    placeholder={t('quick.form.ssid.placeholder')}
                    className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-purple-500">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type={showAdvPassword ? 'text' : 'password'} value={autoPassword} onChange={(e) => setAutoPassword(e.target.value)}
                    placeholder={t('quick.form.password.placeholder')}
                    className={`flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  <button type="button" onClick={() => setShowAdvPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    {showAdvPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {extDeviceReady && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('running')}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  {t('quick.start')}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── RUNNING ── */}
          {(phase === 'running' || phase === 'done') && (
            <motion.div key="running"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {steps.length > 0 && <SetupProgress steps={steps} />}
              <div className="space-y-3">
                {isTyping && <TypingIndicator />}
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>

              {phase === 'done' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      {deviceType === 'gateway' ? t('quick.done.message.gateway') : t('quick.done.message.extender')}
                    </p>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleFinish}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30 transition-all"
                  >
                    {t('quick.done.finish')}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleRepair}
                    className="w-full py-3 px-6 rounded-xl border-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 font-medium flex items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('quick.done.repair')}
                  </motion.button>
                  {deviceType === 'extender' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleRepeatExtender}
                      className="w-full py-3 px-6 rounded-xl border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 font-medium flex items-center justify-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      {t('quick.done.repeat.extender')}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChatLayout>
  );
}
