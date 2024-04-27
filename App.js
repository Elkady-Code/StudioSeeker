import React from "react";
import { StyleSheet, SafeAreaView, ScrollView, Image, View, Text} from 'react-native';
import { Button } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from './src/screens/signin';
import SignUp from "./src/screens/signup";
import ResetPassword from "./src/screens/ResetPassword";
import NewPassword from "./src/screens/NewPassword";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* 
         */}

        <Stack.Screen options={{headerShown:false}} name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const SplashScreen = () => {
  // Your splash screen implementation
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./src/imgs/loadingscr.png')} 
      />
    </View>
  );
};

const GetStartedScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('SignIn'); 
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('./src/imgs/loadingscr.png')} 
          />
        </View>
        <Button style={styles.buttonContainer} theme={{ colors: { primary: '#C15656' } }} mode="contained" onPress={handlePress}>
          Get Started
        </Button>
        <Text style={styles.footer}>
        © [2024] [StudioSeeker]
        </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  footer:{
    marginTop: 165,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15
  }
});
