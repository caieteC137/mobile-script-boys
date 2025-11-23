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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { fonts } from '../utils/fonts';
import { 
  getCurrentUser, 
  clearCurrentUser, 
  updateUserProfileImage 
} from '../services/userStorage';

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

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      // Inicializa a imagem de perfil a partir do usuário armazenado (se houver)
      setProfileImage(currentUser?.profileImage || null);
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
            await clearCurrentUser();
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await updateUserProfileImage(user.id, uri);
      Alert.alert("Foto atualizada com sucesso");
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
      setProfileImage(uri);
      await updateUserProfileImage(user.id, uri);
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
          <TouchableOpacity style={styles.editPhotoButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'usuario@exemplo.com'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
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

