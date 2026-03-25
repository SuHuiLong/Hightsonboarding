import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { WelcomePage } from './pages/WelcomePage';
import { DetectPage } from './pages/DetectPage';
import { SetupPage } from './pages/SetupPage';
import { SuccessPage } from './pages/SuccessPage';
import { ErrorPage } from './pages/ErrorPage';
import { SettingsPage } from './pages/SettingsPage';

// Gateway flow pages
import { GatewayStep1Page } from './pages/gateway/GatewayStep1Page';
import { GatewayWANConfigPage } from './pages/gateway/GatewayWANConfigPage';
import { GatewayStep2Page } from './pages/gateway/GatewayStep2Page';
import { GatewaySuccessPage } from './pages/gateway/GatewaySuccessPage';

// New provisioning flow pages
import { GatewayQRScanPage } from './pages/gateway/GatewayQRScanPage';
import { GatewayOCRCapturePage } from './pages/gateway/GatewayOCRCapturePage';
import { GatewayWANPushPage } from './pages/gateway/GatewayWANPushPage';
import { GatewayWiFiPersonalizePage } from './pages/gateway/GatewayWiFiPersonalizePage';
import { GatewayApplyPage } from './pages/gateway/GatewayApplyPage';
import { QuickSetupPage } from './pages/gateway/QuickSetupPage';

// Extender flow pages
import { GatewaySelectionPage } from './pages/extender/GatewaySelectionPage';
import { ExtenderPowerOnPage } from './pages/extender/ExtenderPowerOnPage';
import { ExtenderStep1Page } from './pages/extender/ExtenderStep1Page';
import { ExtenderStep2Page } from './pages/extender/ExtenderStep2Page';
import { ExtenderStep3Page } from './pages/extender/ExtenderStep3Page';
import { ExtenderRoomPage } from './pages/extender/ExtenderRoomPage';
import { ExtenderConnectingPage } from './pages/extender/ExtenderConnectingPage';
import { ExtenderWiFiPage } from './pages/extender/ExtenderWiFiPage';
import { ExtenderSuccessPage } from './pages/extender/ExtenderSuccessPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/welcome',
    Component: WelcomePage,
  },
  // Gateway onboarding flow
  {
    path: '/gateway/step1',
    Component: GatewayStep1Page,
  },
  // New provisioning flow
  {
    path: '/gateway/qrscan',
    Component: GatewayQRScanPage,
  },
  {
    path: '/gateway/ocr',
    Component: GatewayOCRCapturePage,
  },
  {
    path: '/gateway/wanpush',
    Component: GatewayWANPushPage,
  },
  {
    path: '/gateway/wifi-personalize',
    Component: GatewayWiFiPersonalizePage,
  },
  {
    path: '/gateway/apply',
    Component: GatewayApplyPage,
  },
  {
    path: '/gateway/quick',
    Component: QuickSetupPage,
  },
  // Legacy gateway routes (kept for compatibility)
  {
    path: '/gateway/wanconfig',
    Component: GatewayWANConfigPage,
  },
  {
    path: '/gateway/step2',
    Component: GatewayStep2Page,
  },
  {
    path: '/gateway/success',
    Component: GatewaySuccessPage,
  },
  // Extender onboarding flow
  {
    path: '/extender',
    Component: ExtenderPowerOnPage,
  },
  {
    path: '/extender/poweron',
    Component: ExtenderPowerOnPage,
  },
  {
    path: '/extender/gatewayselection',
    Component: GatewaySelectionPage,
  },
  {
    path: '/extender/step1',
    Component: ExtenderStep1Page,
  },
  {
    path: '/extender/step2',
    Component: ExtenderStep2Page,
  },
  {
    path: '/extender/step3',
    Component: ExtenderStep3Page,
  },
  {
    path: '/extender/room',
    Component: ExtenderRoomPage,
  },
  {
    path: '/extender/wifi',
    Component: ExtenderWiFiPage,
  },
  {
    path: '/extender/connecting',
    Component: ExtenderConnectingPage,
  },
  {
    path: '/extender/success',
    Component: ExtenderSuccessPage,
  },
  // Legacy routes (kept for compatibility)
  {
    path: '/detect',
    Component: DetectPage,
  },
  {
    path: '/setup',
    Component: SetupPage,
  },
  {
    path: '/success',
    Component: SuccessPage,
  },
  {
    path: '/error',
    Component: ErrorPage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
  {
    path: '*',
    Component: LoginPage,
  },
]);