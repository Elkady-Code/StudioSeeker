import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Text, Searchbar, Button } from "react-native-paper";
import Card from "../Components/Card";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [algoliaPosts, setAlgoliaPosts] = useState([]);

  const getAllPosts = async () => {
    var token = await SecureStore.getItemAsync("userToken");
    console.log(token);

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    axios.get("https://studioseeker-h2vx.onrender.com/viewNewStudios").then(response => {
      console.log(response.data.data[0]);
      setPosts(response.data.data);
    });
  };

  const getTrendingPosts = async () => {
    var token = await SecureStore.getItemAsync("userToken");
    console.log(token);

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    axios.get("https://studioseeker-h2vx.onrender.com/viewTrendingStudios").then(response => {
      console.log(response.data.data[0]);
      setTrendingPosts(response.data.data);
    });
  };

  const getInstruments = async () => {
    var token = await SecureStore.getItemAsync("userToken");
    console.log(token);

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    axios.get("https://studioseeker-h2vx.onrender.com/viewNewInstruments").then(response => {
      console.log(response.data.data[0]);
      setInstruments(response.data.data);
    });
  };

  const getAlgoliaPosts = async () => {
    var token = await SecureStore.getItemAsync("userToken");
    console.log(token);

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    axios.get("https://studioseeker-h2vx.onrender.com/algolia-posts").then(response => {
      console.log(response.data.data[0]);
      setAlgoliaPosts(response.data.data);
    });
  };

  useEffect(() => {
    getAllPosts();
    getTrendingPosts();
    getInstruments();
    getAlgoliaPosts();
  }, []);

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
          />
         
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* New Studios Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>New Studios</Text>
                <Text style={styles.seeAllText}>See all</Text>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {posts.map(post => {
                    return <Card key={post._id} desc={post.description} />;
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Trending Studios Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Trending Studios</Text>
                <Text style={styles.seeAllText}>See all</Text>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {trendingPosts.map(post => {
                    return <Card key={post._id} desc={post.description} />;
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Equipment Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Equipment</Text>
                <Text style={styles.seeAllText}>See all</Text>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {instruments.map(instrument => {
                    return <Card key={instrument._id} desc={instrument.description} />;
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Algolia Posts Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Algolia Posts</Text>
                <Text style={styles.seeAllText}>See all</Text>
              </View>
              <View style={styles.cardsContainer}>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={styles.cardsScrollViewContent}
                >
                  {algoliaPosts.map(post => {
                    return <Card key={post._id} desc={post.description} />;
                  })}
                </ScrollView>
              </View>
            </View>

          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

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
});
  