// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { getUsuarioByEmail } from '../database/iniciarDatabase';

const CURRENT_USER_KEY = '@current_user';

const LoginScreen = ({ route, navigation }) => {
  const { onLogin } = route.params || {};
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
      setEmailError('E-mail é obrigatório');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Insira um e-mail válido');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
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
      // Buscar usuário no banco SQLite
      const user = getUsuarioByEmail(email.toLowerCase().trim());
      
      if (!user) {
        Alert.alert(
          'Falha no login',
          'E-mail ou senha inválidos',
          [{ text: 'OK', style: 'default' }]
        );
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        Alert.alert(
          'Falha no login',
          'E-mail ou senha inválidos',
          [{ text: 'OK', style: 'default' }]
        );
        setLoading(false);
        return;
      }

      // Salvar usuário logado no AsyncStorage
      const currentUser = {
        id: user._id,
        name: user.nome,
        email: user.email,
        profileImage: user.profileImage
      };
      
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!',
        [{ 
          text: 'OK', 
          style: 'default',
          onPress: () => onLogin(currentUser)
        }]
      );
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Registration', {
      onRegister: (user) => {
        if (onLogin) {
          onLogin(user);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
        >
          <View style={styles.loginCard}>
            {/* Logo Area */}
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Image 
                  source={require('../assets/logo-museu.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.welcomeTitle}>Bem-vindo ao Museu na Mão</Text>
              <Text style={styles.welcomeSubtitle}>Faça login para continuar</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <InputField
                label="E-mail"
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={emailError}
              />

              <InputField
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                error={passwordError}
              />

              <ButtonPrimary
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />
            </View>

            {/* Register Button */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Novo por aqui?</Text>
              <ButtonPrimary
                title="Cadastre-se"
                onPress={handleRegister}
                variant="outline"
              />
            </View>

            {/* Demo Credentials Info */}
            <View style={styles.demoInfoContainer}>
              <Text style={styles.demoInfoTitle}>Credenciais de demonstração:</Text>
              <Text style={styles.demoInfoText}>E-mail: admin@museum.com</Text>
              <Text style={styles.demoInfoText}>Senha: museum123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  logoImage: {
    width: 160,
    height: 160,
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
    marginBottom: 16,
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