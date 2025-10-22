# Bundul Due Payments App

A React Native Expo application that displays a list of upcoming payments for a user's subscriptions with a modern fintech dark theme UI.

## Demo

![App Demo](./assets/Screen%20Recording%202025-10-23%20at%2000.41.36.mp4)

## Features

- Display of payment items from mock data
- Each payment shows service name, amount, due date, and "Pay Now" button
- "Due Soon" badge for payments due within 3 days with animated pulse effect
- List sorted by due date (soonest first)
- Tapping "Pay Now" opens a payment confirmation modal
- Pull-to-refresh functionality
- Highlighted rows for items due within 3 days
- Total due amount displayed at the top
- Search functionality to filter subscriptions
- Filter options: All, Due Soon, Paid (in Payments tab)
- Payment history tracking with persistent storage
- Real-time updates across tabs when payments are made
- Insights dashboard with payment visualization chart
- Modern dark theme fintech UI design with gradient accents
- Smooth card entry animations
- Consistent design system with typography, spacing, and color scales
- Responsive design optimized for mobile and tablet

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

## Submission

This project was created for the Bundul Frontend Engineer Assessment to demonstrate React Native best practices and clean UI implementation.