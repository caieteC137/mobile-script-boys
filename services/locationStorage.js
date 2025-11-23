// services/locationStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDefaultLocation, getCityCoordinates } from '../utils/brazilianCities';

const LOCATION_KEY = '@museum_location';

export const saveLocation = async (state, city) => {
  try {
    const coordinates = getCityCoordinates(state, city);
    if (!coordinates) {
      throw new Error('Cidade não encontrada');
    }
    
    const location = {
      state,
      city,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    return location;
  } catch (error) {
    console.error('Erro ao salvar localização:', error);
    throw error;
  }
};

export const getLocation = async () => {
  try {
    const locationJson = await AsyncStorage.getItem(LOCATION_KEY);
    if (locationJson) {
      return JSON.parse(locationJson);
    }
    // Retorna localização padrão se não houver salva
    return getDefaultLocation();
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return getDefaultLocation();
  }
};

export const clearLocation = async () => {
  try {
    await AsyncStorage.removeItem(LOCATION_KEY);
  } catch (error) {
    console.error('Erro ao limpar localização:', error);
  }
};

