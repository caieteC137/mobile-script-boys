// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { validateCredentials } from '../services/authStorage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const result = await validateCredentials(email, password);
      
      if (result.success) {
        Alert.alert(
          'Success',
          result.message,
          [{ text: 'OK', style: 'default' }]
        );
        // Here you would typically navigate to the main app
        console.log('Login successful - would navigate to main app');
      } else {
        Alert.alert(
          'Login Failed',
          result.message,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    Alert.alert(
      'Register',
      'Registration feature will be implemented soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F0E8" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginCard}>
            {/* Logo Area */}
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🏛️</Text>
              </View>
              <Text style={styles.welcomeTitle}>Welcome to Museum</Text>
              <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <InputField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={emailError}
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                error={passwordError}
              />

              <ButtonPrimary
                title="Login"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                New here?{' '}
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerLink}>Register!</Text>
                </TouchableOpacity>
              </Text>
            </View>

            {/* Demo Credentials Info */}
            <View style={styles.demoInfoContainer}>
              <Text style={styles.demoInfoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoInfoText}>Email: admin@museum.com</Text>
              <Text style={styles.demoInfoText}>Password: museum123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  logoContainer: {
    backgroundColor: '#8B6F47',
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#F5F0E8',
    textAlign: 'center',
  },
  formContainer: {
    padding: 30,
  },
  registerContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8B6F47',
    textAlign: 'center',
  },
  registerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A7C59',
    textDecorationLine: 'underline',
  },
  demoInfoContainer: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#C17E3A',
  },
  demoInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 8,
  },
  demoInfoText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
    marginBottom: 2,
  },
});

export default LoginScreen;
