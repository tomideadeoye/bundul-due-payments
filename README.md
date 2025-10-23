# Bundul Due Payments App

A React Native Expo application that displays a list of upcoming payments for a user's subscriptions with a modern fintech dark theme UI.

## Demo

https://github.com/user-attachments/assets/609a3f79-7451-4d1f-b346-ff582ce28229


## Features

Display payment items from mock data with service name, amount, due date, and "Pay Now" button
"Due Soon" badge for payments within 3 days, with pulse effect
List sorted by due date, with highlighted rows for soon payments
Tapping "Pay Now" opens confirmation modal
Pull-to-refresh and search functionality available
Filter options: All, Due Soon, Paid (in Payments tab)
Track payment history with persistent storage and real-time updates across tabs
Insights dashboard with payment visualization chart
Modern dark theme fintech UI design, with animations and a responsive layout

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (installed globally)
- Expo Go app on your mobile device (for mobile testing)

## Setup Instructions

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd bundul-due-payments
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Running the App

### Development Mode

Start the development server:
```bash
npx expo start
```

This will display a QR code that you can scan with the Expo Go app on your mobile device.

### Running on Specific Platforms

- **iOS Simulator**: `npx expo start --ios` (requires Xcode)
- **Android Emulator**: `npx expo start --android` (requires Android Studio)
- **Web Browser**: `npx expo start --web`

### Production Build

To create a production build:
```bash
npx expo build
```

## Project Structure

```
bundul-due-payments/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Payments Screen (All/Due Soon filters)
│   │   └── paid.tsx           # Payment History Screen
│   ├── _layout.tsx            # App layout configuration
│   └── modal.tsx              # Modal screen
├── components/
│   ├── CustomSplashScreen.tsx # Custom splash screen
│   ├── DueSoonBadge.tsx       # Animated badge component
│   ├── FloatingActionButton.tsx # FAB component
│   ├── Header.tsx             # Header component with search and optional filters
│   ├── InsightsCard.tsx       # Payment insights dashboard
│   ├── PaymentCard.tsx        # Payment item component
│   ├── PaymentConfirmationCard.tsx # Payment confirmation component
│   ├── SvgLogo.tsx            # SVG logo component
│   └── external-link.tsx      # External link component
├── constants/
│   ├── spacing.ts             # Spacing and border radius
│   ├── theme.ts               # Color definitions
│   └── typography.ts          # Typography scale
├── data/
│   └── payments.ts            # Mock payment data
├── hooks/
│   ├── PulseAnimationContext.tsx # Animation context
│   ├── index.ts               # Hook exports
│   └── usePulseAnimation.ts   # Pulse animation hook
├── utils/
│   ├── formatters.ts          # Date/currency formatting utilities
│   └── logoMapper.ts          # Service logo mapping utility
├── assets/
│   └── images/                # Image assets
└── package.json
```

## Key Technologies

- **React Native** - Cross-platform mobile development
- **Expo** - Framework and platform for universal React applications
- **TypeScript** - Typed superset of JavaScript
- **React Native Paper** - UI component library
- **React Native Reanimated** - Animation library
- **React Navigation** - Routing and navigation
- **AsyncStorage** - Data persistence
- **react-native-chart-kit** - Chart visualization
- **expo-linear-gradient** - Gradient UI elements
- **date-fns** - Date utility library

## Bundle Analysis

This project includes bundle analysis capabilities using Expo Atlas to help monitor and optimize the JavaScript bundle size.

### Analyzing Production Bundles

To analyze the production bundle:

```bash
npm run analyze
```

This command will:
1. Export the app for all platforms with source maps
2. Generate bundle analysis data
3. Start the Expo Atlas server at http://localhost:3000

### Development Bundle Analysis

To analyze bundles during development:

```bash
npm run analyze:dev
```

This starts the development server with Atlas enabled. You can then access the analysis through the Expo DevTools.

### Interpreting Results

The bundle analyzer will show:
- Bundle sizes for each platform (Android, iOS, Web)
- Dependency breakdown and contribution to bundle size
- Module transformation details
- Import/export relationships

Use this information to identify optimization opportunities and keep bundle sizes manageable for better app performance.
