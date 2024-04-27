import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, TextInput, Alert, View } from "react-native";
import Parse from "parse/react-native";
import { useNavigation } from '@react-navigation/native';
import PickerSelect from 'react-native-picker-select';
import Flag from 'react-native-flags';

const countryCodes = [
  { label: 'United States (+1)', value: '+1', flag: 'US' },
  { label: 'United Kingdom (+44)', value: '+44', flag: 'GB' },
  { label: 'Egypt (+20)', value: '+20', flag: 'EG' },
  { label: 'Saudi Arabia (+966)', value: '+966', flag: 'SA' },
  // Add more country codes as needed
];

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1"); // Default country code
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const user = new Parse.User();
      user.set("username", username);
      user.set("email", email);
      user.set("password", password);
      user.set("confirm password", confirmpassword);
      user.set("phone number", countryCode + phonenumber); // Combine country code and phone number

      await user.signUp();
      
      // Successfully signed up
      Alert.alert("Success", "You have signed up successfully.");
      
      // Navigate to another screen (e.g., HomeScreen)
      navigation.navigate('home'); // Replace 'HomeScreen' with the name of your home screen
    } catch (error) {
      // Error signing up
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign Up</Text>
        <Text style={styles.subHeaderText}>Create an account to get started</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
        />
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
        <TextInput
          style={styles.input}
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry
        />
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCodeContainer}>
            <PickerSelect
              value={countryCode}
              onValueChange={setCountryCode}
              items={countryCodes.map(({ label, value, flag }) => ({
                label: (
                  <View style={styles.countryCodeOption}>
                    <Flag code={flag} size={24} />
                    <Text>{label}</Text>
                  </View>
                ),
                value
              }))}
            />
          </View>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            value={phonenumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone number"
            keyboardType="numeric"
            autoCapitalize="none"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
  phoneInput: {
    flex: 1,
  },
  countryCodeContainer: {
    width: 100, // Adjust the width as needed
    marginRight: 10,
  },
  countryCodeOption: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default SignUp;





