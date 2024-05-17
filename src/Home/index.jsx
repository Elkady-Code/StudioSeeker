import React from "react";
import { Text } from "react-native-paper";
import { BottomNavigation } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile"

const HomeComponent = () => <Home />;

const ProfileComponent = () => <Profile />;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

export default function Main({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "saved", title: "Saved", focusedIcon: "bookmark" },
    { key: "favourites", title: "Favourites", focusedIcon: "heart" },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "head",
      //   unfocusedIcon: "user-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeComponent,
    saved: AlbumsRoute,
    favourites: RecentsRoute,
    profile: ProfileComponent,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
