import React from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import LoginScreen from './screens/LoginScreen'
import { StyleSheet } from 'react-native';
import RegisterScreen from './screens/RegisterScreen';
import RegisterPhoneScreen from './screens/RegisterPhoneScreen'
import SplashScreen from './screens/SplashScreen'
import MyTab from './routes/myTab';
import { registerRootComponent } from 'expo';
import styles from './styles/styles'

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: styles.header,
  headerTintColor: 'white',
  headerTitleStyle:{
      fontWeight: 'bold'
  },
}

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name = "Splash" component={SplashScreen} options={{headerShown: false}}/>
      <Stack.Screen name = "Login" component={LoginScreen} options={{headerTitleStyle: styles.headerTitle}} screenOptions ={{headerStyle:{backgroundColor: '#0992ed', fontFamily: 'ChalkboardSE-Bold'}, fontFamily: 'ChalkboardSE-Bold', headerTintColor: 'white', headerTitleStyle:{fontFamily: 'ChalkboardSE-Bold'}}}/>
      <Stack.Screen name = "Register" component={RegisterScreen} options={{headerTitleStyle: styles.headerTitle}} screenOptions ={{headerStyle:{backgroundColor: '#0992ed', fontFamily: 'ChalkboardSE-Bold'}, fontFamily: 'ChalkboardSE-Bold', headerTintColor: 'white', headerTitleStyle:{fontFamily: 'ChalkboardSE-Bold'}}}/>
      <Stack.Screen name = "RegisterPhoneScreen" component={RegisterPhoneScreen} options={{headerTitleStyle: styles.headerTitle}} screenOptions ={{headerStyle:{backgroundColor: '#0992ed', fontFamily: 'ChalkboardSE-Bold'}, fontFamily: 'ChalkboardSE-Bold', headerTintColor: 'white', headerTitleStyle:{fontFamily: 'ChalkboardSE-Bold'}}}/>
      <Stack.Screen name = "App Home" component={MyTab} options={{headerShown: false}}/>

      
      </Stack.Navigator>
      
    </NavigationContainer>

  );
}

registerRootComponent(App);
