# Amrutam Ayurvedic Super App

A production-ready, high-performance, offline-first React Native & TypeScript Super App. Built with extreme scalability, adaptive multi-screen responsiveness, and a beautiful Ayurvedic-inspired design system.

---

## Quick Start & Installation

Ensure you have your React Native development environment set up for Android/iOS.

### 1. Prerequisites
- **Node.js**: `>= 22.11.0`
- **npm** or **Yarn**
- **Android SDK** (for Android emulation) or **Xcode** (for iOS emulation)

### 2. Setup
Clone the repository and install dependencies:

```bash
# Install package dependencies
npm install
```

### 3. Running the App
Start the Metro bundler and run the application:

```bash
# Start Metro Bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## Technology Stack & Architecture

- **Core**: React Native (v0.86+), TypeScript, React Hooks
- **Navigation**: React Navigation (Tabs, Stacks)
- **State Management**: Context API (Micro-store architecture for optimized re-renders)
- **Styling & Theme**: Custom Ayurvedic Design System (Adaptive light/dark mode, theme tokens)

### Directory Structure

```
AyurvedicSuperApp/
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── common/             # Shared components (ErrorBoundary, Toast, OfflineBanner)
│   │   ├── consultation/       # DoctorCard memoized & responsive component
│   │   ├── shop/               # ProductCard memoized & responsive component
│   │   └── health/             # RecordCard memoized & responsive component
│   ├── context/                # Reactive App State Contexts
│   │   ├── AppStateContext.tsx # Cart, Wishlist, Bookings & Records state with local persistence
│   │   ├── ThemeContext.tsx    # Light/Dark Ayurvedic Design System Provider
│   │   ├── NetworkContext.tsx  # Online / Offline simulator context
│   │   └── ToastContext.tsx    # Global alert/toast banner provider
│   ├── data/
│   │   └── generators.ts       # Performance stress dataset generator (5k docs, 20k products, 10k records)
│   ├── navigation/
│   │   └── RootNavigator.tsx   # Ayurvedic Tab & Stack navigation container
│   ├── screens/                # Modular App Screens
│   │   ├── consultation/       # DoctorListScreen, DoctorDetailScreen, UpcomingConsultationsScreen
│   │   ├── shop/               # ProductListScreen (Responsive 2/3/4 Column Grid), ProductDetailScreen, CartScreen
│   │   ├── health/             # HealthTimelineScreen (Grouped by Month/Year)
│   │   └── settings/           # SettingsScreen (Theme, i18n English/Hindi, Feature Flags)
│   ├── services/               # Core Application Services
│   │   ├── biometrics.ts       # Biometric Authentication integration
│   │   ├── featureFlags.ts     # Feature Flags & Remote Config service
│   │   ├── i18n.ts             # Dual language (English & Hindi) localization engine
│   │   ├── logger.ts           # Production structured logging & crash reporting
│   │   ├── offlineSync.ts      # Offline action queueing & reconciliation engine
│   │   └── storage.ts          # Local persistent storage abstraction layer
│   ├── theme/                  # Design tokens, color palette, typography & spacing
│   ├── types/                  # Strict TypeScript interfaces & definitions
│   └── utils/
│   │   └── responsive.ts       # Responsive layout scaling utilities & tablet detection
├── App.tsx                     # Root App shell with Provider hierarchy
├── package.json
└── README.md
```

---

## Features & Highlights

### 1. Ayurvedic Doctor Consultation (Module 1)
- **Advanced Doctor Discovery**: Dynamic search and filters (Specialty, Experience, Rating).
- **Interactive Booking**: Dynamic slot selector with validation logic preventing double bookings.
- **Dataset Stress Test**: Handles up to **5,000 doctor profiles** smoothly.

### 2. Medicines & Wellness Shop (Module 2)
- **Adaptive Columns Grid**: Displays 2 columns on mobile, 3 on tablets, and 4 on desktop monitors/large tablets.
- **Cart & Wishlist Math**: Real-time summary computation with discounts, taxes, and shipping rates.
- **Dataset Stress Test**: Paginated lazy-loading managing up to **20,000 wellness products**.

### 3. Digital Health Locker & Records Timeline (Module 3)
- **Chronological Grouping**: Medical records beautifully organized into a timeline grouped by Month and Year.
- **Biometric Security**: Simulated fingerprint/face unlock check before displaying sensitive lab reports.
- **Dataset Stress Test**: Handles up to **10,000 medical records** with virtualized list windowing.

### 4. Production-Grade Infrastructure Features
- **Offline-First Sync**: Intercepts actions (like cart checkouts or bookings) during offline states, queues them in `OfflineSyncQueue`, and resolves them automatically when the connection is restored.
- **Localization (i18n)**: Seamless English & Hindi dual-language switcher.
- **Aesthetic Design Tokens**: Theme variables (`#004D40` Deep Emerald, `#D4AF37` Gold) supporting real-time Dark Mode switching.
- **Error Boundaries**: App-wide crash catching with structured levels in `logger.ts`.

---

## Performance Optimization details

To handle enterprise-scale datasets (5k doctors, 20k products, 10k health records) on low-end devices:
1. **Optimized FlatLists**: Utilizes `getItemLayout` for fixed-height elements, `removeClippedSubviews={true}`, and optimized batch window sizes (`maxToRenderPerBatch={10}`, `windowSize={5}`) to prevent memory leaks.
2. **Memoization Layer**: All child components use `React.memo` with customized comparative logic.
3. **Sub-Millisecond Indexing**: Searches and calculations are computed lazily and cached using `useMemo` hooks.
