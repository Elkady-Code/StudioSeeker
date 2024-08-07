import React from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile";
import FavoriteStudios from "./Favourites";
import BookingPage from "./booked";
import AuthContext from "../../Utils/AuthContext"; 

const HomeComponent = (props) => <Home {...props} />;
const ProfileComponent = (props) => <Profile {...props} />;
const BookedComponent = () => <BookingPage />;
const FavoriteStudiosComponent = () => <FavoriteStudios />;

export default function Main({ navigation, userId }) {
  const { signOut, addStudio, settings, addInstrument, } = React.useContext(AuthContext); 
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
    home: (props) => (
      <HomeComponent
        {...props}
        navigation={navigation}
        addStudio={addStudio}
        addInstrument={addInstrument}
      />
    ),
    booked: BookedComponent,
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
