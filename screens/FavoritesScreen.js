// screens/FavoritesScreen.js
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import favoritesStorage from '../services/favoritesStorage';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [favorites, setFavorites] = useState([]);

  const filtered = useMemo(() => {
    const base = favorites.filter((f) =>
      (f.name || f.title || '').toLowerCase().includes(query.trim().toLowerCase())
    );
    if (activeFilter === 'Todos') return base;
    return base.filter((f) => {
      const subtitle = f.subtitle || f.types?.[0] || '';
      return subtitle === activeFilter;
    });
  }, [query, activeFilter, favorites]);

  const removeFavorite = async (museum) => {
    try {
      await favoritesStorage.removeFavorite(museum);
      const newList = await favoritesStorage.getFavorites();
      setFavorites(newList);
    } catch (e) {
      console.error('Erro ao remover favorito:', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Conteúdo central */}
      <View style={styles.cardTextArea}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name || item.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.formatted_address || (item.types ? item.types[0] : '')}</Text>
      </View>

      {/* Botão de coração à direita */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => removeFavorite(item)}
      >
        <Ionicons name="heart" size={20} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );

  // Carrega favoritos quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        try {
          const list = await favoritesStorage.getFavorites();
          if (active) setFavorites(list);
        } catch (e) {
          console.error('Erro ao carregar favoritos:', e);
        }
      };
      load();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMuseum')}
        >
          <Ionicons name="add-circle" size={28} color="#8B6F47" />
        </TouchableOpacity>
      </View>

      {/* Barra de pesquisa */}
      <TextInput
        style={styles.search}
        placeholder="Buscar nos favoritos"
        placeholderTextColor="#A0A0A0"
        value={query}
        onChangeText={setQuery}
      />

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B6F47',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  addButton: {
    padding: 4,
  },
  search: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  filterRow: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: '#8B6F47',
    fontWeight: '600',
    fontSize: 14,
  },
  filterMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterOptionActive: {
    backgroundColor: '#F5F0E8',
  },
  filterOptionText: {
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#8B6F47',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTextArea: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default FavoritesScreen;


