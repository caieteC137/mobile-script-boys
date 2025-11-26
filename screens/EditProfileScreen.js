// screens/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { fonts } from '../utils/fonts';
import { getUsuarioById, updateUsuario, getUsuarioByEmail } from '../database/iniciarDatabase';

const CURRENT_USER_KEY = '@current_user';

const EditProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!userJson) {
        Alert.alert('Erro', 'Usuário não encontrado');
        navigation.goBack();
        return;
      }

      const currentUser = JSON.parse(userJson);
      const dbUser = getUsuarioById(currentUser.id);

      if (dbUser) {
        setUser(dbUser);
        setName(dbUser.nome);
        setEmail(dbUser.email);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError('Nome deve ter pelo menos 3 caracteres');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido');
      isValid = false;
    }

    // Se está tentando mudar a senha
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setCurrentPasswordError('Digite a senha atual para alterá-la');
        isValid = false;
      } else if (currentPassword !== user.password) {
        setCurrentPasswordError('Senha atual incorreta');
        isValid = false;
      }

      if (!newPassword) {
        setNewPasswordError('Digite a nova senha');
        isValid = false;
      } else if (newPassword.length < 6) {
        setNewPasswordError('Nova senha deve ter pelo menos 6 caracteres');
        isValid = false;
      }

      if (!confirmPassword) {
        setConfirmPasswordError('Confirme a nova senha');
        isValid = false;
      } else if (newPassword !== confirmPassword) {
        setConfirmPasswordError('As senhas não coincidem');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }

    setSaving(true);
    try {
      const emailLower = email.toLowerCase().trim();

      // Verificar se o email já existe (e não é o email atual)
      if (emailLower !== user.email.toLowerCase()) {
        const existingUser = getUsuarioByEmail(emailLower);
        if (existingUser && existingUser._id !== user._id) {
          Alert.alert('Erro', 'Este e-mail já está sendo usado');
          setSaving(false);
          return;
        }
      }

      // Preparar dados para atualização
      const updateData = {
        nome: name.trim(),
        email: emailLower,
      };

      // Se está mudando a senha, incluir
      if (newPassword) {
        updateData.password = newPassword;
      }

      // Atualizar no banco
      const result = updateUsuario(user._id, updateData);

      if (!result.success) {
        Alert.alert('Erro', 'Não foi possível salvar as alterações');
        setSaving(false);
        return;
      }

      // Buscar usuário atualizado
      const updatedDbUser = getUsuarioById(user._id);

      // Atualizar AsyncStorage
      const updatedUser = {
        id: updatedDbUser._id,
        name: updatedDbUser.nome,
        email: updatedDbUser.email,
        profileImage: updatedDbUser.profileImage,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8B6F47" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#8B6F47" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            <InputField
              label="Nome Completo"
              placeholder="Digite seu nome"
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
              autoCapitalize="none"
              error={emailError}
            />
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            <Text style={styles.sectionDescription}>
              Deixe em branco se não quiser alterar a senha
            </Text>

            <InputField
              label="Senha Atual"
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              error={currentPasswordError}
            />

            <InputField
              label="Nova Senha"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              error={newPasswordError}
            />

            <InputField
              label="Confirmar Nova Senha"
              placeholder="Digite a nova senha novamente"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
            />
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <ButtonPrimary
              title="Salvar Alterações"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
            />
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: fonts.playfairSemiBold,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 8,
    fontFamily: fonts.playfairSemiBold,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: fonts.montserratRegular,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default EditProfileScreen;