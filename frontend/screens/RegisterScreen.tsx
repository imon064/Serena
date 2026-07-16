import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { GoogleButton } from '../components/GoogleButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';

interface Props {
  onGoToLogin: () => void;
}

export const RegisterScreen: React.FC<Props> = ({ onGoToLogin }) => {
  const { signUpWithPassword, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = 'Full name is required';
    if (!email) next.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    setFormError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { needsEmailConfirmation } = await signUpWithPassword(
        email,
        password,
        fullName.trim()
      );
      if (needsEmailConfirmation) {
        Alert.alert(
          'Almost there!',
          'Check your email to confirm your address, then sign in.'
        );
        onGoToLogin();
      }
      // If confirmation is disabled, the auth listener moves to Home automatically.
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setFormError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Google sign-up failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Start your journey to a healthier and happier mind.
        </Text>

        <View style={styles.card}>
          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
          />
          <AppInput
            label="Email Address"
            placeholder="email@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <AppInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />
          <AppInput
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <AppButton
            label="Create Account"
            onPress={handleRegister}
            loading={loading}
          />

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          <GoogleButton
            onPress={handleGoogle}
            loading={googleLoading}
            label="Sign up with Google"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onGoToLogin}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 24, paddingTop: 64, flexGrow: 1, justifyContent: 'center' },
  content: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.slate500,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.slate100,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  errorBox: { backgroundColor: colors.redBg, borderRadius: 14, padding: 12 },
  errorText: { color: colors.red, fontSize: 13, fontWeight: '500' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { fontSize: 11, fontWeight: '700', color: colors.slate400 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: colors.slate500, fontSize: 14 },
  link: { color: colors.brand, fontSize: 14, fontWeight: '700' },
});
