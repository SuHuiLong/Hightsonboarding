import { Moon, Sun, Globe, Settings, Wifi } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { useNavigate } from 'react-router';

interface TopBarProps {
  showLogo?: boolean;
  showSettings?: boolean;
}

export function TopBar({ showLogo = true, showSettings = true }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const { config } = useWhiteLabel();
  const navigate = useNavigate();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'he', name: 'עברית' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Brand - or empty spacer */}
        {showLogo ? (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.secondaryColor})`,
              }}
              aria-hidden="true"
            >
              <Wifi className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              {config.brandName}
            </h1>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Controls - Always on the right */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Language Selector */}
          <div className="relative group">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Select language"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className={`absolute top-full mt-1 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                    language === lang.code
                      ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Settings Button */}
          {showSettings && (
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}