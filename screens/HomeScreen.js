// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MuseumCard from '../components/MuseumCard';
import FavoritesScreen from './FavoritesScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import LocationSelector from '../components/LocationSelector';
import { fetchNearbyMuseums, adaptPlacesToMuseums } from '../services/googlePlaces';
import { getLocation } from '../services/locationStorage';
import favoritesStorage from '../services/favoritesStorage';
import customMuseumsStorage from '../services/customMuseumsStorage';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ route, navigation }) => {
  const onLogout = route?.params?.onLogout;
  const [activeTab, setActiveTab] = useState('home');
  const [museums, setMuseums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [favoritesSet, setFavoritesSet] = useState(new Set());

  useEffect(() => {
    const loadLocationAndMuseums = async () => {
      try {
        // Solicitar permissão de localização
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Permissão de localização negada');
          // Se não tiver permissão, usa localização padrão
          const defaultLocation = { 
            latitude: -23.55052, 
            longitude: -46.633308,
            city: null,
            state: null
          };
          setCurrentLocation(defaultLocation);
          await fetchMuseumsForLocation(defaultLocation);
        } else {
          // Obter localização atual do dispositivo
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          
          const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            city: null,
            state: null
          };
          
          setCurrentLocation(userLocation);
          await fetchMuseumsForLocation(userLocation);
        }
        
        // Carregar favoritos
        const favs = await favoritesStorage.getFavorites();
        const favSet = new Set(favs.map(f => f.place_id || f.id || f.reference || f.name));
        setFavoritesSet(favSet);
      } catch (e) {
        console.error('Erro ao carregar localização:', e);
        // Fallback para localização padrão em caso de erro
        const defaultLocation = { 
          latitude: -23.55052, 
          longitude: -46.633308,
          city: null,
          state: null
        };
        setCurrentLocation(defaultLocation);
        await fetchMuseumsForLocation(defaultLocation);
      }
    };

    loadLocationAndMuseums();
    
    // Listener para recarregar quando voltar da tela de adicionar museu
    const unsubscribe = navigation.addListener('focus', () => {
      loadLocationAndMuseums();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchMuseumsForLocation = async (location) => {
    setIsLoading(true);
    setError(null);
    try {
      // Buscar museus da API do Google Places
      const json = await fetchNearbyMuseums({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 4000
      });
      const adapted = adaptPlacesToMuseums(json.results);
      
      // Buscar museus customizados (armazenados localmente)
      const customMuseums = await customMuseumsStorage.getCustomMuseums();
      
      // Combinar ambos os arrays (museus customizados primeiro)
      const allMuseums = [...customMuseums, ...adapted];
      
      setMuseums(allMuseums);
    } catch (e) {
      console.error('Erro ao carregar museus:', e);
      // Mesmo com erro na API, ainda carregar museus customizados
      try {
        const customMuseums = await customMuseumsStorage.getCustomMuseums();
        setMuseums(customMuseums);
      } catch (customError) {
        setError('Não foi possível carregar os museus.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateMapHTML = () => {
    if (!currentLocation) return '';
    
    const apiKey = 'AIzaSyB4Wzh4ko66GWkC6I5eJ1-VtjqvIoTTPrk';
    const museumsWithLocation = museums.filter(m => m.latitude && m.longitude);
    
    // Criar marcadores para os museus com informações
    const markers = museumsWithLocation.map((museum, index) => {
      const name = (museum.name || museum.title || 'Museu')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, ' ');
      const lat = museum.latitude;
      const lng = museum.longitude;
      const rating = museum.rating ? museum.rating.toFixed(1) : 'N/A';
      const address = (museum.formatted_address || museum.subtitle || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, ' ');
      
      return `
        (function() {
          const marker${index} = new google.maps.Marker({
            position: { lat: ${lat}, lng: ${lng} },
            map: map,
            title: '${name}',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            },
            animation: google.maps.Animation.DROP
          });
          
          const infoWindow${index} = new google.maps.InfoWindow({
            content: '<div style="padding: 8px; min-width: 200px;"><h3 style="margin: 0 0 8px 0; font-size: 16px; color: #8B6F47;">${name}</h3><p style="margin: 4px 0; font-size: 12px; color: #666;">⭐ ${rating}</p><p style="margin: 4px 0; font-size: 12px; color: #666;">${address}</p></div>'
          });
          
          marker${index}.addListener('click', function() {
            infoWindow${index}.open(map, marker${index});
          });
        })();
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; overflow: hidden; }
            #map { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            function initMap() {
              const center = { lat: ${currentLocation.latitude}, lng: ${currentLocation.longitude} };
              const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: center,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
              });

              // Marcador da localização do usuário
              new google.maps.Marker({
                position: center,
                map: map,
                title: 'Sua localização',
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new google.maps.Size(40, 40)
                },
                animation: google.maps.Animation.DROP,
                zIndex: 1000
              });

              // Marcadores dos museus
              ${markers}
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap">
          </script>
        </body>
      </html>
    `;
  };

  const handleLocationChange = async (newLocation) => {
    setCurrentLocation(newLocation);
    await fetchMuseumsForLocation(newLocation);
  };

  const handleMuseumPress = (museum) => {
    console.log('Museum data:', museum); // Para debug
    navigation.navigate('MuseumDetails', { 
      museum: {
        ...museum, // Preserva todos os dados originais
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

  // Funções para filtrar e categorizar museus
  const getFeaturedMuseums = () => {
    return [...museums]
      .sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0))
      .slice(0, 10);
  };

  const getNearbyMuseums = () => {
    return museums.slice(0, 10);
  };

  const getOpenNowMuseums = () => {
    const filtered = museums.filter(m => {
      const isOpen = m.opening_hours?.open_now === true;
      return isOpen;
    }).slice(0, 10);
    
    return filtered;
  };

  const getTopRatedMuseums = () => {
    return [...museums]
      .filter(m => m.rating && m.rating >= 4.0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  };

  const getArtMuseums = () => {
    return museums
      .filter(m => {
        const types = (m.types || []).map(t => t.toLowerCase());
        return types.some(t => t.includes('art') || t.includes('gallery'));
      })
      .slice(0, 10);
  };

  const getHistoryMuseums = () => {
    return museums
      .filter(m => {
        const types = (m.types || []).map(t => t.toLowerCase());
        return types.some(t => t.includes('history') || t.includes('historic'));
      })
      .slice(0, 10);
  };

  const renderCarousel = (title, data, icon, categoryKey) => {
    if (!data || data.length === 0) return null;
    
    const handleSeeAll = () => {
      navigation.navigate('MuseumCategory', {
        museums: data,
        categoryTitle: title,
        categoryIcon: icon
      });
    };
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            {icon && <Ionicons name={icon} size={20} color="#8B6F47" style={{ marginRight: 8 }} />}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={renderMuseumCard}
          keyExtractor={(item) => item.place_id || item.id || item.reference || `museum_${item.title}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />
      </View>
    );
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'home' && styles.activeTab]}
        onPress={() => setActiveTab('home')}
      >
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'home' ? '#FFFFFF' : '#8B6F47'} 
        />
        <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'explore' && styles.activeTab]}
        onPress={() => setActiveTab('explore')}
      >
        <Ionicons 
          name={activeTab === 'explore' ? 'compass' : 'compass-outline'} 
          size={24} 
          color={activeTab === 'explore' ? '#FFFFFF' : '#8B6F47'} 
        />
        <Text style={[styles.tabText, activeTab === 'explore' && styles.activeTabText]}>
          Explorar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'favorites' && styles.activeTab]}
        onPress={() => setActiveTab('favorites')}
      >
        <Ionicons 
          name={activeTab === 'favorites' ? 'heart' : 'heart-outline'} 
          size={24} 
          color={activeTab === 'favorites' ? '#FFFFFF' : '#8B6F47'} 
        />
        <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
          Favoritos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'profile' && styles.activeTab]}
        onPress={() => setActiveTab('profile')}
      >
        <Ionicons 
          name={activeTab === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={activeTab === 'profile' ? '#FFFFFF' : '#8B6F47'} 
        />
        <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Topbar - apenas na aba home */}
      {activeTab === 'home' && (
        <View style={styles.topbar}>
          <View style={styles.topbarContent}>
            <TouchableOpacity
              style={styles.logoContainer}
              onPress={() => navigation.navigate('About')}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../assets/logo-museu.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.topbarRight}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddMuseum')}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ marginLeft: 12 }}>
                <LocationSelector
                  onLocationChange={handleLocationChange}
                  currentLocation={currentLocation}
                  iconOnly={true}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Main Content */}
      {activeTab === 'favorites' ? (
        <View style={styles.content}>
          <FavoritesScreen />
        </View>
      ) : activeTab === 'explore' ? (
        <View style={styles.content}>
          <ExploreScreen navigation={navigation} currentLocation={currentLocation} />
        </View>
      ) : activeTab === 'profile' ? (
        <View style={styles.content}>
          <ProfileScreen 
            onLogout={onLogout} 
            navigation={navigation}
            onNavigateToFavorites={() => setActiveTab('favorites')}
          />
        </View>
      ) : (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={true}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
          <Text style={styles.welcomeSubtitle}>Descubra museus incríveis perto de você</Text>
        </View>

        {isLoading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#8B6F47" />
            <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Carregando museus...</Text>
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Ionicons name="alert-circle" size={48} color="#A8402E" />
            <Text style={{ marginTop: 16, color: '#A8402E', fontSize: 16 }}>{error}</Text>
          </View>
        ) : (
          <>
            {/* Museus em Destaque */}
            {renderCarousel('Museus em destaque', getFeaturedMuseums(), 'star')}

            {/* Museus Perto de Você */}
            {renderCarousel('Museus perto de você', getNearbyMuseums(), 'location')}

            {/* Museus Abertos Agora */}
            {renderCarousel('Museus abertos agora', getOpenNowMuseums(), 'time')}

            {/* Museus Mais Bem Avaliados */}
            {renderCarousel('Museus mais bem avaliados', getTopRatedMuseums(), 'star-outline')}

            {/* Museus de Arte */}
            {renderCarousel('Museus de Arte', getArtMuseums(), 'brush')}

            {/* Museus de História */}
            {renderCarousel('Museus de História', getHistoryMuseums(), 'book')}
          </>
        )}


        {/* Recent Visits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visitas recentes</Text>
          <View style={styles.recentVisitsContainer}>
            <View style={styles.recentVisitItem}>
              <View style={styles.recentVisitIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4A7C59" />
              </View>
              <View style={styles.recentVisitContent}>
                <Text style={styles.recentVisitTitle}>Galeria Nacional de Arte</Text>
                <Text style={styles.recentVisitDate}>Visitado há 2 dias</Text>
              </View>
            </View>
            
            <View style={styles.recentVisitItem}>
              <View style={styles.recentVisitIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4A7C59" />
              </View>
              <View style={styles.recentVisitContent}>
                <Text style={styles.recentVisitTitle}>Centro de Ciência</Text>
                <Text style={styles.recentVisitDate}>Visitado há 1 semana</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Google Maps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="map" size={20} color="#8B6F47" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Mapa</Text>
            </View>
          </View>
          <View style={styles.mapContainer}>
            {currentLocation && museums.length > 0 ? (
              <WebView
                source={{
                  html: generateMapHTML()
                }}
                style={styles.map}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('WebView error: ', nativeEvent);
                }}
              />
            ) : currentLocation ? (
              <View style={styles.mapPlaceholder}>
                <ActivityIndicator size="large" color="#8B6F47" />
                <Text style={styles.mapPlaceholderText}>Carregando museus no mapa...</Text>
              </View>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map-outline" size={48} color="#8B6F47" />
                <Text style={styles.mapPlaceholderText}>Carregando mapa...</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      )}

      {/* Bottom Tab Bar */}
      {renderTabBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  topbar: {
    backgroundColor: '#8B6F47',
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  topbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeSection: {
    paddingVertical: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'PlayfairDisplay-SemiBold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C17E3A',
    fontFamily: 'Montserrat-Medium',
  },
  carouselContainer: {
    paddingRight: 20,
  },
  recentVisitsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentVisitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentVisitIcon: {
    marginRight: 12,
  },
  recentVisitContent: {
    flex: 1,
  },
  recentVisitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  recentVisitDate: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8B6F47',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B6F47',
    marginTop: 4,
    fontFamily: 'Montserrat-Medium',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F9F6F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F6F2',
  },
  mapPlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8B6F47',
    fontFamily: 'Montserrat-Regular',
  },
});

export default HomeScreen;
