import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './userStorage';

const GLOBAL_FAVORITES_KEY = '@favorites';

const getKeyForUser = async () => {
  try {
    const user = await getCurrentUser();
    return user ? `@favorites_${user.id}` : GLOBAL_FAVORITES_KEY;
  } catch (e) {
    return GLOBAL_FAVORITES_KEY;
  }
};

export const getFavorites = async () => {
  try {
    const key = await getKeyForUser();
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Erro ao obter favoritos:', e);
    return [];
  }
};

export const saveFavorites = async (items) => {
  try {
    const key = await getKeyForUser();
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error('Erro ao salvar favoritos:', e);
  }
};

const getMuseumId = (museum) => museum.place_id || museum.id || museum.reference || museum._id || museum.name;

export const addFavorite = async (museum) => {
  try {
    const items = await getFavorites();
    const id = getMuseumId(museum);
    if (!id) return;
    const exists = items.find((i) => getMuseumId(i) === id);
    if (exists) return;
    items.unshift(museum);
    await saveFavorites(items);
  } catch (e) {
    console.error('Erro ao adicionar favorito:', e);
  }
};

export const removeFavorite = async (museum) => {
  try {
    const items = await getFavorites();
    const id = getMuseumId(museum);
    if (!id) return;
    const filtered = items.filter((i) => getMuseumId(i) !== id);
    await saveFavorites(filtered);
  } catch (e) {
    console.error('Erro ao remover favorito:', e);
  }
};

export const isFavorite = async (museum) => {
  try {
    const items = await getFavorites();
    const id = getMuseumId(museum);
    if (!id) return false;
    return items.some((i) => getMuseumId(i) === id);
  } catch (e) {
    return false;
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  saveFavorites,
};
