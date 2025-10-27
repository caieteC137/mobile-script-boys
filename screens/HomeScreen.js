// screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MuseumCard from '../components/MuseumCard';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Sample museum data
  const museums = [
    {
      id: '1',
      title: 'National Art Gallery',
      subtitle: 'Contemporary & Classic',
      description: 'Explore world-class collections spanning centuries of artistic expression and cultural heritage.',
      rating: 4.8,
      distance: '1.2 km',
    },
    {
      id: '2',
      title: 'History Museum',
      subtitle: 'Ancient Civilizations',
      description: 'Discover artifacts and exhibits showcasing the rich history of our region and beyond.',
      rating: 4.6,
      distance: '3.1 km',
    },
    {
      id: '3',
      title: 'Science Center',
      subtitle: 'Interactive Learning',
      description: 'Hands-on exhibits and interactive displays perfect for curious minds of all ages.',
      rating: 4.7,
      distance: '2.8 km',
    },
    {
      id: '4',
      title: 'Cultural Heritage',
      subtitle: 'Local Traditions',
      description: 'Celebrate local culture through traditional arts, crafts, and historical artifacts.',
      rating: 4.5,
      distance: '4.2 km',
    },
  ];

  const handleMuseumPress = (museum) => {
    // Navigate to museum details screen
    console.log('Navigate to museum:', museum.title);
  };

  const renderMuseumCard = ({ item }) => (
    <MuseumCard
      title={item.title}
      subtitle={item.subtitle}
      description={item.description}
      rating={item.rating}
      distance={item.distance}
      onPress={() => handleMuseumPress(item)}
    />
  );

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
          Home
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
          Explore
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
          Favorites
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
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo-museu.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>MuseumGuide</Text>
          </View>
          
          <TouchableOpacity style={styles.avatarContainer} onPress={onLogout}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#8B6F47" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={true}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>Discover amazing museums near you</Text>
        </View>

        {/* Featured Museums */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Museums</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={museums}
            renderItem={renderMuseumCard}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#C17E3A' }]}>
                <Ionicons name="library" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryText}>Art</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#4A7C59' }]}>
                <Ionicons name="time" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryText}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#A8402E' }]}>
                <Ionicons name="flask" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryText}>Science</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#8B6F47' }]}>
                <Ionicons name="people" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryText}>Culture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Visits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Visits</Text>
          <View style={styles.recentVisitsContainer}>
            <View style={styles.recentVisitItem}>
              <View style={styles.recentVisitIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4A7C59" />
              </View>
              <View style={styles.recentVisitContent}>
                <Text style={styles.recentVisitTitle}>National Art Gallery</Text>
                <Text style={styles.recentVisitDate}>Visited 2 days ago</Text>
              </View>
            </View>
            
            <View style={styles.recentVisitItem}>
              <View style={styles.recentVisitIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#4A7C59" />
              </View>
              <View style={styles.recentVisitContent}>
                <Text style={styles.recentVisitTitle}>Science Center</Text>
                <Text style={styles.recentVisitDate}>Visited 1 week ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

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
  header: {
    backgroundColor: '#8B6F47',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  avatarContainer: {
    padding: 4,
  },
  avatar: {
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B6F47',
    fontFamily: 'Montserrat-SemiBold',
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
});

export default HomeScreen;
