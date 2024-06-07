import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import SignIn from "./src/screens/signin";
import SignUp from "./src/screens/signup";
import HomeComponent from "./src/Home/Home";
import NewPassword from "./src/screens/NewPassword";
import ForgotPassword from "./src/screens/forgotpassword";
import addInstrument from "./src/screens/addInstrument";
import addStudio from "./src/screens/addStudio";
import StudioDetailsScreen from "./src/screens/studioDetails";
import Settings from "./src/screens/settings";
import AuthContext from "./Utils/AuthContext";
import Equipment from "./src/screens/seeAllInstruments";
import NewStudios from "./src/screens/seeAllStudios";
import TrendingStudios from "./src/screens/seeAllTrendingStudios";
import Main from "./src/Home/index"; 


const Stack = createStackNavigator();

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingLeft: 15 }}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default function App() {
  const linking = {
    prefixes: [Linking.createURL("/")],
    config: {
      screens: {
        SignIn: "sign-in",
        SignUp: "sign-up",
        ResetPassword: "reset-password/:token",
        Main: "main",
        GetStarted: "get-started",
      },
    },
  };

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            userId: action.userId,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userId: action.userId,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userId: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userId: null,
      studios: [],
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken, userId;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
        userId = await SecureStore.getItemAsync("userId");
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: "RESTORE_TOKEN", token: userToken, userId });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        const userId = "user-id-from-signin"; // Replace with actual userId
        await SecureStore.setItemAsync("userId", userId); // Store userId
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token", userId });
      },
      signOut: () => {
        SecureStore.deleteItemAsync("userId");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        const userId = "user-id-from-signup"; // Replace with actual userId
        await SecureStore.setItemAsync("userId", userId); // Store userId
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token", userId });
      },
      addStudio: (studio) => {
        dispatch({ type: "ADD_STUDIO", studio });
      },
      addInstrument: (instrument) => {
        dispatch({ type: "ADD_INSTRUMENT", instrument });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack.Navigator initialRouteName="GetStarted">
          {state.userToken == null ? (
            <>
              <Stack.Screen
                options={{ headerShown: false }}
                name="GetStarted"
                component={GetStartedScreen}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="SignIn"
                component={({ navigation }) => {
                  return (
                    <SignIn
                      navigation={navigation}
                      login={() => {
                        dispatch({
                          type: "SIGN_IN",
                          token: "dummy-auth-token",
                        });
                      }}
                    />
                  );
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <BackButton onPress={() => navigation.navigate("SignIn")} />
                  ),
                  title: "",
                })}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ForgotPassword}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <BackButton onPress={() => navigation.navigate("SignIn")} />
                  ),
                  title: "",
                })}
              />
              <Stack.Screen
                name="NewPassword"
                component={NewPassword}
                options={({ navigation }) => ({
                  headerLeft: () => (
                    <BackButton onPress={() => navigation.navigate("SignIn")} />
                  ),
                  title: "",
                })}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Main"
                component={Main} 
              />
              <Stack.Screen
                name="addInstrument"
                component={addInstrument}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="addStudio"
                component={addStudio}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="StudioDetailsScreen"
                component={StudioDetailsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Equipment"
                component={Equipment}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NewStudios"
                component={NewStudios}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TrendingStudios"
                component={TrendingStudios}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const GetStartedScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("./src/imgs/loadingscr.png")}
        />
      </View>
      <Button
        style={styles.buttonContainer}
        theme={{ colors: { primary: "#C15656" } }}
        mode="contained"
        onPress={handlePress}
      >
        Get Started
      </Button>
      <Text style={styles.footer}>© 2024 StudioSeeker</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 250,
  },
  image: {
    width: 260,
    height: 260,
  },
  buttonContainer: {
    marginTop: 20,
  },
  footer: {
    marginTop: 165,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15,
  },
});
