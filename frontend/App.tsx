import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { AuthedApp } from './screens/AuthedApp';
import { colors } from './lib/theme';

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

  // Signed in -> the journal app.
  if (session) {
    return <AuthedApp />;
  }

  // Signed out -> Landing first, then Login/Register.
  if (screen === 'landing') {
    return (
      <LandingScreen
        onGetStarted={() => setScreen('register')}
        onSignIn={() => setScreen('login')}
      />
    );
  }

  return screen === 'login' ? (
    <LoginScreen onGoToRegister={() => setScreen('register')} />
  ) : (
    <RegisterScreen onGoToLogin={() => setScreen('login')} />
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
  flex: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
