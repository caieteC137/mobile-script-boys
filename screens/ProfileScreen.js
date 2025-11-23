// screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../utils/fonts';

const ProfileScreen = ({ onLogout }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#8B6F47" />
          </View>
        </View>
        <Text style={styles.userName}>Usuário</Text>
        <Text style={styles.userEmail}>usuario@exemplo.com</Text>
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

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="location-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Minhas Localizações</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="heart-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Favoritos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="time-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Histórico de Visitas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Configurações</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={24} color="#8B6F47" />
            <Text style={styles.menuItemText}>Sobre o App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
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
});

export default ProfileScreen;

