import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(
    "https://example.com/default-avatar.png",
  );
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        const storedProfile = await AsyncStorage.getItem("profile");

        if (storedUsername) {
          setUsername(storedUsername);
        }

        if (storedProfile) {
          setProfile(storedProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const logOut = async () => {
    const authToken = await SecureStore.deleteItemAsync("userToken");
    try {
      if (!authToken) {
        Alert.alert("Error", "Access token not found. Please sign in.");
        return;
      }

      const response = await axios.post(
        "https://studioseeker-h2vx.onrender.com/sign-out",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const data = response.data;

      if (response.status === 200) {
        if (data.success) {
          Alert.alert("Success", "You have signed out successfully.");
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("username");
          await AsyncStorage.removeItem("profile");
          navigation.navigate("SignIn");
        } else {
          Alert.alert("Error", "Failed to sign out.");
        }
      } else {
        Alert.alert("Error", data.message || "Sign out failed.");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert(
        "Error",
        "An error occurred while signing out. Please try again later.",
      );
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.cancelled) {
        console.log("Image picker cancelled");
        return;
      }

      console.log("Image picker result:", result);

      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("profile", { uri: localUri, name: filename, type });

      console.log("FormData:", formData);

      const authToken = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        "https://studioseeker-h2vx.onrender.com/upload-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      console.log("Response data:", response.data);

      if (response.status === 201 && response.data.success) {
        const profile = response.data.profileImageUrl;

        if (!profile) {
          console.error(
            "Profile URL is undefined in response data:",
            response.data,
          );
          Alert.alert("Error", "Failed to upload image.");
          return;
        }

        console.log("Updated profile URL:", profile);
        setProfile(profile);
        await AsyncStorage.setItem("profile", profile);
        Alert.alert("Success", "Profile image updated successfully.");
      } else {
        console.log("Upload failed:", response.data);
        Alert.alert("Error", "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
      }
      Alert.alert(
        "Error",
        "An error occurred while uploading the image. Please try again later.",
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            <Image source={{ uri: profile }} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.username}>{username || "User Name"}</Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={logOut}>
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingTop: StatusBar.currentHeight + 10,
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Profile;
