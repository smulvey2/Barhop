import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import { createStackNavigator } from '@react-navigation/stack'
import FriendsScreen from '../screens/FriendsScreen'
import AddFriendsScreen from '../screens/AddFriendsScreen'
import FriendRequests from '../screens/FriendRequests'
import FriendInfo from '../screens/FriendInfo'
import GroupScreen from '../screens/Groups/GroupScreen'
import AddGroupsScreen from '../screens/Groups/AddGroupsScreen'
import GroupInfo from '../screens/Groups/GroupInfo'

const Stack = createStackNavigator()
const screenOptionStyle = {
        headerShown: false,
}
const FriendsStack = ()=> {
    return(
<Stack.Navigator screenOptions ={{headerShown: true, headerStyle:{backgroundColor: '#0992ed'}}}>

<Stack.Screen name = "Friends" component={FriendsScreen} options={{headerTitleStyle: {fontWeight: 'bold', color: 'white'}}}/>
<Stack.Screen name = "Add Friends" component={AddFriendsScreen} options={{headerTitleStyle: {fontWeight: 'bold', color: 'white'}}}/>
<Stack.Screen name = "Friend Requests" component={FriendRequests} options={{headerTitleStyle: {fontWeight: 'bold', color: 'white'}}}/>
<Stack.Screen name = "Friend Info" component={FriendInfo} options={{headerTitleStyle: {fontWeight: 'bold', color: 'white'}}}/>

</Stack.Navigator>

    )
}

const GroupStack = () => {
    return(
        <Stack.Navigator screenOptions ={{headerShown: true, headerStyle:{backgroundColor: '#0992ed'}}}>
        <Stack.Screen name = "Groups" component={GroupScreen} options={{headerTitleStyle: {fontWeight: 'bold', color: 'white', }, headerTintColor: 'white'}}/>
        <Stack.Screen name = "New Group" component={AddGroupsScreen}/>
        <Stack.Screen name = "Friend Info" component={FriendInfo}/>
        <Stack.Screen name = "Group" component={GroupInfo}/>
        </Stack.Navigator>
    )}
const HomeStack = () => {
    return(
        <Stack.Navigator
        screenOptions ={screenOptionStyle}>
        <Stack.Screen name = "Map" component={HomeScreen}/>
        </Stack.Navigator>
    )}


const ProfileStack = () => {
    return(
        <Stack.Navigator
        screenOptions ={screenOptionStyle}>
            <Stack.Screen name = "ProfileScreen" component={ProfileScreen}/>
        </Stack.Navigator>
    )}

    export {HomeStack, ProfileStack, FriendsStack, GroupStack}