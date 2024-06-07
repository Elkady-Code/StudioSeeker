import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const StudioDetailsScreen = ({ route, navigation }) => {
  const { studioId } = route.params;
  console.log(`Fetching details for studio ID: ${studioId}`);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [studioDetails, setStudioDetails] = useState({
    name: '',
    description: '',
    location: '',
    rentPerHour: '',
    images: [],
  });

  useEffect(() => {
    const fetchStudioDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await axios.get(`https://studioseeker-h2vx.onrender.com/studios/${studioId}`);
        console.log('Response data:', response.data);

        if (response.data && response.data.name) {
          setStudioDetails(response.data);
        } else {
          Alert.alert("Error", "Studio not found");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching studio details:", error);
        Alert.alert("Error", "Studio not found");
        navigation.goBack();
      }
    };

    fetchStudioDetails();
  }, [studioId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{studioDetails.name}</Text>
        <Text style={styles.description}>{studioDetails.description}</Text>
        <Text style={styles.location}>{studioDetails.location}</Text>
        <Text style={styles.rentPerHour}>Rent per hour: ${studioDetails.rentPerHour}</Text>
        {/* Add other studio details here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    marginBottom: 8,
  },
  rentPerHour: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default StudioDetailsScreen;
