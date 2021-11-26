import React, {useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeStack, FriendsStack, ProfileStack, GroupStack} from './myStack'
import { Button, TouchableOpacity, View} from 'react-native'
import { Avatar, Image } from 'react-native-elements'
import { auth, db } from '../firebase'
import {AntDesign, FontAwesome5} from '@expo/vector-icons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



const MyTab = ({navigation}) => {
    const Tab = createMaterialTopTabNavigator()

    const signOut = ()=> {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
        .catch((error) => {

        })
    }

    const screenOptionStyle = { 
        headerShown: true,
        headerStyle: {
            backgroundColor: '#0992ed'
        },
        headerTintColor: 'white',
        headerTitleStyle:{
            fontWeight: 'bold'
        },
        headerLeft: () => (
            <View style={{marginLeft: 20}}>
                <Avatar
                rounded
                source ={{uri: auth?.currentUser?.photoURL}}/>
                </View>
          ),
          headerRight: () => (
            <TouchableOpacity style={{marginRight: 20}}
                onPress={signOut}
                >
                <AntDesign name = 'setting' size={24} color='black'/>
                </TouchableOpacity>
          ),
          
}
    return(

        <Tab.Navigator
        tabBarPosition='bottom'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home-outline'
                : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'man-outline' : 'man-outline';
            }
            else if (route.name === 'Friends') {
              iconName = focused ? 'body-outline' : 'body-outline';
            }
            else if (route.name === 'Groups') {
              iconName = focused ? 'person-add-outline' : 'person-add-outline';
            }
            
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={20} color={color} />;
          },
          tabBarActiveTintColor: '#0992ed',
          tabBarInactiveTintColor: 'gray',
        })}
      >
            <Tab.Screen name ="Home" component = {HomeStack}/>
            <Tab.Screen screenOptions={{headerShown:false}} name ="Friends" component = {FriendsStack}/>
            <Tab.Screen name ="Groups" component = {GroupStack}/>
            <Tab.Screen name = "Profile" component={ProfileStack}/>
        </Tab.Navigator>
    )
}

export default MyTab