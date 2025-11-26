// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { fonts } from '../utils/fonts';
import { getUsuarioById, updateUsuario } from '../database/iniciarDatabase';

const CURRENT_USER_KEY = '@current_user';

const ProfileScreen = ({ onLogout, navigation, onNavigateToFavorites }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert("Permissão necessária", "O app precisa de acesso à galeria.");
      }

      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert("Permissão necessária", "O app precisa da câmera para tirar fotos.");
      }
    })();

    loadUserData();
  }, []);

  // Recarregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      // Buscar usuário atual do AsyncStorage
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!userJson) {
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(userJson);
      
      // Buscar dados atualizados do banco SQLite
      const dbUser = getUsuarioById(currentUser.id);
      
      if (dbUser) {
        const userData = {
          id: dbUser._id,
          name: dbUser.nome,
          email: dbUser.email,
          profileImage: dbUser.profileImage
        };
        
        setUser(userData);
        setProfileImage(dbUser.profileImage);
        
        // Atualizar AsyncStorage com dados mais recentes
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      } else {
        setUser(currentUser);
        setProfileImage(currentUser.profileImage);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Saída',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(CURRENT_USER_KEY);
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  const updateProfileImage = async (imageUri) => {
    try {
      // Atualizar no banco SQLite
      const result = updateUsuario(user.id, { profileImage: imageUri });
      
      if (!result.success) {
        Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil');
        return;
      }

      // Atualizar estado local
      setProfileImage(imageUri);

      // Atualizar AsyncStorage
      const updatedUser = { ...user, profileImage: imageUri };
      setUser(updatedUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a foto');
    }
  };

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await updateProfileImage(uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await updateProfileImage(uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        {
          text: 'Tirar Foto',
          onPress: takePicture,
        },
        {
          text: 'Escolher da Galeria',
          onPress: pickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8B6F47" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          {/* FOTO DE PERFIL */}
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#8B6F47" />
            </View>
          )}

          {/* Botão para trocar imagem */}
          <TouchableOpacity 
            style={styles.editPhotoButton} 
            onPress={showImageOptions}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'usuario@exemplo.com'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation?.navigate('EditProfile')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Editar Perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            if (onNavigateToFavorites) {
              onNavigateToFavorites();
            }
          }}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="heart-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Favoritos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation?.navigate('About')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Sobre o App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfoSection}>
        <Text style={styles.appName}>Museu Na Mão</Text>
        <Text style={styles.appVersion}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    paddingTop: 20,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8B6F47',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#8B6F47',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B6F47',
    padding: 8,
    borderRadius: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: fonts.playfairBold,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    fontFamily: fonts.montserratRegular,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontFamily: fonts.montserratRegular,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A8402E',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: fonts.montserratSemiBold,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: fonts.playfairBold,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    fontFamily: fonts.montserratRegular,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;