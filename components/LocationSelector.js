// components/LocationSelector.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { states, cities, getDefaultLocation } from '../utils/brazilianCities';
import { saveLocation } from '../services/locationStorage';

const LocationSelector = ({ onLocationChange, currentLocation, iconOnly = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredStates, setFilteredStates] = useState(states);
  const [filteredCities, setFilteredCities] = useState([]);
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [step, setStep] = useState('state'); // 'state' or 'city'

  useEffect(() => {
    loadCurrentLocation();
  }, [currentLocation]);

  useEffect(() => {
    if (stateSearch.trim() === '') {
      setFilteredStates(states);
    } else {
      const filtered = states.filter(state =>
        state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
        state.code.toLowerCase().includes(stateSearch.toLowerCase())
      );
      setFilteredStates(filtered);
    }
  }, [stateSearch]);

  useEffect(() => {
    if (selectedState) {
      const stateCities = cities[selectedState.code] || [];
      if (citySearch.trim() === '') {
        setFilteredCities(stateCities);
      } else {
        const filtered = stateCities.filter(city =>
          city.name.toLowerCase().includes(citySearch.toLowerCase())
        );
        setFilteredCities(filtered);
      }
    }
  }, [selectedState, citySearch]);

  const loadCurrentLocation = () => {
    try {
      // Só carrega localização se currentLocation tiver cidade e estado definidos
      if (currentLocation && currentLocation.city && currentLocation.state) {
        const state = states.find(s => s.code === currentLocation.state);
        if (state) {
          setSelectedState(state);
          setSelectedCity({ name: currentLocation.city });
        }
      } else {
        // Limpa seleção se não houver localização
        setSelectedState(null);
        setSelectedCity(null);
      }
    } catch (error) {
      console.error('Erro ao carregar localização:', error);
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSelectedCity(null);
    setCitySearch('');
    setStep('city');
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    try {
      const location = await saveLocation(selectedState.code, city.name);
      setModalVisible(false);
      setStep('state');
      setStateSearch('');
      setCitySearch('');
      if (onLocationChange) {
        onLocationChange(location);
      }
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
    }
  };

  const handleBack = () => {
    if (step === 'city') {
      setStep('state');
      setSelectedCity(null);
      setCitySearch('');
    } else {
      setModalVisible(false);
    }
  };

  const renderStateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleStateSelect(item)}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#8B6F47" />
    </TouchableOpacity>
  );

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
      <Ionicons name="location" size={20} color="#8B6F47" />
    </TouchableOpacity>
  );

  const displayText = currentLocation
    ? `${currentLocation.city}, ${currentLocation.state}`
    : 'Selecionar localização';

  return (
    <>
      <TouchableOpacity
        style={iconOnly ? styles.iconButton : styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="location" size={iconOnly ? 24 : 20} color={iconOnly ? "#FFFFFF" : "#8B6F47"} />
        {!iconOnly && (
          <>
            <Text style={styles.selectorText} numberOfLines={1} ellipsizeMode="tail">
              {displayText}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#8B6F47" />
          </>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                {step === 'city' && (
                  <Ionicons name="arrow-back" size={24} color="#8B6F47" />
                )}
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {step === 'state' ? 'Selecione o Estado' : 'Selecione a Cidade'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#8B6F47" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#8B6F47" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={step === 'state' ? 'Buscar estado...' : 'Buscar cidade...'}
                placeholderTextColor="#A0A0A0"
                value={step === 'state' ? stateSearch : citySearch}
                onChangeText={step === 'state' ? setStateSearch : setCitySearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {(step === 'state' ? stateSearch : citySearch).length > 0 && (
                <TouchableOpacity
                  onPress={() => step === 'state' ? setStateSearch('') : setCitySearch('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#8B6F47" />
                </TouchableOpacity>
              )}
            </View>

            {/* List */}
            <FlatList
              data={step === 'state' ? filteredStates : filteredCities}
              renderItem={step === 'state' ? renderStateItem : renderCityItem}
              keyExtractor={(item, index) =>
                step === 'state' ? item.code : `${item.name}-${index}`
              }
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#8B6F47',
    width: '100%',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    color: '#8B6F47',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    fontFamily: 'Montserrat-SemiBold',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'PlayfairDisplay-SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  clearButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
});

export default LocationSelector;

