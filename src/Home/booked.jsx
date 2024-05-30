import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Appbar, TextInput, List, Avatar } from 'react-native-paper';
import axios from 'axios';

const BookingPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [studios, setStudios] = React.useState([
    { id: 1, name: 'Studio A', details: 'This is Studio A', image: 'https://picsum.photos/200/300' },
    { id: 2, name: 'Studio B', details: 'This is Studio B', image: 'https://picsum.photos/200/300' },
    { id: 3, name: 'Studio C', details: 'This is Studio C', image: 'https://picsum.photos/200/300' },
  ]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleBooking = async (studioId) => {
    try {
      const userId = 'USER_ID'; // Replace with the actual user ID
      const duration = 2; // Example duration

      const response = await axios.post('https://yourapi.com/api/bookings/create-booking', {
        userId,
        postId: studioId,
        duration,
      });

      if (response.data.success) {
        Alert.alert('Booking Successful', `You have booked ${studioId} successfully`);
      } else {
        Alert.alert('Booking Failed', response.data.message);
      }
    } catch (error) {
      console.error('Error booking studio:', error);
      Alert.alert('Booking Error', 'There was an error booking the studio. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Book Studio / Instrument" />
      </Appbar.Header>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search Studios & Instruments"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {studios.map((studio) => (
          <List.Item
            key={studio.id}
            title={studio.name}
            description={studio.details}
            left={(props) => <Avatar.Image size={50} source={{ uri: studio.image }} />}
            right={(props) => (
              <TouchableOpacity onPress={() => handleBooking(studio.id)}>
                <Avatar.Icon size={30} icon="plus" style={styles.plusIcon} />
              </TouchableOpacity>
            )}
            style={styles.listItem}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
  },
  plusIcon: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginRight: 10,
  },
});

export default BookingPage;
