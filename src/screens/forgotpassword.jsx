import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, TextInput, Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

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
      const response = await axios.post("http://192.168.1.9:3005/forgotPassword", { email });
      const data = response.data;
  
      // Handle response
      if (response.status === 200) {
        if (data.status === "success") {
          Alert.alert("Success", "Password reset link has been sent to your email.");
        } else {
          Alert.alert("Error", data.message || "An error occurred while sending the email. Please try again later.");
        }
      } else {
        Alert.alert("Error", data.message || `Request failed with status code ${response.status}`);
      }
    } catch (error) {
      if (error.response.status === 404) {
        Alert.alert("Error", "Account not linked to the given email");
      } else {
        console.error("Error sending email:", error);
        Alert.alert("Error", "An error occurred while sending the email. Please try again later.");
      }
    }
  };    
    

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Reset Your Password</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 StudioSeeker</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
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
  },
  button: {
    backgroundColor: "#C15656",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 7,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
});

export default ForgotPassword;
