import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default StudioDetailsScreen = ({ route, navigation }) => {
  const { studioId, post } = route.params;
  console.log(`Fetching details for studio ID: ${studioId}`);

  const [isFavorite, setIsFavorite] = useState(false);

  console.log(post);

 const navigateToCheckOut = () => {
  navigation.navigate ("CheckoutDetails");
 }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.studioName}>{post?.name}</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: `${post?.images[0]}` }} style={styles.image} />
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
            malesuada.
          </Text>
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
      <TouchableOpacity style={styles.bottomButton} onPress={navigateToCheckOut}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 80, // Ensure the button is not cut off
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  backButton: {
    flex: 1,
  },
  studioName: {
    flex: 5,
    fontSize: 20,
  },
  favoriteButton: {
    flex: 1,
    alignItems: "flex-end",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#888",
    fontSize: 18,
  },
  descriptionSection: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionText: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  photosSection: {
    padding: 10,
    marginBottom: 8,
  },
  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoPlaceholder: {
    width: "30%",
    height: 100,
    backgroundColor: "#d3d3d3",
  },
  ratingsSection: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  bottomButton: {
    backgroundColor: "#C15656",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
