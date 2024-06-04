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
import HomeNavigator from "./src/Home/index";
import NewPassword from "./src/screens/NewPassword";
import ForgotPassword from "./src/screens/forgotpassword";
import AddInstrumentScreen from "./src/screens/addInstrument";
import AddStudioScreen from "./src/screens/addStudio";
import StudioDetailsScreen from "./src/screens/studioDetails";
import Settings from "./src/screens/settings";

const Stack = createStackNavigator();
const AuthContext = React.createContext();

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
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack.Navigator initialRouteName="GetStartedScreen">
          {state.userToken == null ? (
            <>
              <Stack.Screen
                options={{ headerShown: false }}
                name="GetStarted"
                component={GetStartedScreen}
              />
              <Stack.Screen
                name="AddInstrumentScreen"
                component={AddInstrumentScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddStudioScreen"
                component={AddStudioScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="StudioDetailsScreen"
                component={StudioDetailsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
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
            <Stack.Screen
              options={{ headerShown: false }}
              name="Main"
              component={HomeNavigator}
            />
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
