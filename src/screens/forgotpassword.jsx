import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      // Validate email
      if (!email) {
        Alert.alert("Error", "Please enter your email.");
        return;
      }

      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        return;
      }

      // Send request with email
      const response = await axios.post(
        "https://studioseeker-h2vx.onrender.com/forgotPassword",
        { email }
      );
      const data = response.data;

      // Handle response
      if (response.status === 200) {
        if (data.status === "success") {
          Alert.alert(
            "Success",
            "Password reset link has been sent to your email."
          );
        } else {
          Alert.alert(
            "Error",
            data.message ||
              "An error occurred while sending the email. Please try again later."
          );
        }
      } else {
        Alert.alert(
          "Error",
          data.message || `Request failed with status code ${response.status}`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Account not linked to the given email");
      } else {
        console.error("Error sending email:", error);
        Alert.alert(
          "Error",
          "An error occurred while sending the email. Please try again later."
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image
          source={require("../imgs/logo.png")}
          style={styles.image}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>Reset Your Password</Text>
          <Text style={styles.subText}>
            Enter your email below to receive the password reset link.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 StudioSeeker</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#C15656",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 7,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#666666",
  },
  header: {
    alignItems: "center",
    marginBottom: 10, // Adjusted margin
    marginTop: -5, // Move the header and image up together
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: -80, // Move the header and image up together
  }
});


export default ForgotPassword;
