# Gateway Wi-Fi App - Mobile Onboarding Experience

A high-fidelity mobile onboarding experience for the Gateway Wi-Fi app with AI chat-based interface, multi-language support, RTL, WCAG 2.1 accessibility, and white-label customization.

## Features

### 1. AI Chat-Based Interface
- Modern chat-style layout inspired by ChatGPT
- Conversational UI with natural dialogue flow
- Typing indicators with animated dots
- Smooth message animations using Motion (Framer Motion)
- Assistant and user message bubbles with distinct styling

### 2. Onboarding Flows

#### Login Flow (`/`)
- Entry point for the application
- Catch-all fallback also routes here

#### Welcome Flow (`/welcome`)
- Greeting message from AI assistant
- Call-to-action to begin setup
- Smooth transitions between steps

#### Gateway Provisioning Flow (new)

| Route | Page | Description |
|---|---|---|
| `/gateway/step1` | GatewayStep1Page | Initial gateway setup step |
| `/gateway/qrscan` | GatewayQRScanPage | QR code scanning for device identification |
| `/gateway/ocr` | GatewayOCRCapturePage | OCR capture of device label info |
| `/gateway/wanpush` | GatewayWANPushPage | Push WAN configuration to device |
| `/gateway/wifi-personalize` | GatewayWiFiPersonalizePage | Customize Wi-Fi SSID and password |
| `/gateway/apply` | GatewayApplyPage | Apply and commit configuration |
| `/gateway/success` | GatewaySuccessPage | Success confirmation |

Legacy gateway routes (kept for compatibility):

| Route | Page |
|---|---|
| `/gateway/wanconfig` | GatewayWANConfigPage |
| `/gateway/step2` | GatewayStep2Page |

#### Extender Onboarding Flow

| Route | Page | Description |
|---|---|---|
| `/extender` / `/extender/poweron` | ExtenderPowerOnPage | Power on the extender device |
| `/extender/gatewayselection` | GatewaySelectionPage | Select the parent gateway |
| `/extender/step1` | ExtenderStep1Page | Pairing step 1 |
| `/extender/step2` | ExtenderStep2Page | Pairing step 2 |
| `/extender/step3` | ExtenderStep3Page | Pairing step 3 |
| `/extender/room` | ExtenderRoomPage | Assign extender to a room |
| `/extender/wifi` | ExtenderWiFiPage | Wi-Fi configuration |
| `/extender/connecting` | ExtenderConnectingPage | Connection progress |
| `/extender/success` | ExtenderSuccessPage | Success confirmation |

#### Legacy Flows (kept for compatibility)

| Route | Description |
|---|---|
| `/detect` | Device detection with Wi-Fi scanner simulation |
| `/setup` | Multi-step setup progress with status updates |
| `/success` | Generic success screen |
| `/error` | Error recovery with retry/manual/support options |
| `/settings` | White-label branding settings |

### 3. Multi-Language Support (i18n)
- **English (en)**: Default language
- **Spanish (es)**: Full translation
- **Hebrew (he)**: Full translation with RTL support
- Language selector in header
- Persistent language preference (localStorage)
- Dynamic content switching without page reload

### 4. RTL Support (Right-to-Left)
- Full RTL layout for Hebrew
- Automatic text direction switching
- RTL-aware flexbox layouts
- Mirrored UI elements (icons, spacing)
- CSS logical properties
- `dir` attribute on document root

### 5. Light & Dark Mode
- Theme toggle in header
- Smooth transitions between themes
- Persistent theme preference (localStorage)
- System-aware color schemes
- Optimized contrast ratios
- CSS custom properties for theming

### 6. White-Label Customization
- Brand name customization
- Primary and secondary color theming
- Color preset themes (Indigo, Emerald, Rose, Amber)
- Custom color picker
- Live preview of changes
- Persistent branding (localStorage)
- CSS variables for dynamic theming
- Settings page at `/settings`

### 7. WCAG 2.1 Accessibility

#### Level AA Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus visible indicators
- Screen reader announcements
- Sufficient color contrast
- Descriptive alt text
- Skip links and landmarks

#### Specific Implementations
- `role="article"` for chat messages
- `aria-live` regions for dynamic content
- `aria-label` on interactive elements
- Focus management between screens
- High-contrast mode support
- Reduced motion support via `prefers-reduced-motion`

## Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **React Router 7**: Routing
- **Motion (Framer Motion)**: Animations
- **Tailwind CSS v4**: Styling
- **shadcn/ui + Radix UI**: Accessible component primitives
- **MUI (Material UI v7)**: Additional UI components
- **Lucide React**: Icons
- **Vite 6**: Build tool
- **react-hook-form**: Form state management
- **Recharts**: Data visualization
- **Sonner**: Toast notifications

## Key Files

```
/src/app/
├── contexts/
│   ├── ThemeContext.tsx            # Dark/light mode
│   ├── LanguageContext.tsx         # i18n & RTL
│   └── WhiteLabelContext.tsx       # Branding
├── components/
│   ├── ChatLayout.tsx              # Main chat layout
│   ├── ChatMessage.tsx             # Message bubbles
│   ├── TypingIndicator.tsx         # Typing animation
│   ├── ActionCard.tsx              # Interactive cards
│   ├── DeviceCard.tsx              # Device info
│   ├── SetupProgress.tsx           # Progress indicator
│   ├── TopBar.tsx                  # App top bar
│   ├── SkipButton.tsx              # Skip step button
│   ├── DemoInfoBanner.tsx          # Demo mode banner
│   └── ui/                         # shadcn/ui components
├── pages/
│   ├── LoginPage.tsx               # Login / entry point
│   ├── WelcomePage.tsx             # Welcome flow
│   ├── DetectPage.tsx              # Device detection (legacy)
│   ├── SetupPage.tsx               # Setup progress (legacy)
│   ├── SuccessPage.tsx             # Success screen (legacy)
│   ├── ErrorPage.tsx               # Error recovery (legacy)
│   ├── SettingsPage.tsx            # White-label settings
│   ├── gateway/
│   │   ├── GatewayStep1Page.tsx
│   │   ├── GatewayQRScanPage.tsx
│   │   ├── GatewayOCRCapturePage.tsx
│   │   ├── GatewayWANPushPage.tsx
│   │   ├── GatewayWiFiPersonalizePage.tsx
│   │   ├── GatewayApplyPage.tsx
│   │   ├── GatewayWANConfigPage.tsx # legacy
│   │   ├── GatewayStep2Page.tsx     # legacy
│   │   └── GatewaySuccessPage.tsx
│   └── extender/
│       ├── ExtenderPowerOnPage.tsx
│       ├── GatewaySelectionPage.tsx
│       ├── ExtenderStep1Page.tsx
│       ├── ExtenderStep2Page.tsx
│       ├── ExtenderStep3Page.tsx
│       ├── ExtenderRoomPage.tsx
│       ├── ExtenderWiFiPage.tsx
│       ├── ExtenderConnectingPage.tsx
│       └── ExtenderSuccessPage.tsx
├── routes.tsx                       # Route configuration
└── App.tsx                          # Root component
```

## Getting Started

The app is ready to run:

```bash
# Install dependencies
npm install
# or
pnpm install

# Start dev server
npm run dev

# Production build
npm run build
```

Then open your browser and explore:
- `/` — Login screen
- `/welcome` — Welcome flow
- `/gateway/qrscan` — New gateway provisioning flow
- `/extender` — Extender onboarding flow
- `/settings` — White-label branding settings

## Notes

- All preferences persist in localStorage
- Simulated delays make the chat feel natural
- Animations respect user's motion preferences (`prefers-reduced-motion`)
- Mobile-optimized for touch interactions
- Production-ready code structure
- Fully typed with TypeScript
- Modular and maintainable architecture
- Legacy routes (`/detect`, `/setup`, `/success`, `/error`) are retained for backward compatibility

---

**Built with accessibility, internationalization, and user experience in mind.**
