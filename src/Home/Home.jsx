import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, Searchbar } from "react-native-paper";
import Card from "../Components/Card";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const HomeComponent = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const searchPosts = async (searchQuery) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  
      const data = JSON.stringify({
        "requests": [
          {
            "indexName": "studioseeker",
            "params": `query=${searchQuery}`
          }
        ]
      });
  
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ZMBF7ETARP-dsn.algolia.net/1/indexes/*/queries',
        headers: { 
          'X-Algolia-API-Key': 'c3ebf897de45f642997877435d1623ea', 
          'X-Algolia-Application-Id': 'ZMBF7ETARP'
        },
        data : data
      };
  
      const response = await axios.request(config);
      const searchData = response.data.results;
      console.log(searchData);
      // setPosts(searchData); // Replace current posts with search results
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  const fetchStudioDetails = async id => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await axios.get(
        `https://studioseeker-h2vx.onrender.com/studios/${id}`,
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching studio details:", error);
      throw error; // Throw the error instead of returning null
    }
  };

  const getAllPosts = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await axios.get(
        "https://studioseeker-h2vx.onrender.com/viewNewStudios",
      );

      console.log(response.data.data);
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching new posts:", error);
    }
  };

  const getTrendingPosts = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await axios.get(
        "https://studioseeker-h2vx.onrender.com/viewTrendingStudios",
      );

      setTrendingPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    }
  };

  const getInstruments = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await axios.get(
        "https://studioseeker-h2vx.onrender.com/viewNewInstruments",
      );

      setInstruments(response.data.data);
    } catch (error) {
      console.error("Error fetching instruments:", error);
    }
  };

  useEffect(() => {
    getAllPosts();
    getTrendingPosts();
    getInstruments();
  }, []);

  useEffect(() => {
    searchPosts("hello");
  }, [searchQuery]);

  const navigateToaddStudio = () => {
    navigation.navigate("addStudio");
  };

  const navigatetoaddInstrument = () => {
    navigation.navigate("addInstrument");
  };

  const navigatToEquipment = () => {
    navigation.navigate("Equipment");
  };

  const navigatetNewStudios = () => {
    navigation.navigate("NewStudios");
  };

  const navigatetTrendingStudios = () => {
    navigation.navigate("TrendingStudios");
  };

  const navigatetoStudioDetails = async id => {
    console.log(`Navigating to studio details with ID: ${id}`);
    const studio = await fetchStudioDetails(id);
    if (studio) {
      navigation.navigate("StudioDetailsScreen", { studioId: id });
    } else {
      console.error("Studio not found");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.contentContainer}>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={searchPosts}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToaddStudio}
            >
              <Text style={styles.buttonText}>Add Studio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={navigatetoaddInstrument}>
                Add Instrument
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* New Studios Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>New Studios</Text>
                <TouchableOpacity onPress={navigatetNewStudios}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {posts &&
                    posts.length > 0 &&
                    posts.map(post => {
                      return (
                        <Card
                          info={post.name}
                          key={post._id}
                          image={post.images[0]}
                          onPress={() => {
                            navigation.push("StudioDetailsScreen", {
                              studioId: post._id,
                              post: post,
                            });
                          }}
                        />
                      );
                    })}
                </ScrollView>
              </View>
            </View>

            {/* Trending Studios Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Trending Studios</Text>
                <TouchableOpacity onPress={navigatetTrendingStudios}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {trendingPosts &&
                    trendingPosts.length > 0 &&
                    trendingPosts.map(post => {
                      return (
                        <Card
                          info={post.name}
                          key={post._id}
                          image={post.images[0]}
                          onPress={() => {
                            navigation.push("StudioDetailsScreen", {
                              studioId: post._id,
                            });
                          }}
                        />
                      );
                    })}
                </ScrollView>
              </View>
            </View>

            {/* Equipment Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Equipment</Text>
                <TouchableOpacity onPress={navigatToEquipment}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {instruments &&
                    instruments.length > 0 &&
                    instruments.map(instrument => {
                      return (
                        <TouchableOpacity
                          key={instrument._id}
                          onPress={() =>
                            navigatetoStudioDetails(instrument._id)
                          }
                        >
                          <Card
                            info={instrument.name}
                            image={instrument.images[0]}
                          />
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingTop: StatusBar.currentHeight + 10,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#C15656",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 16,
    color: "blue",
  },
  cardsContainer: {
    marginTop: 10,
  },
  cardsScrollViewContent: {
    gap: 18,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default HomeComponent;
