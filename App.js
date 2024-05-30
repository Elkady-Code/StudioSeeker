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
import * as Linking from "expo-linking";
import SignIn from "./src/screens/signin";
import SignUp from "./src/screens/signup";
import HomeNavigator from "./src/Home/index";
import NewPassword from "./src/screens/NewPassword";
import ForgotPassword from "./src/screens/forgotpassword";
import * as SecureStore from "expo-secure-store";

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
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.error(e);
      }

      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        try {
          // Assume login API call here that returns a token
          const token = "dummy-auth-token";
          await SecureStore.setItemAsync("userToken", token);
          dispatch({ type: "SIGN_IN", token });
        } catch (e) {
          console.error("Error during sign-in:", e);
        }
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync("userToken");
          dispatch({ type: "SIGN_OUT" });
        } catch (e) {
          console.error("Error during sign-out:", e);
        }
      },
      signUp: async (data) => {
        try {
          // Assume sign-up API call here that returns a token
          const token = "dummy-auth-token";
          await SecureStore.setItemAsync("userToken", token);
          dispatch({ type: "SIGN_IN", token });
        } catch (e) {
          console.error("Error during sign-up:", e);
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack.Navigator initialRouteName="Splash">
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
                      login={async (data) => {
                        await authContext.signIn(data);
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
