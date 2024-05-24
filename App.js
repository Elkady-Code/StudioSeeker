import React from 'react';
import { StyleSheet, SafeAreaView, Image, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
import SignIn from './src/screens/signin';
import SignUp from './src/screens/signup';
import HomeNavigator from './src/Home/index';
import NewPassword from './src/screens/newpassword';
import ForgotPassword from './src/screens/forgotpassword';

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
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        SignIn: 'sign-in',
        SignUp: 'sign-up',
        ResetPassword: 'reset-password/:token',
        Main: 'main',
        GetStarted: 'get-started',
      },
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen options={{ headerShown: false }} name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen options={{ headerShown: false }} name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={() => navigation.navigate("SignIn")} />,
            title: "", 
          })} />
        <Stack.Screen
          name="ResetPassword"
          component={ForgotPassword}
          options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={() => navigation.navigate("SignIn")} />,
            title: "", 
          })}
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={() => navigation.navigate("SignIn")} />,
            title: "",
          })}
        />
        <Stack.Screen options={{ headerShown: false }} name="Main" component={HomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const GetStartedScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('./src/imgs/loadingscr.png')} />
      </View>
      <Button
        style={styles.buttonContainer}
        theme={{ colors: { primary: '#C15656' } }}
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
