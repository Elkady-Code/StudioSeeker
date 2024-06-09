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
import * as SecureStore from "expo-secure-store";

const BookingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([
    {
      __v: 0,
      _id: "6664d80091a1085f8afc01a8",
      createdAt: "2024-06-08T22:15:28.103Z",
      description: "Photography  Studio",
      images: [
        "http://res.cloudinary.com/dparm0mf1/image/upload/v1717884927/10:15:26%20PM6650ebcaa6900bf1fc97afe5.jpg",
      ],
      location: "9th Street Smouha",
      name: "Arc ",
      rentPerHour: 400,
      updatedAt: "2024-06-08T22:15:28.103Z",
      userId: "6650ebcaa6900bf1fc97afe5",
    },
    {
      __v: 0,
      _id: "6664d7df91a1085f8afc01a5",
      createdAt: "2024-06-08T22:14:55.708Z",
      description: "Musical and Instrumental Production Studio ",
      images: [
        "http://res.cloudinary.com/dparm0mf1/image/upload/v1717884895/10:14:54%20PM6650ebcaa6900bf1fc97afe5.jpg",
      ],
      location: "4th St Miami",
      name: "Pure ",
      rentPerHour: 250,
      updatedAt: "2024-06-08T22:14:55.708Z",
      userId: "6650ebcaa6900bf1fc97afe5",
    },
    {
      __v: 0,
      _id: "6664d79d91a1085f8afc01a2",
      createdAt: "2024-06-08T22:13:49.433Z",
      description: "Musical Instrument Production Studio",
      images: [
        "http://res.cloudinary.com/dparm0mf1/image/upload/v1717884828/10:13:48%20PM6650ebcaa6900bf1fc97afe5.jpg",
      ],
      location: "St11 kafr abdo Alexandria egypt",
      name: "Art Seeker",
      rentPerHour: 200,
      updatedAt: "2024-06-08T22:13:49.433Z",
      userId: "6650ebcaa6900bf1fc97afe5",
    },
    {
      __v: 0,
      _id: "6664d74e91a1085f8afc019f",
      createdAt: "2024-06-08T22:12:30.822Z",
      description: "Musical Production Studio",
      images: [
        "http://res.cloudinary.com/dparm0mf1/image/upload/v1717884750/10:12:29%20PM6650ebcaa6900bf1fc97afe5.jpg",
      ],
      location: "St7 buiding 52 smouha alexandria egypt",
      name: "Nahwad ",
      rentPerHour: 250,
      updatedAt: "2024-06-08T22:12:30.822Z",
      userId: "6650ebcaa6900bf1fc97afe5",
    },
    {
      __v: 0,
      _id: "6664d67991a1085f8afc019c",
      createdAt: "2024-06-08T22:08:57.922Z",
      description: "Recording Instruments, and Music production",
      images: [
        "http://res.cloudinary.com/dparm0mf1/image/upload/v1717884537/10:08:56%20PM6650ebcaa6900bf1fc97afe5.jpg",
      ],
      location: "St5 Sidi gabr alexan",
      name: "Sweet Spot",
      rentPerHour: 200,
      updatedAt: "2024-06-08T22:08:57.922Z",
      userId: "6650ebcaa6900bf1fc97afe5",
    },
  ]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [bookings]);

  const fetchBookings = async userId => {
    const token = await SecureStore.getItemAsync("userToken");
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const response = await axios.get(`http://localhost:3005/user-bookings`);

      setBookings(response.data.bookings);
      if (response.data.success) {
      } else {
        // Alert.alert("Fetch Error", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Alert.alert(
      //   "Fetch Error",
      //   "There was an error fetching your bookings. Please try again.",
      // );
    }
  };

  const handleSearchChange = query => {
    setSearchQuery(query);
  };

  console.log(bookings);

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
        {bookings.map(booking => {
          return (
            <List.Item
              key={booking._id}
              title={booking.name}
              description={booking.details}
              left={props => (
                <Avatar.Image size={50} source={{ uri: booking.images[0] }} />
              )}
              style={styles.listItem}
            />
          );
        })}
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
