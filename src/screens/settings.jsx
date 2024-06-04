import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, KeyboardAvoidingView } from "react-native";
import axios from "axios";

const Settings = ({ userId }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://studioseeker-h2vx.onrender.com/users/${userId}`);
        const userData = response.data;
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
        setAddress(userData.address);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data. Please try again later.");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateEmail = async () => {
    try {
      await axios.post("https://studioseeker-h2vx.onrender.com/settings/email", {
        userId,
        newEmail: email,
      });
      Alert.alert("Success", "Email updated successfully.");
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", "Failed to update email. Please try again later.");
    }
  };

  const handleUpdatePhoneNumber = async () => {
    try {
      await axios.post("https://studioseeker-h2vx.onrender.com/settings/phone", {
        userId,
        newPhoneNumber: phoneNumber,
      });
      Alert.alert("Success", "Phone number updated successfully.");
    } catch (error) {
      console.error("Error updating phone number:", error);
      Alert.alert("Error", "Failed to update phone number. Please try again later.");
    }
  };

  const handleUpdateAddress = async () => {
    try {
      await axios.post("https://studioseeker-h2vx.onrender.com/settings/address", {
        userId,
        newAddress: address,
      });
      Alert.alert("Success", "Address updated successfully.");
    } catch (error) {
      console.error("Error updating address:", error);
      Alert.alert("Error", "Failed to update address. Please try again later.");
    }
  };

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={editMode ? email : `Your email: ${email}`} // Display user's email when not in edit mode
            onChangeText={setEmail}
            editable={editMode} // Allow editing only in edit mode
            placeholder="Enter your email"
          />
          {editMode && (
            <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
              <Text style={styles.buttonText}>Update Email</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={editMode ? phoneNumber : `Your phone number: ${phoneNumber}`} // Display user's phone number when not in edit mode
            onChangeText={setPhoneNumber}
            editable={editMode}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          {editMode && (
            <TouchableOpacity style={styles.button} onPress={handleUpdatePhoneNumber}>
              <Text style={styles.buttonText}>Update Phone Number</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={editMode ? address : `Your address: ${address}`} // Display user's address when not in edit mode
            onChangeText={setAddress}
            editable={editMode}
            placeholder="Enter your address"
            multiline
          />
          {editMode && (
            <TouchableOpacity style={styles.button} onPress={handleUpdateAddress}>
              <Text style={styles.buttonText}>Update Address</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.editButton} onPress={handleEditMode}>
            <Text style={styles.editButtonText}>{editMode ? "Done" : "Edit"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  editButtonText: {
    color: "blue",
    fontSize: 16,
  },
});

export default Settings;
