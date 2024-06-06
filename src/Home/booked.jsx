import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Appbar, TextInput, List, Avatar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
        if (storedUserId) {
          fetchBookings(storedUserId);
        }
      } catch (error) {
        console.error("Error retrieving userId:", error);
      }
    };
    fetchUserId();
  }, []);

  const fetchBookings = async (userId) => {
    try {
      const response = await axios.get(`https://studioseeker-h2vx.onrender.com/user-bookings/${userId}`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        Alert.alert("Fetch Error", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Fetch Error", "There was an error fetching your bookings. Please try again.");
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleBooking = async (studioId) => {
    try {
      const userId = 'USER_ID'; // Replace with the actual user ID
      const duration = 2; // Example duration

      const response = await axios.post('https://studioseeker-h2vx.onrender.com/create-booking', {
        userId,
        postId: studioId,
        duration,
      });

      if (response.data) {
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
        <Appbar.Content title="My Bookings" />
      </Appbar.Header>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search Bookings"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {bookings.map((booking) => (
          <List.Item
            key={booking._id}
            title={booking.postId.name}
            description={booking.postId.details}
            left={(props) => (
              <Avatar.Image size={50} source={{ uri: booking.postId.image }} />
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
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default BookingPage;
