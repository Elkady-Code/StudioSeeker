import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const StudioDetailsScreen = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      if (isFavorite) {
        await axios.delete('https://studioseeker-h2vx.onrender.com/favorites', { data: { studioId: 1 } });
        setIsFavorite(false);
        Alert.alert('Removed from favorites');
      } else {
        await axios.post('https://studioseeker-h2vx.onrender.com/favorites', { studioId: 1 });
        setIsFavorite(true);
        Alert.alert('Added to favorites');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.studioName}>Studio Name</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Image Placeholder</Text>
        </View>
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
          </Text>
        </View>
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoRow}>
            <View style={styles.photoPlaceholder} />
            <View style={styles.photoPlaceholder} />
            <View style={styles.photoPlaceholder} />
          </View>
        </View>
        <View style={styles.ratingsSection}>
          <Text style={styles.sectionTitle}>Ratings & Review</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star-outline" size={24} color="gold" />
          </View>
          <View style={styles.reviewRow}>
            <Ionicons name="thumbs-up-outline" size={24} color="black" />
            <Ionicons name="thumbs-down-outline" size={24} color="black" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    flex: 1,
  },
  studioName: {
    flex: 5,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  favoriteButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#888',
    fontSize: 18,
  },
  descriptionSection: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  photosSection: {
    padding: 10,
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoPlaceholder: {
    width: '30%',
    height: 100,
    backgroundColor: '#d3d3d3',
  },
  ratingsSection: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default StudioDetailsScreen;
