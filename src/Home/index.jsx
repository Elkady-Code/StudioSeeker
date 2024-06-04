import React from "react";
import { Text } from "react-native-paper";
import { BottomNavigation } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile";
import FavoriteStudios from "./Favourites"; // Import the new screen
import BookingPage from "./booked"; // Import the BookingPage component
import SignIn from "../screens/signin";


const HomeComponent = () => <Home />;

const ProfileComponent = () => <Profile />;

const BookedComponent = () => <BookingPage />; // Define the new component for booking

const FavoriteStudiosComponent = () => <FavoriteStudios />; // Define the new component

export default function Main() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "booked", title: "Booked", focusedIcon: "bookmark" }, // Updated key to match
    { key: "favourites", title: "Favourites", focusedIcon: "heart" },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "head",
      // unfocusedIcon: "user-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeComponent,
    booked: BookedComponent, // Updated key to match
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
