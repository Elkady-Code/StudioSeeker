import React from "react";
import { Text } from "react-native-paper";
import { BottomNavigation } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile";
import FavoriteStudios from "./Favourites";
import BookingPage from "./booked";

const HomeComponent = () => <Home />;
const ProfileComponent = () => <Profile />;
const BookedComponent = () => <BookingPage />;
const FavoriteStudiosComponent = () => <FavoriteStudios />;

export default function Main() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "booked", title: "Booked", focusedIcon: "bookmark" },
    { key: "favourites", title: "Favourites", focusedIcon: "heart" },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "head",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeComponent,
    booked: BookedComponent,
    favourites: FavoriteStudiosComponent,
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
