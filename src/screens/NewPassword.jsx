import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { KeyboardAvoidingView } from "react-native";

const NewPassword = ({ route, navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = route.params || { token: "2ec12ebe8988aec94659014c612cdddaf58c1e190e00da4127fa4dd647361fc8" }; // Provide a default token value

  const handleResetPassword = async () => {
    try {
      if (!password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await axios.patch(
        `http://192.168.1.9:3005/reset-password/${token}`,
        { password, confirmPassword }
      );

      const data = response.data;

      if (response.status === 200 && data.success) {
        // Password reset successful
        setSuccessMessage("Password reset successfully. You will be navigated to the Sign In page shortly.");
        console.log("Success message:", successMessage);
        setTimeout(() => {
          navigation.navigate("SignIn");
          console.log("Navigating to SignIn page...");
        }, 3000); // Navigate to SignIn after 3 seconds
      } else {
        // Password reset failed
        setError(data.message || "Password reset failed.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Reset Your Password</Text>
          <Text style={styles.subHeaderText}>
            Enter your new password below
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          color="#C15656"
          style={styles.button}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 StudioSeeker</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  success: {
    color: "green",
    marginTop: 10,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
  button: {
    backgroundColor: "#C15656",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5, // Make the button rounded
    alignItems: "center",
    marginBottom: 20,
    width: "100%", // Ensure the button spans the width of its container
  },
});

export default NewPassword;
