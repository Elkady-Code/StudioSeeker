import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { Text } from "react-native-paper";
import { Searchbar } from "react-native-paper";
import Card from "../components/Card";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <KeyboardAvoidingView>
      <SafeAreaView>
        <View style={{ width: "90%", alignSelf: "center" }}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <ScrollView
            contentContainerStyle={{
              height: Dimensions.get("screen").height * 1.1,
            }}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>New Studios</Text>
                <Text>See all</Text>
              </View>
              <View>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{ gap: 18 }}
                >
                  <Card />
                  <Card />
                  <Card />
                </ScrollView>
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Trending Studios</Text>
                <Text>See all</Text>
              </View>
              <View>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{ gap: 18 }}
                >
                  <Card />
                  <Card />
                  <Card />
                </ScrollView>
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Equipment</Text>
                <Text>See all</Text>
              </View>
              <View>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{ gap: 18 }}
                >
                  <Card />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
