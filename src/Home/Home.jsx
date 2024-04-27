import React from "react";
import { Dimensions, SafeAreaView, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { Searchbar } from "react-native-paper";
import Card from "../Components/Card";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <SafeAreaView>
      <View
        style={{
          width: "90%",
          alignSelf: "center",
        }}
      >
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
          <View
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>title</Text>
              <Text>view more</Text>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  gap: 10,
                }}
              >
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>title</Text>
              <Text>view more</Text>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  gap: 10,
                }}
              >
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>title</Text>
              <Text>view more</Text>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  gap: 10,
                }}
              >
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
