// screens/RegistrationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { addUsuario, getUsuarioByEmail, getUsuarioById } from '../database/iniciarDatabase';

const CURRENT_USER_KEY = '@current_user';

const RegistrationScreen = ({ route, navigation }) => {
  const { onRegister } = route.params || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateInputs = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError('O nome deve ter pelo menos 3 caracteres');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Insira um e-mail válido');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const emailLower = email.toLowerCase().trim();

      // Check if user already exists
      const existingUser = getUsuarioByEmail(emailLower);
      if (existingUser) {
        Alert.alert(
          'Falha no cadastro',
          'Este e-mail já está cadastrado',
          [{ text: 'OK', style: 'default' }]
        );
        setLoading(false);
        return;
      }

      // Create new user in database
      const result = addUsuario({
        nome: name.trim(),
        email: emailLower,
        password: password,
        profileImage: null
      });

      if (!result.success) {
        Alert.alert(
          'Falha no cadastro',
          'Erro ao cadastrar usuário. Tente novamente.',
          [{ text: 'OK', style: 'default' }]
        );
        setLoading(false);
        return;
      }

      // Get the created user
      const newUser = getUsuarioById(result._id);

      // Set current user in AsyncStorage
      const currentUser = {
        id: newUser._id,
        name: newUser.nome,
        email: newUser.email,
        profileImage: newUser.profileImage
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      Alert.alert(
        'Sucesso',
        'Usuário cadastrado com sucesso!',
        [{ 
          text: 'OK', 
          style: 'default',
          onPress: () => {
            if (onRegister) {
              onRegister(currentUser);
            } else {
              navigation.goBack();
            }
          }
        }]
      );
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.goBack();
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
          <View style={styles.registrationCard}>
            {/* Logo Area */}
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Image 
                  source={require('../assets/logo-museu.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.welcomeTitle}>Criar Conta</Text>
              <Text style={styles.welcomeSubtitle}>Preencha os dados para se cadastrar</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <InputField
                label="Nome"
                placeholder="Digite seu nome completo"
                value={name}
                onChangeText={setName}
                error={nameError}
              />

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

              <InputField
                label="Confirmar Senha"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                error={confirmPasswordError}
              />

              <ButtonPrimary
                title="Cadastrar"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
              />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Já tem uma conta?{' '}
                <TouchableOpacity onPress={handleGoToLogin}>
                  <Text style={styles.loginLink}>Faça login!</Text>
                </TouchableOpacity>
              </Text>
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
  registrationCard: {
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
  loginContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8B6F47',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A7C59',
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;