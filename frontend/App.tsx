import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { MainScreen } from './screens/MainScreen';
import { colors } from './lib/theme';

LogBox.ignoreLogs([
  'WebCrypto API is not supported',
  'Code challenge method will default to use plain instead of sha256',
]);

// On web, center the phone-style app in a 480px column with a dark backdrop
// (matches the in-app screens' design). The landing page is NOT wrapped in this
// — it stays full-width and responsive like a real web marketing page.
const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.rootWrapper}>
    <View style={styles.appContainer}>{children}</View>
  </View>
);

const Root: React.FC = () => {
  const { session, loading } = useAuth();
  const [screen, setScreen] = useState<'landing' | 'login' | 'register'>(
    'landing'
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  // Signed in -> the main tabbed app (Home / AI Chat / Journal / Profile).
  if (session) {
    return (
      <PhoneFrame>
        <MainScreen />
      </PhoneFrame>
    );
  }

  // Signed out -> full-width landing first, then Login/Register in the frame.
  if (screen === 'landing') {
    return (
      <LandingScreen
        onGetStarted={() => setScreen('register')}
        onSignIn={() => setScreen('login')}
      />
    );
  }

  return (
    <PhoneFrame>
      {screen === 'login' ? (
        <LoginScreen onGoToRegister={() => setScreen('register')} />
      ) : (
        <RegisterScreen onGoToLogin={() => setScreen('login')} />
      )}
    </PhoneFrame>
  );
};

// On web, pull Fredoka + Nunito from Google Fonts and wait until the weights we
// use are actually ready, so text measurements (like the circled word) are
// correct. On native we render immediately and fall back to the system font.
function useWebFonts(): boolean {
  const [ready, setReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = document;
    if (!doc.getElementById('serena-google-fonts')) {
      const link = doc.createElement('link');
      link.id = 'serena-google-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;600;700;800&display=swap';
      doc.head.appendChild(link);
    }

    const fontSet = (doc as unknown as { fonts?: FontFaceSet }).fonts;
    const done = () => setReady(true);
    if (fontSet?.load) {
      Promise.all([
        fontSet.load('700 16px Fredoka'),
        fontSet.load('600 16px Fredoka'),
        fontSet.load('500 16px Nunito'),
        fontSet.load('700 16px Nunito'),
      ])
        .then(done)
        .catch(done);
    }
    // Fallback so we never get stuck if the font network is slow.
    const t = setTimeout(done, 2500);
    return () => clearTimeout(t);
  }, []);

  return ready;
}

export default function App() {
  const fontsReady = useWebFonts();

  if (!fontsReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <StatusBar style="dark" />
        <AuthProvider>
          <Root />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: '#121212',
    ...(Platform.OS === 'web' ? { alignItems: 'center' } : {}),
  },
  appContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    width: '100%',
    ...(Platform.OS === 'web' ? { maxWidth: 480 } : {}),
  },
  flex: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
