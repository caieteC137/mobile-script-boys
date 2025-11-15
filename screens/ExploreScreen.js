// screens/ExploreScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MuseumGridCard from '../components/MuseumGridCard';
import { fetchNearbyMuseums, adaptPlacesToMuseums, getPlacePhotoUrl } from '../services/googlePlaces';
import { getLocation } from '../services/locationStorage';
import favoritesStorage from '../services/favoritesStorage';

const { width: screenWidth } = Dimensions.get('window');

const ExploreScreen = ({ navigation, currentLocation: propLocation }) => {
  const [museums, setMuseums] = useState([]);
  const [filteredMuseums, setFilteredMuseums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [favoritesSet, setFavoritesSet] = useState(new Set());

  useEffect(() => {
    const loadLocationAndMuseums = async () => {
      try {
        const location = propLocation || await getLocation();
        await fetchMuseumsForLocation(location);
        
        // Carregar favoritos
        const favs = await favoritesStorage.getFavorites();
        const favSet = new Set(favs.map(f => f.place_id || f.id || f.reference || f.name));
        setFavoritesSet(favSet);
      } catch (e) {
        console.error('Erro ao carregar localização:', e);
        const defaultLocation = { latitude: -23.55052, longitude: -46.633308 };
        await fetchMuseumsForLocation(defaultLocation);
      }
    };

    loadLocationAndMuseums();
  }, [propLocation]);

  const fetchMuseumsForLocation = async (location) => {
    setIsLoading(true);
    setError(null);
    try {
      const json = await fetchNearbyMuseums({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10000
      });
      const adapted = adaptPlacesToMuseums(json.results || []);
      setMuseums(adapted);
      setFilteredMuseums(adapted);
      setNextPageToken(json.next_page_token || null);
    } catch (e) {
      setError('Não foi possível carregar os museus (Google Places).');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMuseums = async () => {
    if (!nextPageToken || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Aguardar um pouco antes de fazer a requisição (Google Places requer delay)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const location = propLocation || await getLocation();
      const json = await fetchNearbyMuseums({ 
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10000,
        pageToken: nextPageToken 
      });
      
      const adapted = adaptPlacesToMuseums(json.results || []);
      setMuseums(prev => [...prev, ...adapted]);
      setFilteredMuseums(prev => [...prev, ...adapted]);
      setNextPageToken(json.next_page_token || null);
    } catch (e) {
      console.error('Erro ao carregar mais museus:', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMuseums(museums);
    } else {
      const filtered = museums.filter(museum => {
        const title = (museum.title || museum.name || '').toLowerCase();
        const subtitle = (museum.subtitle || museum.formatted_address || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query) || subtitle.includes(query);
      });
      setFilteredMuseums(filtered);
    }
  }, [searchQuery, museums]);

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
        // Remover
        newSet.delete(museumId);
        await favoritesStorage.removeFavorite(museum);
      } else {
        // Adicionar
        newSet.add(museumId);
        await favoritesStorage.addFavorite(museum);
      }
      
      setFavoritesSet(newSet);
    } catch (e) {
      console.error('Erro ao alternar favorito:', e);
    }
  };

  const renderMuseumCard = ({ item, index }) => {
    const getPhotoUrl = (photoReference) => {
      if (!photoReference) return null;
      return getPlacePhotoUrl(photoReference, 400);
    };

    const imageSource = item.photos && item.photos[0]
      ? { uri: getPhotoUrl(item.photos[0].photo_reference) }
      : item.image || { uri: 'https://via.placeholder.com/400x300/8B6F47/FFFFFF?text=Museu' };

    const museumId = item.place_id || item.id || item.reference || item.name;
    const isFav = favoritesSet.has(museumId);

    return (
      <View style={styles.cardWrapper}>
        <MuseumGridCard
          title={item.title || item.name}
          subtitle={item.subtitle || item.formatted_address}
          image={imageSource}
          rating={item.rating || 0}
          openNow={item.opening_hours?.open_now || false}
          isFavorite={isFav}
          onFavoritePress={() => toggleFavorite(item)}
          onPress={() => handleMuseumPress(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Location Selector - moved here from header */}
      {propLocation && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Localização:</Text>
          <Text style={styles.locationText}>
            {propLocation.city}, {propLocation.state}
          </Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8B6F47" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar museus..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#8B6F47" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B6F47" />
          <Text style={styles.loadingText}>Carregando museus...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#A8402E" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredMuseums.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#8B6F47" />
          <Text style={styles.emptyTitle}>Nenhum museu encontrado</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Tente buscar com outros termos' : 'Não há museus disponíveis no momento'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMuseums}
          renderItem={renderMuseumCard}
          keyExtractor={(item, index) => item.id || `museum-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={searchQuery.trim() === '' ? loadMoreMuseums : null}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore && searchQuery.trim() === '' ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#8B6F47" />
                <Text style={styles.loadingMoreText}>Carregando mais museus...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    paddingTop: 20,
  },
  locationContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Montserrat-Medium',
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'Montserrat-SemiBold',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#A8402E',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'PlayfairDisplay-SemiBold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
});

export default ExploreScreen;

