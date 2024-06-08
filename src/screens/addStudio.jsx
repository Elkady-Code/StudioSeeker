import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const AddStudio = ({ userId }) => {
  const [studioName, setStudioName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [rentPerHour, setRentPerHour] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      // console.log(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const token = await SecureStore.getItemAsync("userToken");

    let formData = new FormData();
    formData.append("images", {
      uri: image,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const response = await axios.post(
        "https://studioseeker-h2vx.onrender.com/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response.data.imageUrl);
      return response.data.imageUrl; // Assuming the API returns the URL of the uploaded image
    } catch (error) {
      console.error(error.response.data);
      alert("Failed to upload profile image");
      return null;
    }
  };

  const handleAddStudio = async () => {
    let imageUrl = null;
    if (image) {
      console.log(image);
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

    const token = await SecureStore.getItemAsync("userToken");
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    console.log(imageUrl);
    try {
      const response = await axios.post("http://localhost:3005/user/post", {
        name: studioName,
        location: location,
        rentPerHour: rentPerHour,
        desc: description,
        images: imageUrl ? [imageUrl] : [],
      });

      alert("Studio added successfully!");
      setStudioName("");
      setDescription("");
      setLocation("");
      setRentPerHour("");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add studio");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>This will take a moment</Text>
          </View>
          <Text style={styles.subHeaderText}>
            Please fill out the following you want to add.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Studio</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={studioName}
              onChangeText={setStudioName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price (EGP)</Text>
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={rentPerHour}
              onChangeText={setRentPerHour}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Add Photo for Studio</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddStudio}>
            <Text style={styles.addButtonText}>Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 14,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  photoButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default AddStudio;
