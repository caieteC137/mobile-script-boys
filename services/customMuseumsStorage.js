// services/customMuseumsStorage.js
// Armazena museus customizados localmente usando AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './userStorage';

const GLOBAL_CUSTOM_MUSEUMS_KEY = '@custom_museums';

const getKeyForUser = async () => {
  try {
    const user = await getCurrentUser();
    return user ? `@custom_museums_${user.id}` : GLOBAL_CUSTOM_MUSEUMS_KEY;
  } catch (e) {
    return GLOBAL_CUSTOM_MUSEUMS_KEY;
  }
};

// Função para gerar ID único para museus customizados
const generateId = () => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obter todos os museus customizados
export const getCustomMuseums = async () => {
  try {
    const key = await getKeyForUser();
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Erro ao obter museus customizados:', e);
    return [];
  }
};

// Salvar lista de museus customizados
export const saveCustomMuseums = async (museums) => {
  try {
    const key = await getKeyForUser();
    await AsyncStorage.setItem(key, JSON.stringify(museums));
  } catch (e) {
    console.error('Erro ao salvar museus customizados:', e);
  }
};

// Adicionar novo museu customizado
export const addCustomMuseum = async (museumData) => {
  try {
    const museums = await getCustomMuseums();
    const newMuseum = {
      ...museumData,
      id: generateId(),
      place_id: null, // Museus customizados não têm place_id do Google
      isCustom: true, // Flag para identificar museus customizados
      createdAt: new Date().toISOString(),
    };
    museums.unshift(newMuseum);
    await saveCustomMuseums(museums);
    return newMuseum;
  } catch (e) {
    console.error('Erro ao adicionar museu customizado:', e);
    throw e;
  }
};

// Remover museu customizado
export const removeCustomMuseum = async (museumId) => {
  try {
    const museums = await getCustomMuseums();
    const filtered = museums.filter((m) => m.id !== museumId);
    await saveCustomMuseums(filtered);
  } catch (e) {
    console.error('Erro ao remover museu customizado:', e);
    throw e;
  }
};

// Atualizar museu customizado
export const updateCustomMuseum = async (museumId, updatedData) => {
  try {
    const museums = await getCustomMuseums();
    const index = museums.findIndex((m) => m.id === museumId);
    if (index !== -1) {
      museums[index] = { ...museums[index], ...updatedData, updatedAt: new Date().toISOString() };
      await saveCustomMuseums(museums);
      return museums[index];
    }
    return null;
  } catch (e) {
    console.error('Erro ao atualizar museu customizado:', e);
    throw e;
  }
};

// Função para forçar atualização (mantida para compatibilidade)
export const refreshMuseums = async () => {
  return await getCustomMuseums();
};

export default {
  getCustomMuseums,
  addCustomMuseum,
  removeCustomMuseum,
  updateCustomMuseum,
  saveCustomMuseums,
  refreshMuseums,
};
