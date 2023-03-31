import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home/Home';
import Profile from './Screens/Profile/Profile';
import Chat from './Screens/Chat/Chat';
import SplashScreen from './Screens/SplashScreen/SplashScreen';
import WelcomeScreen from './Screens/WelcomeScreen/WelcomeScreen';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen/RegistraionScreen';
import SetupProfileScreen from './Screens/RegistrationScreen/SetupProfileScreen';
import ContactScreen from './Screens/ContactScreen/ContactScreen'
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux'

const Stack = createNativeStackNavigator()

function App() {

  const currentUser = useSelector((state) => state.currentUser.currentUser)

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }, [])

  

  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          { currentUser == null && <Stack.Screen name="SplashScreen" component={SplashScreen} />}
          { currentUser != null && currentUser != 'noUserLoggedIn' && <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="ContactScreen" component={ContactScreen} />
          </> }
          { currentUser == 'noUserLoggedIn' && <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
            <Stack.Screen name="SetupProfileScreen" component={SetupProfileScreen} />
          </>}
          
        </Stack.Navigator>
      </NavigationContainer>  
  );
}

export default App;
