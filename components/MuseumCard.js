// components/MuseumCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const MuseumCard = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  onPress,
  rating = 4.5,
  distance = "2.3 km"
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image 
          source={image || { uri: 'https://via.placeholder.com/200x120/8B6F47/FFFFFF?text=Museum' }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {rating}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.distance}>{distance}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>Museum</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B6F47',
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C17E3A',
    marginBottom: 8,
    fontFamily: 'Montserrat-Medium',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Montserrat-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A7C59',
    fontFamily: 'Montserrat-Medium',
  },
  categoryTag: {
    backgroundColor: '#F5F0E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default MuseumCard;
