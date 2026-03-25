import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChatLayout } from '../components/ChatLayout';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Palette } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const { config, updateConfig } = useWhiteLabel();
  const { isRTL } = useLanguage();
  const [brandName, setBrandName] = useState(config.brandName);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor);

  const presetThemes = [
    {
      name: 'Indigo',
      primary: '#6366f1',
      secondary: '#8b5cf6',
    },
    {
      name: 'Emerald',
      primary: '#10b981',
      secondary: '#14b8a6',
    },
    {
      name: 'Rose',
      primary: '#f43f5e',
      secondary: '#ec4899',
    },
    {
      name: 'Amber',
      primary: '#f59e0b',
      secondary: '#f97316',
    },
  ];

  const handleSave = () => {
    updateConfig({
      brandName,
      primaryColor,
      secondaryColor,
    });
    navigate('/');
  };

  return (
    <ChatLayout showSettings={false}>
      <div className="min-h-[calc(100vh-5rem)] py-8">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 ${
            isRTL ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Palette className="w-6 h-6 text-gray-900 dark:text-gray-100" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              White-Label Settings
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize the branding and colors for your app
          </p>
        </div>

        <div className="space-y-6">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Color Presets
            </label>
            <div className="grid grid-cols-2 gap-3">
              {presetThemes.map((theme) => (
                <motion.button
                  key={theme.name}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPrimaryColor(theme.primary);
                    setSecondaryColor(theme.secondary);
                  }}
                  className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{
                        background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})`,
                      }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {theme.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Preview
            </label>
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {brandName}
                </span>
              </div>
              <div
                className="px-4 py-3 rounded-xl text-white text-sm"
                style={{
                  background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                This is how your branded messages will look!
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-4 rounded-xl text-white font-medium"
            style={{
              background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            Save & Apply
          </motion.button>
        </div>
      </div>
    </ChatLayout>
  );
}
