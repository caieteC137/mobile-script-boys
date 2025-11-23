import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { fonts } from '../utils/fonts';
import { getPlacePhotoUrl } from '../services/googlePlaces';
import favoritesStorage from '../services/favoritesStorage';

const MuseumDetailsScreen = ({ route, navigation }) => {
  const { museum } = route.params;
  const [wiki, setWiki] = useState(null);
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    const fetchWiki = async () => {
      setLoadingWiki(true);
      try {
        // Busca pelo nome do museu
        const searchName = encodeURIComponent(museum.name || museum.title);
        const url = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchName}&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.query?.search?.length > 0) {
          const page = data.query.search[0];
          // Busca detalhes do artigo
          const pageUrl = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=true&titles=${encodeURIComponent(page.title)}&format=json&origin=*`;
          const res2 = await fetch(pageUrl);
          const data2 = await res2.json();
          const pageId = Object.keys(data2.query.pages)[0];
          const pageData = data2.query.pages[pageId];
          setWiki({
            title: page.title,
            extract: pageData.extract,
            url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
            image: pageData?.thumbnail?.source,
          });
        } else {
          setWiki(null);
        }
      } catch (e) {
        setWiki(null);
      }
      setLoadingWiki(false);
    };
    fetchWiki();
    // checar se já é favorito
    const checkFav = async () => {
      try {
        const fav = await favoritesStorage.isFavorite(museum);
        setIsFavorite(!!fav);
      } catch (e) {
        setIsFavorite(false);
      }
    };
    checkFav();
  }, [museum.name, museum.title]);

  const openGoogleMaps = () => {
    try {
      let mapsUrl = '';
      
      // Prioridade 1: Coordenadas (sempre funciona no app do Google Maps)
      if (museum.latitude && museum.longitude) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${museum.latitude},${museum.longitude}`;
      }
      // Prioridade 2: Nome + endereço (busca textual - mais confiável que place_id)
      else if (museum.name || museum.title) {
        const query = encodeURIComponent(
          `${museum.name || museum.title}${museum.formatted_address ? ` ${museum.formatted_address}` : ''}`
        );
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      }
      // Prioridade 3: Place ID (pode não funcionar bem no app mobile)
      else if (museum.place_id) {
        // Tenta abrir com place_id, mas se não funcionar, o usuário pode usar nome+endereço
        mapsUrl = `https://maps.google.com/maps?q=place_id:${museum.place_id}`;
      }
      // Fallback: apenas endereço
      else if (museum.formatted_address) {
        const query = encodeURIComponent(museum.formatted_address);
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      }

      if (mapsUrl) {
        Linking.openURL(mapsUrl).catch(err => {
          console.error('Erro ao abrir Google Maps:', err);
        });
      }
    } catch (error) {
      console.error('Erro ao abrir Google Maps:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#8B6F47" />
      </TouchableOpacity>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        {(museum.photos && museum.photos[0] && museum.photos[0].photo_reference ? (
          <Image
            source={{ uri: getPlacePhotoUrl(museum.photos[0].photo_reference, 800) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : museum.image ? (
          <Image
            source={museum.image}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null)}
        
        <View style={styles.content}>
          <Text style={styles.title}>{museum.name || museum.title}</Text>

          {/* Rating and Reviews */}
          {(museum.rating || museum.user_ratings_total) && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingText}>{museum.rating || 0}</Text>
              <Text style={styles.reviewCount}>
                ({museum.user_ratings_total || 0} avaliações)
              </Text>
            </View>
          )}
          
          {/* Address */}
          {museum.formatted_address && (
            <View style={styles.infoContainer}>
              <MaterialIcons name="place" size={24} color="#8B6F47" />
              <Text style={styles.address}>{museum.formatted_address}</Text>
            </View>
          )}

          {/* Opening Status */}
          {museum.opening_hours && (
            <View style={styles.infoContainer}>
              <MaterialIcons name="access-time" size={24} color="#8B6F47" />
              <Text style={styles.info}>
                {museum.opening_hours.open_now ? 'Aberto agora' : 'Fechado'}
              </Text>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: museum.opening_hours.open_now ? '#4CAF50' : '#F44336' }
              ]} />
            </View>
          )}

          {/* Botão de Favoritar */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={async () => {
              try {
                if (isFavorite) {
                  await favoritesStorage.removeFavorite(museum);
                  setIsFavorite(false);
                } else {
                  await favoritesStorage.addFavorite(museum);
                  setIsFavorite(true);
                }
              } catch (e) {
                console.error('Erro ao alternar favorito:', e);
              }
            }}
          >
            <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={24} color="#A8402E" style={styles.favoriteIcon} />
            <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
          </TouchableOpacity>

          {/* Botão do Google Maps */}
          {museum.place_id || (museum.latitude && museum.longitude) || museum.formatted_address || museum.name || museum.title ? (
            <TouchableOpacity
              style={styles.mapsButton}
              onPress={openGoogleMaps}
            >
              <MaterialIcons name="map" size={24} color="#4285F4" style={styles.mapsIcon} />
              <Text style={styles.mapsButtonText}>Ver no Google Maps</Text>
            </TouchableOpacity>
          ) : null}

          {/* Types */}
          {museum.types && museum.types.length > 0 && (
            <View style={styles.typesContainer}>
              {museum.types.map((type, index) => (
                type !== 'point_of_interest' && type !== 'establishment' && (
                  <View key={index} style={styles.typeTag}>
                    <Text style={styles.typeText}>
                      {type === 'tourist_attraction' ? 'Atração Turística' : 
                       type === 'museum' ? 'Museu' : type}
                    </Text>
                  </View>
                )
              ))}
            </View>
          )}

          {/* Wikipedia Description */}
          <View style={{ marginTop: 24 }}>
            {loadingWiki && (
              <ActivityIndicator size="small" color="#8B6F47" />
            )}
            {wiki && wiki.extract && (
              <View style={styles.wikiContainer}>
                <Text style={styles.descriptionTitle}>Sobre o Museu (Wikipedia)</Text>
                <Text style={styles.description}>{wiki.extract.replace(/(<([^>]+)>)/gi, '')}</Text>
                <Text style={styles.wikiLink} onPress={() => Linking.openURL(wiki.url)}>
                  Ver mais na Wikipedia
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    color: '#333',
    fontFamily: fonts.playfairBold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF9E5',
    padding: 12,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 8,
    fontFamily: fonts.montserratSemiBold,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: fonts.montserratRegular,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9F6F2',
    padding: 12,
    borderRadius: 12,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    fontFamily: fonts.montserratRegular,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    fontFamily: fonts.montserratRegular,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 20,
  },
  typeTag: {
    backgroundColor: '#8B6F47',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.montserratRegular,
  },
  wikiContainer: {
    marginTop: 16,
    backgroundColor: '#F9F6F2',
    borderRadius: 12,
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B6F47',
    marginBottom: 12,
    fontFamily: fonts.playfairSemiBold,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
    fontFamily: fonts.montserratRegular,
  },
  wikiLink: {
    color: '#007AFF',
    fontSize: 15,
    marginTop: 8,
    fontFamily: fonts.montserratSemiBold,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE3D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  favoriteIcon: {
    marginRight: 10,
  },
  favoriteButtonText: {
    color: '#8B6F47',
    fontSize: 16,
    fontFamily: fonts.montserratSemiBold,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE3D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mapsIcon: {
    marginRight: 10,
  },
  mapsButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontFamily: fonts.montserratSemiBold,
  },
});

export default MuseumDetailsScreen;
