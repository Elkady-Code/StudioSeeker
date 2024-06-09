import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const CheckoutConfirmation = ({ navigation }) => {
  const { params } = useRoute();

  const navigateToHome = () => {
    console.log("pressed");
    axios
      .post("https://studioseeker-h2vx.onrender.com/create-booking", {
        postId: params.post._id,
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout details</Text>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
        }}
        style={styles.checkmark}
      />
      <Text style={styles.confirmationText}>
        Your booking has been <Text style={styles.boldText}>confirmed</Text>, an
        email shortly will be sent to you for confirmation.
      </Text>
      <Text style={styles.detailsLabel}>
        Studio/Instruments booked: {params.post.name}
      </Text>
      <Text style={styles.detailsLabel}>
        Total Price:{" "}
        {params.post.rentPerHour
          ? params.post.rentPerHour
          : params.post.rentPrice}{" "}
        EGP
      </Text>
      <TouchableOpacity style={styles.confirmButton} onPress={navigateToHome}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkmark: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  detailsLabel: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  confirmButton: {
    backgroundColor: "#C15656",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default CheckoutConfirmation;
