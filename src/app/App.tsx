import { RouterProvider } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WhiteLabelProvider } from './contexts/WhiteLabelContext';
import { LocationProvider } from './contexts/LocationContext';
import { GatewayProvider } from './contexts/GatewayContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <WhiteLabelProvider>
          <LocationProvider>
            <GatewayProvider>
              <RouterProvider router={router} />
            </GatewayProvider>
          </LocationProvider>
        </WhiteLabelProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}