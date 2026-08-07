import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export const LoginScreen: React.FC = () => {
  const { login, signUp } = useAuth();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (emailStr: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailStr);
  };

  const handleAction = () => {
    const trimmedEmail = emailInput.trim();
    if (isSignUpMode) {
      if (!fullNameInput.trim() || !trimmedEmail || !passwordInput) {
        showToast('Please fill in all fields', 'warning');
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        showToast('Please enter a valid email address', 'warning');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const success = signUp(trimmedEmail, passwordInput, fullNameInput);
        setLoading(false);
        if (success) {
          showToast('Account created successfully! Please sign in.', 'success');
          setIsSignUpMode(false);
          setFullNameInput('');
          setPasswordInput(''); // clear password for re-type
        } else {
          showToast('Email address already registered!', 'error');
        }
      }, 80);
    } else {
      if (!trimmedEmail || !passwordInput) {
        showToast('Please enter both email and password', 'warning');
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        showToast('Please enter a valid email address', 'warning');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const success = login(trimmedEmail, passwordInput);
        setLoading(false);
        if (success) {
          showToast('Login Successful!', 'success');
        } else {
          showToast('Invalid credentials. Check hint below!', 'error');
        }
      }, 80);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={[styles.title, { color: colors.primary }]}>Amrutam</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ayurvedic Super App
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {isSignUpMode ? 'Create Account' : 'Sign In'}
          </Text>

          {isSignUpMode && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="e.g. John Doe"
                placeholderTextColor={colors.textMuted}
                value={fullNameInput}
                onChangeText={setFullNameInput}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="e.g. user@amrutam.co"
              placeholderTextColor={colors.textMuted}
              value={emailInput}
              onChangeText={setEmailInput}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 },
            ]}
            onPress={handleAction}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : isSignUpMode ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleModeButton}
            onPress={() => {
              setIsSignUpMode(prev => !prev);
              setFullNameInput('');
            }}
          >
            <Text style={[styles.toggleModeText, { color: colors.primary }]}>
              {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Credentials Helper Box */}
        {!isSignUpMode && (
          <View
            style={[
              styles.helperCard,
              { backgroundColor: colors.chipBackground, borderColor: colors.primaryLight },
            ]}
          >
            <Text style={[styles.helperTitle, { color: colors.primary }]}>🔑 Demo Credentials</Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Email: <Text style={styles.boldText}>user@amrutam.co</Text> or <Text style={styles.boldText}>admin@amrutam.co</Text>
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Password: <Text style={styles.boldText}>ayurveda123</Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleModeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  helperTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  helperText: {
    fontSize: 13,
    marginVertical: 1,
  },
  boldText: {
    fontWeight: '700',
  },
});
