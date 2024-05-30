import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../imgs/logo.png";
import * as SecureStore from "expo-secure-store";

const SignIn = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      const response = await axios.post("https://studioseeker-h2vx.onrender.com/sign-in", {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        if (data.token) {
          // console.log(data);
          await SecureStore.setItemAsync("userToken", data.token);
          await SecureStore.setItemAsync("username", data.user.username);
          login();
          // Storing the username
          // Alert.alert("Success", "You have signed in successfully.");
          // navigation.navigate("Main");
        } else {
          Alert.alert("Error", "Incorrect username or password");
        }
      } else {
        Alert.alert("Error", data.message || "Sign in failed.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert(
        "Error",
        "An error occurred while signing in. Please try again later.",
      );
    }
  };

  const handleSignUpNavigation = () => {
    navigation.push("SignUp");
  };

  const handleForgotPasswordNavigation = () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.headerText}>Welcome to StudioSeeker</Text>
          <Text style={styles.subText}>Sign in to your account</Text>
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
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <TouchableOpacity onPress={handleForgotPasswordNavigation}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUpNavigation}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} StudioSeeker
          </Text>
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
  header: {
    marginBottom: 10, // Reduced margin for smaller gap
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30, // Increased marginBottom to move the logo up
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  subText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20, // Increased marginBottom for spacing
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
  signupText: {
    color: "#C15656",
    fontSize: 16,
    marginBottom: 60, // Increased marginBottom for spacing
  },
  forgotPasswordText: {
    color: "#C15656",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 50, // Increased marginBottom for spacing
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#666666",
  },
});

export default SignIn;
