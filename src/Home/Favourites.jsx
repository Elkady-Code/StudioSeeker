// FavoriteStudios.js
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const FavoriteStudios = () => {
  const navigation = useNavigation();

  const studios = [
    {
      id: 1,
      name: "Studio A",
      details: "This is Studio A",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      name: "Studio B",
      details: "This is Studio B",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      name: "Studio C",
      details: "This is Studio C",
      image: "https://picsum.photos/200/300",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Favorite Studios/Instrument</Text>
        <Image
          source={{ uri: "https://example.com/user-avatar.png" }}
          style={styles.avatar}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {studios.map((studio) => (
          <Card key={studio.id} style={styles.card}>
            <Card.Title title={studio.name} />
            <Card.Cover source={{ uri: studio.image }} />
            <Card.Content>
              <Text>{studio.details}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
  },
});

export default FavoriteStudios;
