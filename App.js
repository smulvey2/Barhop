import React from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import LoginScreen from './screens/LoginScreen'
import { StyleSheet } from 'react-native';
import RegisterScreen from './screens/RegisterScreen';
import MyTab from './routes/myTab';
import { registerRootComponent } from 'expo';

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
      backgroundColor: '#0992ed'
  },
  headerTintColor: 'white',
  headerTitleStyle:{
      fontWeight: 'bold'
  },
}

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name = "Login" component={LoginScreen}/>
      <Stack.Screen name = "Register" component={RegisterScreen}/>
      <Stack.Screen name = "App Home" component={MyTab} options={{headerShown: false}}/>

      
      </Stack.Navigator>
      
    </NavigationContainer>

  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
