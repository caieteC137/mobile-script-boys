// screens/AboutScreen.js
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

const AboutScreen = ({ navigation }) => {
  // Lista de integrantes
  const integrantes = [
    'Caio Ribeiro de Oliveira',
    'Daniel Machado Nogueira',
    'Luiz Henrique Machado',
    'Gabriel Wan Dall Parra',
  ];

  // Tenta carregar a logo, se não existir usa null
  let logoSource = null;
  try {
    logoSource = require('../assets/script-boys-logo.png');
  } catch (e) {
    console.log('Logo não encontrada, usando placeholder');
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
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoCard}>
          <View style={styles.logoContainer}>
            {logoSource ? (
              <Image 
                source={logoSource} 
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="people" size={80} color="#8B6F47" />
              </View>
            )}
          </View>
          <Text style={styles.teamName}>SCRIPT BOYS</Text>
          <Text style={styles.teamSubtitle}>ENG. SOFTWARE</Text>
        </View>

        {/* App Info Card */}
        <View style={styles.card}>
          <Text style={styles.appName}>Museu Na Mão</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre o Projeto</Text>
          <Text style={styles.description}>
            Este aplicativo foi desenvolvido como trabalho acadêmico para a matéria de{' '}
            <Text style={styles.highlight}>MOBILE</Text>.
          </Text>
          <Text style={styles.description}>
            O objetivo é proporcionar uma experiência completa para descobrir e explorar museus,
            facilitando o acesso a informações sobre exposições, localizações e muito mais.
          </Text>
        </View>

        {/* Team Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Equipe de Desenvolvimento</Text>
          <Text style={styles.teamDescription}>
            Este projeto foi desenvolvido pelos seguintes integrantes:
          </Text>
          
          <View style={styles.teamList}>
            {integrantes.map((integrante, index) => (
              <View key={index} style={styles.teamMember}>
                <Ionicons name="person-circle" size={24} color="#8B6F47" />
                <Text style={styles.teamMemberName}>{integrante}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Technologies Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <Ionicons name="logo-react" size={20} color="#8B6F47" />
              <Text style={styles.techText}>React Native</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="logo-javascript" size={20} color="#8B6F47" />
              <Text style={styles.techText}>JavaScript</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="map" size={20} color="#8B6F47" />
              <Text style={styles.techText}>Google Maps API</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="globe" size={20} color="#8B6F47" />
              <Text style={styles.techText}>ExpoGO</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Museu Na Mão</Text>
          <Text style={styles.footerText}>Trabalho Acadêmico - Disciplina MOBILE</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  logoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    width: 200,
    height: 200,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
    borderRadius: 12,
  },
  teamName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: fonts.playfairBold,
    letterSpacing: 2,
  },
  teamSubtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: fonts.montserratRegular,
    letterSpacing: 1,
  },
  card: {
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B6F47',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fonts.playfairBold,
  },
  appVersion: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: fonts.montserratRegular,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 12,
    fontFamily: fonts.playfairSemiBold,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 12,
    fontFamily: fonts.montserratRegular,
  },
  highlight: {
    fontWeight: '700',
    color: '#8B6F47',
    fontFamily: fonts.montserratSemiBold,
  },
  teamDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontFamily: fonts.montserratRegular,
  },
  teamList: {
    marginTop: 8,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  teamMemberName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontFamily: fonts.montserratRegular,
  },
  techList: {
    marginTop: 8,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  techText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontFamily: fonts.montserratRegular,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
    fontFamily: fonts.montserratRegular,
  },
});

export default AboutScreen;

