// components/MuseumGridCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MuseumGridCard = ({ 
  title, 
  subtitle, 
  image, 
  onPress,
  rating = 4.5,
  openNow = false
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image 
          source={image || { uri: 'https://via.placeholder.com/400x300/8B6F47/FFFFFF?text=Museu' }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        {openNow && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Aberto</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#4A7C59',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
});

export default MuseumGridCard;

