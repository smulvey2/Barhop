import React, {useEffect} from 'react'
import { View, Image, Text, ScrollView } from 'react-native'
import { auth } from '../firebase'

const SplashScreen = ({navigation}) => {
    useEffect(()=> {
        const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              navigation.replace('App Home')
              // ...
            } else {
              // User is signed out
              // ...
              navigation.replace('Login')
            }
          });
          return unsubscribe
    },[]

    )
    return (
        <View style = {{backgroundColor: '#0992ed', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 40, color: 'white', fontFamily: 'ChalkboardSE-Bold'}}>Hopp</Text>
            <Image source={require('./../assets/HoppLogo.png')} style={{height: 200, width: 200, padding: 100, margin: 75}}/>
        </View>
        
    )
}

export default SplashScreen