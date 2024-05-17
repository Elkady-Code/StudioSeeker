import React from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();

  const logOut = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");

      if (!authToken) {
        Alert.alert("Error", "Access token not found. Please sign in.");
        return;
      }

      const response = await axios.post(
        "http://192.168.1.9:3005/sign-out",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        if (data.success) {
          Alert.alert("Success", "You have signed out successfully.");
          await AsyncStorage.removeItem("authToken");
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
        "An error occurred while signing out. Please try again later."
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" />
        <Text style={styles.text}>Hello</Text>

        <TouchableOpacity onPress={logOut}>
          <Text>Log Out</Text>
        </TouchableOpacity>
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
  text: {
    color: "red",
  },
});

export default Profile;
