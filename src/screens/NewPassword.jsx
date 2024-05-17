import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";

const NewPassword = ({ route, navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { token } = route.params; // Get the token from the navigation params

  const handleResetPassword = async () => {
    try {
      // Validation
      if (!password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
  
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      const response = await axios.patch(
        `http://192.168.1.9:3005/resetPassword/${token}`,
        { password, confirmPassword }
      );
      const data = response.data;
      if (response.status === 200 && data.success) {
        // Password reset successful
        navigation.navigate("Login"); // Navigate to login page or any other page
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
    <View style={styles.container}>
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
      <Button title="Reset Password" onPress={handleResetPassword} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default NewPassword;
