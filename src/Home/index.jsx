// index.jsx (Main component)

import React from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile";
import FavoriteStudios from "./Favourites";
import BookingPage from "./booked";
import AddStudio from "../screens/addStudio"; // Import the AddStudio component
import AuthContext from "../../Utils/AuthContext"; // Import AuthContext

const HomeComponent = (props) => <Home {...props} />;
const ProfileComponent = (props) => <Profile {...props} />;
const BookedComponent = () => <BookingPage />;
const FavoriteStudiosComponent = () => <FavoriteStudios />;

export default function Main({ navigation, userId }) {
  const { signOut, addStudio, settings } = React.useContext(AuthContext); // Access addStudio from AuthContext
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    { key: "booked", title: "Booked", focusedIcon: "bookmark" },
    { key: "addStudio", title: "Add Studio", focusedIcon: "plus" }, // Add addStudio route
    { key: "favourites", title: "Favourites", focusedIcon: "heart" },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "head",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: (props) => (
      <HomeComponent
        {...props}
        navigation={navigation}
        addStudio={addStudio}
      />
    ),
    booked: BookedComponent,
    addStudio: AddStudio, // Render the AddStudio component
    favourites: FavoriteStudiosComponent,
    profile: (props) => (
      <ProfileComponent
        {...props}
        navigation={navigation}
        signOut={signOut}
        userId={userId}
        Settings={settings}
      />
    ),
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
