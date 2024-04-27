import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, TextInput, Alert, View } from "react-native";
import Parse from "parse/react-native";
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      const user = await Parse.User.logIn(email, password);
      Alert.alert("Success", "You have signed in successfully.");
      
      // Navigate to another screen (e.g., HomeScreen)
      navigation.navigate('home'); // Replace 'HomeScreen' with the name of your home screen
    } catch (error) {
      // Error signing in
      Alert.alert("Error", error.message);
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('SignUp'); // Navigate to the existing SignUp screen
  };

  const handleForgotPasswordNavigation = () => {
    navigation.navigate('ResetPassword'); // Navigate to the existing ResetPassword screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Enter your credentials to login</Text>
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
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUpNavigation}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} StudioSeeker</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    marginTop: 12,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
    textAlign: 'center',
  },
  signupText: {
    color: "#C15656",
    marginTop: 10,
    fontSize: 16,
  },
  forgotPasswordText: {
    color: "#C15656",
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default SignIn;
