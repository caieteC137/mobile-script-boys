// screens/AddMuseumScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import ButtonPrimary from '../components/ButtonPrimary';
import { addCustomMuseum } from '../services/customMuseumsStorage';
import { fetchMuseumDataFromWikipedia } from '../services/wikipediaService';
import { fonts } from '../utils/fonts';

const AddMuseumScreen = ({ navigation }) => {
  const [wikipediaUrl, setWikipediaUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const isValidWikipediaUrl = (url) => {
    if (!url.trim()) return false;
    const pattern = /wikipedia\.org\/wiki\//i;
    return pattern.test(url);
  };

  const handleFetchData = async () => {
    if (!wikipediaUrl.trim()) {
      setError('Por favor, insira a URL do Wikipedia');
      return;
    }

    if (!isValidWikipediaUrl(wikipediaUrl)) {
      setError('URL inválida. Use uma URL do Wikipedia (ex: https://pt.wikipedia.org/wiki/Nome_do_Museu)');
      return;
    }

    setError('');
    setLoadingData(true);

    try {
      // Busca os dados do Wikipedia
      const museumData = await fetchMuseumDataFromWikipedia(wikipediaUrl);
      
      // Se chegou aqui, os dados foram encontrados
      // Agora salva o museu
      await handleSubmit(museumData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError(error.message || 'Não foi possível buscar os dados do Wikipedia. Verifique se a URL está correta.');
      setLoadingData(false);
    }
  };

  const handleSubmit = async (museumData = null) => {
    if (!museumData) {
      // Se não foi passado, tenta buscar novamente
      return handleFetchData();
    }

    setLoading(true);

    try {
      await addCustomMuseum(museumData);

      Alert.alert(
        'Sucesso!',
        'Museu adicionado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao adicionar museu:', error);
      Alert.alert(
        'Erro', 
        error.message || 'Não foi possível adicionar o museu. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
      setLoadingData(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#8B6F47" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Museu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#8B6F47" />
            <Text style={styles.infoText}>
              Cole a URL do artigo do Wikipedia do museu que deseja adicionar. 
              O app buscará automaticamente todas as informações disponíveis.
            </Text>
          </View>

          <InputField
            label="URL do Wikipedia *"
            placeholder="https://pt.wikipedia.org/wiki/Nome_do_Museu"
            value={wikipediaUrl}
            onChangeText={(text) => {
              setWikipediaUrl(text);
              setError('');
            }}
            error={error}
            keyboardType="url"
            autoCapitalize="none"
          />

          {loadingData && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B6F47" />
              <Text style={styles.loadingText}>Buscando dados do Wikipedia...</Text>
            </View>
          )}

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Exemplo de URL:</Text>
            <Text style={styles.exampleText}>
              https://pt.wikipedia.org/wiki/Museu_de_Arte_de_São_Paulo
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <ButtonPrimary
              title={loadingData ? "Buscando..." : "Adicionar Museu"}
              onPress={handleFetchData}
              loading={loading || loadingData}
              disabled={loading || loadingData || !wikipediaUrl.trim()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#8B6F47',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: fonts.montserratRegular,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8B6F47',
    fontFamily: fonts.montserratMedium,
  },
  exampleContainer: {
    backgroundColor: '#F9F6F2',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 8,
    fontFamily: fonts.montserratSemiBold,
  },
  exampleText: {
    fontSize: 13,
    color: '#666',
    fontFamily: fonts.montserratRegular,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddMuseumScreen;
