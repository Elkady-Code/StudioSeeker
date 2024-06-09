import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const Equipment = ({ navigation }) => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await axios.get(
          "https://studioseeker-h2vx.onrender.com/viewNewInstruments",
        );
        setInstruments(response.data.data);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  const renderInstrument = ({ item }) => (
    <TouchableOpacity
      style={styles.equipmentCard}
      onPress={() => {
        navigation.push("StudioDetailsScreen", {
          studioId: item._id,

          post: item,
        });
      }}
    >
      <Image style={styles.circle} source={{ uri: item.images[0] }} />
      <View style={styles.details}>
        <Text style={styles.instrumentName}>{item.name}</Text>
        <Text style={styles.instrumentDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>EQUIPMENT</Text>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={instruments}
                renderItem={renderInstrument}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  equipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 20,
  },
  details: {
    flex: 1,
  },
  instrumentName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  instrumentDescription: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Equipment;
