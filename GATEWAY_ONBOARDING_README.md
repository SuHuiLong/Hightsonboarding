# Gateway Wi-Fi App - Mobile Onboarding Experience

A high-fidelity mobile onboarding experience for the Gateway Wi-Fi app with AI chat-based interface, multi-language support, RTL, WCAG 2.1 accessibility, and white-label customization.

## 🎯 Features

### 1. **AI Chat-Based Interface**
- Modern chat-style layout inspired by ChatGPT
- Conversational UI with natural dialogue flow
- Typing indicators with animated dots
- Smooth message animations using Motion (Framer Motion)
- Assistant and user message bubbles with distinct styling

### 2. **Onboarding Flows**

#### **Welcome Flow** (`/`)
- Greeting message from AI assistant
- Call-to-action to begin setup
- Smooth transitions between steps

#### **Device Detection Flow** (`/detect`)
- Simulated Wi-Fi router scanning
- Device card with model, signal strength, and status
- Confirmation/rejection actions
- Progressive disclosure pattern

#### **Setup Flow** (`/setup`)
- Multi-step progress indicator
- Real-time status updates (connecting, configuring, securing, finalizing)
- Visual feedback with animated checkmarks
- Automatic navigation to success screen

#### **Success Flow** (`/success`)
- Celebration animation with checkmark
- Network statistics (name, devices, signal strength)
- Call-to-action to dashboard
- Staggered animations for visual polish

#### **Error Recovery Flow** (`/error`)
- Clear error messaging
- List of possible causes
- Multiple recovery options:
  - Retry setup
  - Manual setup
  - Contact support
- Accessible error presentation

### 3. **Multi-Language Support (i18n)**
- **English (en)**: Default language
- **Spanish (es)**: Full translation
- **Hebrew (he)**: Full translation with RTL support
- Language selector in header
- Persistent language preference (localStorage)
- Dynamic content switching without page reload

### 4. **RTL Support (Right-to-Left)**
- Full RTL layout for Hebrew
- Automatic text direction switching
- RTL-aware flexbox layouts
- Mirrored UI elements (icons, spacing)
- CSS logical properties
- `dir` attribute on document root

### 5. **Light & Dark Mode**
- Theme toggle in header
- Smooth transitions between themes
- Persistent theme preference (localStorage)
- System-aware color schemes
- Optimized contrast ratios
- CSS custom properties for theming

### 6. **White-Label Customization**
- Brand name customization
- Primary and secondary color theming
- Color preset themes (Indigo, Emerald, Rose, Amber)
- Custom color picker
- Live preview of changes
- Persistent branding (localStorage)
- CSS variables for dynamic theming
- Settings page at `/settings`

### 7. **WCAG 2.1 Accessibility**

#### **Level AA Compliance**
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus visible indicators
- Screen reader announcements
- Sufficient color contrast
- Descriptive alt text
- Skip links and landmarks

#### **Specific Implementations**
- `role="article"` for chat messages
- `aria-label` for interactive elements
- `aria-live="polite"` for typing indicator
- `role="progressbar"` for setup progress
- Keyboard-accessible controls
- Focus management
- Reduced motion support (respects user preferences)

### 8. **Responsive Design**
- Mobile-first approach
- Optimized for screen sizes 320px - 768px
- Touch-friendly tap targets (min 44x44px)
- Safe area insets for notched devices
- Viewport optimizations
- Smooth scrolling
- Gesture-friendly interactions

## 🏗️ Architecture

### **Context Providers**

#### **ThemeContext** (`/src/app/contexts/ThemeContext.tsx`)
- Manages light/dark mode
- Persists theme preference
- Updates document class

#### **LanguageContext** (`/src/app/contexts/LanguageContext.tsx`)
- Manages language selection
- Provides translation function `t(key)`
- Handles RTL detection
- Updates document `dir` and `lang` attributes

#### **WhiteLabelContext** (`/src/app/contexts/WhiteLabelContext.tsx`)
- Manages branding configuration
- Updates CSS custom properties
- Persists configuration

### **Components**

#### **ChatLayout** (`/src/app/components/ChatLayout.tsx`)
- Main layout wrapper
- Fixed header with branding
- Settings, language, and theme controls
- Responsive container

#### **ChatMessage** (`/src/app/components/ChatMessage.tsx`)
- Assistant and user message bubbles
- Fade-in animations
- Dynamic gradient backgrounds
- RTL-aware layout

#### **TypingIndicator** (`/src/app/components/TypingIndicator.tsx`)
- Animated dots
- Screen reader announcements
- Smooth enter/exit animations

#### **ActionCard** (`/src/app/components/ActionCard.tsx`)
- Interactive button cards
- Three variants: primary, secondary, outline
- Icon support
- Hover and tap feedback

#### **DeviceCard** (`/src/app/components/DeviceCard.tsx`)
- Wi-Fi device information
- Signal strength indicator
- Status badge
- RTL-aware layout

#### **SetupProgress** (`/src/app/components/SetupProgress.tsx`)
- Multi-step progress indicator
- Status icons (pending, active, complete)
- Animated transitions
- Accessible progress announcements

### **Pages**

- **WelcomePage**: Initial greeting and onboarding start
- **DetectPage**: Device detection and confirmation
- **SetupPage**: Network configuration progress
- **SuccessPage**: Completion celebration
- **ErrorPage**: Error recovery options
- **SettingsPage**: White-label customization

### **Routing**
- React Router v7 (Data Mode)
- Client-side navigation
- Route-based code splitting
- Not found fallback

## 🎨 Design System

### **Colors**
- **Primary**: Indigo (#6366f1)
- **Secondary**: Violet (#8b5cf6)
- **Accent**: Cyan (#06b6d4)
- **Success**: Green/Emerald
- **Error**: Orange/Red
- **Customizable via white-label settings**

### **Typography**
- System font stack
- Responsive font sizes
- Medium font weight for emphasis
- Optimized line heights

### **Spacing**
- Consistent padding and margins
- 4px base unit
- Mobile-optimized touch targets

### **Animations**
- Motion (Framer Motion) for components
- Spring physics for natural feel
- Staggered animations
- Respect `prefers-reduced-motion`

## 🧪 Testing Flows

### **Happy Path**
1. Start at `/` (Welcome)
2. Click "Let's go!"
3. Device detected at `/detect`
4. Confirm device
5. Setup progress at `/setup`
6. Success screen at `/success`

### **Error Path**
1. Start at `/` (Welcome)
2. Click "Let's go!"
3. Device detected at `/detect`
4. Click "That's not mine"
5. Error screen at `/error`
6. Choose recovery option

### **Direct Error Demo**
- Click "Demo: View error recovery flow" on welcome page
- Navigate directly to error screen

### **Language Testing**
1. Click globe icon in header
2. Select language (English, Español, עברית)
3. Observe instant translation
4. Hebrew: Notice RTL layout

### **Theme Testing**
1. Click moon/sun icon in header
2. Toggle between light and dark mode
3. Observe smooth transition

### **White-Label Testing**
1. Click settings icon in header
2. Navigate to `/settings`
3. Change brand name
4. Select color preset or use custom colors
5. Click "Save & Apply"
6. Return to onboarding to see changes

## 📱 Mobile Optimization

- Viewport meta tag for proper scaling
- Touch-optimized interactions
- Swipe-friendly animations
- Safe area insets for iOS
- Hardware-accelerated animations
- Optimized bundle size
- Fast initial load

## ♿ Accessibility Features

- High contrast mode support
- Screen reader compatibility
- Keyboard navigation
- Focus indicators
- ARIA landmarks
- Live regions for dynamic content
- Semantic HTML
- Skip links
- Alternative text
- Color-independent information

## 🌍 Internationalization

### **Translation Keys**
All strings use translation keys (e.g., `t('welcome.message')`)

### **Adding New Languages**
1. Open `/src/app/contexts/LanguageContext.tsx`
2. Add language code to `Language` type
3. Add translations to `translations` object
4. Add language to selector in `ChatLayout`
5. Update `isRTL` logic if RTL language

## 🎨 White-Label Customization

### **Via UI** (Recommended)
1. Navigate to `/settings`
2. Modify brand name
3. Select or customize colors
4. Preview changes
5. Save and apply

### **Via Code**
Update default values in `/src/app/contexts/WhiteLabelContext.tsx`:

```typescript
const defaultConfig: WhiteLabelConfig = {
  brandName: 'YourBrand',
  primaryColor: '#yourcolor',
  secondaryColor: '#yourcolor',
  accentColor: '#yourcolor',
};
```

## 🔧 Technical Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **React Router 7**: Routing
- **Motion (Framer Motion)**: Animations
- **Tailwind CSS v4**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool

## 📦 Key Files

```
/src/app/
├── contexts/
│   ├── ThemeContext.tsx        # Dark/light mode
│   ├── LanguageContext.tsx     # i18n & RTL
│   └── WhiteLabelContext.tsx   # Branding
├── components/
│   ├── ChatLayout.tsx          # Main layout
│   ├── ChatMessage.tsx         # Message bubbles
│   ├── TypingIndicator.tsx     # Typing animation
│   ├── ActionCard.tsx          # Interactive cards
│   ├── DeviceCard.tsx          # Device info
│   └── SetupProgress.tsx       # Progress indicator
├── pages/
│   ├── WelcomePage.tsx         # Welcome flow
│   ├── DetectPage.tsx          # Device detection
│   ├── SetupPage.tsx           # Setup progress
│   ├── SuccessPage.tsx         # Success screen
│   ├── ErrorPage.tsx           # Error recovery
│   └── SettingsPage.tsx        # White-label settings
├── routes.tsx                  # Route configuration
└── App.tsx                     # Root component
```

## 🚀 Getting Started

The app is ready to run! Simply:
1. Start the development server
2. Open your browser
3. Explore the onboarding flows
4. Test different languages
5. Toggle dark mode
6. Customize branding in settings

## 📝 Notes

- All preferences persist in localStorage
- Simulated delays make the chat feel natural
- Animations respect user's motion preferences
- Mobile-optimized for touch interactions
- Production-ready code structure
- Fully typed with TypeScript
- Modular and maintainable architecture

---

**Built with accessibility, internationalization, and user experience in mind.**
