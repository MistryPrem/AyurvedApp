/**
 * Amrutam Ayurvedic Super App Root Component
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { AppStateProvider } from './src/context/AppStateContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { DoctorProvider } from './src/context/DoctorContext';
import { SplashScreen } from './src/screens/common/SplashScreen';

function Main() {
  const { mode } = useTheme();
  const [isSplashLoading, setIsSplashLoading] = React.useState(true);

  if (isSplashLoading) {
    return <SplashScreen onFinish={() => setIsSplashLoading(false)} />;
  }

  return (
    <>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              <NetworkProvider>
                <AppStateProvider>
                  <AuthProvider>
                    <DoctorProvider>
                      <Main />
                    </DoctorProvider>
                  </AuthProvider>
                </AppStateProvider>
              </NetworkProvider>
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
