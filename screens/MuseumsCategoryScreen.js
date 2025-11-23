// screens/MuseumsCategoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MuseumCard from '../components/MuseumCard';
import favoritesStorage from '../services/favoritesStorage';

const MuseumsCategoryScreen = ({ route, navigation }) => {
  const { museums, categoryTitle, categoryIcon } = route.params;
  const [favoritesSet, setFavoritesSet] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await favoritesStorage.getFavorites();
        const favSet = new Set(favs.map(f => f.place_id || f.id || f.reference || f.name));
        setFavoritesSet(favSet);
      } catch (e) {
        console.error('Erro ao carregar favoritos:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleMuseumPress = (museum) => {
    navigation.navigate('MuseumDetails', { 
      museum: {
        ...museum,
        name: museum.name || museum.title,
        formatted_address: museum.formatted_address || museum.subtitle,
        rating: museum.rating || 0,
        user_ratings_total: museum.user_ratings_total || 0,
        types: museum.types || ['museum'],
        opening_hours: {
          open_now: museum.opening_hours?.open_now || false
        },
        description: museum.description,
        image: museum.image,
        rating: museum.rating,
        latitude: museum.latitude,
        longitude: museum.longitude,
      } 
    });
  };

  const toggleFavorite = async (museum) => {
    try {
      const museumId = museum.place_id || museum.id || museum.reference || museum.name;
      const newSet = new Set(favoritesSet);
      
      if (newSet.has(museumId)) {
        newSet.delete(museumId);
        await favoritesStorage.removeFavorite(museum);
      } else {
        newSet.add(museumId);
        await favoritesStorage.addFavorite(museum);
      }
      
      setFavoritesSet(newSet);
    } catch (e) {
      console.error('Erro ao alternar favorito:', e);
    }
  };

  const renderMuseumCard = ({ item }) => {
    const museumId = item.place_id || item.id || item.reference || item.name;
    const isFav = favoritesSet.has(museumId);

    return (
      <MuseumCard
        title={item.title}
        subtitle={item.subtitle}
        description={item.description}
        rating={item.rating}
        distance={item.distance}
        image={item.image}
        isFavorite={isFav}
        onFavoritePress={() => toggleFavorite(item)}
        onPress={() => handleMuseumPress(item)}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B6F47" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#8B6F47" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          {categoryIcon && <Ionicons name={categoryIcon} size={20} color="#8B6F47" style={{ marginRight: 8 }} />}
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Museums List */}
      {museums && museums.length > 0 ? (
        <FlatList
          data={museums}
          renderItem={renderMuseumCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#8B6F47" />
          <Text style={styles.emptyText}>Nenhum museu encontrado nesta categoria</Text>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'PlayfairDisplay-SemiBold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B6F47',
    fontFamily: 'Montserrat-Regular',
  },
});

export default MuseumsCategoryScreen;
