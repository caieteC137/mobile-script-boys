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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';  
import ButtonPrimary from '../components/ButtonPrimary';
import { addMuseu } from '../database/iniciarDatabase';
import { fonts } from '../utils/fonts';

const AddMuseumScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [rating, setRating] = useState('');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome do museu é obrigatório';
    }

    if (!localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
      newErrors.rating = 'Rating deve ser entre 0 e 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      const museuData = {
        nome: nome.trim(),
        localizacao: localizacao.trim(),
        rating: rating ? parseFloat(rating) : null,
        horarioFuncionamento: horarioFuncionamento.trim() || null,
      };

      const result = addMuseu(museuData);

      if (result.success) {
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
      } else {
        throw new Error(result.error || 'Erro ao adicionar museu');
      }
    } catch (error) {
      console.error('Erro ao adicionar museu:', error);
      Alert.alert(
        'Erro',
        'Não foi possível adicionar o museu. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
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
              Preencha os dados do museu que deseja adicionar à sua coleção.
            </Text>
          </View>

          <InputField
            label="Nome do Museu *"
            placeholder="Ex: Museu de Arte de São Paulo"
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              clearError('nome');
            }}
            error={errors.nome}
          />

          <InputField
            label="Localização *"
            placeholder="Ex: São Paulo, SP"
            value={localizacao}
            onChangeText={(text) => {
              setLocalizacao(text);
              clearError('localizacao');
            }}
            error={errors.localizacao}
          />

          <InputField
            label="Avaliação (0-5)"
            placeholder="Ex: 4.5"
            value={rating}
            onChangeText={(text) => {
              setRating(text);
              clearError('rating');
            }}
            error={errors.rating}
            keyboardType="decimal-pad"
          />

          <InputField
            label="Horário de Funcionamento"
            placeholder="Ex: 9h-18h"
            value={horarioFuncionamento}
            onChangeText={setHorarioFuncionamento}
          />

          <View style={styles.requiredNote}>
            <Text style={styles.requiredText}>* Campos obrigatórios</Text>
          </View>

          <View style={styles.buttonContainer}>
            <ButtonPrimary
              title="Adicionar Museu"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
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
  requiredNote: {
    marginTop: 8,
    marginBottom: 16,
  },
  requiredText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    fontFamily: fonts.montserratRegular,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddMuseumScreen;