import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { MainScreen } from './screens/MainScreen';
import { colors } from './lib/theme';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'WebCrypto API is not supported',
  'Code challenge method will default to use plain instead of sha256'
]);

const Root: React.FC = () => {
  const { session, loading } = useAuth();
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  // Signed in -> Main. Signed out -> Login/Register toggle.
  if (session) {
    return <MainScreen />;
  }

  return screen === 'login' ? (
    <LoginScreen onGoToRegister={() => setScreen('register')} />
  ) : (
    <RegisterScreen onGoToLogin={() => setScreen('login')} />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.rootWrapper}>
        <SafeAreaView style={styles.appContainer} edges={['top']}>
          <StatusBar style="dark" />
          <AuthProvider>
            <Root />
          </AuthProvider>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: '#121212',
    ...(Platform.OS === 'web' ? {
      alignItems: 'center',
    } : {}),
  },
  appContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    width: '100%',
    ...(Platform.OS === 'web' ? {
      maxWidth: 480,
    } : {}),
  },
  flex: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
