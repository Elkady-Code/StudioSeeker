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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
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
        <Image source={{ uri: `${post?.images[0]}` }} width={300} />
        <View style={styles.imagePlaceholder}>
          {/* <Text style={styles.imageText}>Image Placeholder</Text> */}
        </View>
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
            malesuada.
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  contentContainer: {
    padding: 16,
  },
  studioName: {
    flex: 5,
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  favoriteButton: {
    flex: 1,
    alignItems: "flex-end",
    marginBottom: 16,
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

  description: {
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
  location: {
    fontSize: 16,
    marginBottom: 8,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  rentPerHour: {
    fontSize: 16,
    marginBottom: 8,
  },
});

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import * as SecureStore from "expo-secure-store";

// const StudioDetailsScreen = ({ route, navigation }) => {
//   const { studioId, post } = route.params;

//   const [postDetail, setPostDetail] = useState({});
//   console.log(`Fetching details for studio ID: ${studioId}`);

//   const [isFavorite, setIsFavorite] = useState(false);
//   const [studioDetails, setStudioDetails] = useState({
//     name: "",
//     description: "",
//     location: "",
//     rentPerHour: "",
//     images: [],
//   });

//   // useEffect(() => {
//   //   const fetchStudioDetails = async () => {
//   //     try {
//   //       const token = await SecureStore.getItemAsync("userToken");
//   //       axios.defaults.headers.common.Authorization = `Bearer ${token}`;

//   //       setPostDetail(post);
//   //       const response = await axios.get(
//   //         `http://localhost:3005/studios/${studioId}`,
//   //       );
//   //       console.log("Response data:", response.data[0]);

//   //       setStudioDetails(response.data[0]);
//   //       if (response.data && response.data.name) {
//   //       } else {
//   //         Alert.alert("Error", "Studio not found");
//   //         // navigation.goBack();
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching studio details:", error);
//   //       // Alert.alert("Error", "Studio not found");
//   //       // navigation.goBack();
//   //     }
//   //   };

//   //   fetchStudioDetails();
//   // }, [studioId]);

//   console.log(post);
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <Text style={styles.title}>{post.name}</Text>
//         <Text style={styles.description}>{post.description}</Text>
//         <Text style={styles.location}>{post.location}</Text>
//         <Text style={styles.rentPerHour}>
//           Rent per hour: ${post.rentPerHour}
//         </Text>
//         {/* Add other studio details here */}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   description: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   location: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   rentPerHour: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
// });

// export default StudioDetailsScreen;
