// components/MuseumCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MuseumCard = ({ 
  title, 
  subtitle, 
  image, 
  onPress,
  rating = 4.5,
  openNow = false,
  isFavorite = false,
  onFavoritePress = () => {},
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image 
          source={image || { uri: 'https://via.placeholder.com/400x240/8B6F47/FFFFFF?text=Museu' }} 
          style={styles.image}
          resizeMode="cover"
        />
        {/* Botão de coração no canto superior esquerdo */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? '#E74C3C' : '#FFFFFF'} 
          />
        </TouchableOpacity>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {rating}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        <Text style={styles.statusText}>{openNow ? 'Aberto agora' : 'Fechado'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 360,
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 7,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  ratingContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    zIndex: 2,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 2,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
    marginBottom: 6,
    fontFamily: 'Montserrat-Medium',
  },
  statusText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 2,
  },
});

export default MuseumCard;
