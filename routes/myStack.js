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
<Stack.Navigator
screenOptions ={{headerShown: true}}>

<Stack.Screen name = "FriendsHome" component={FriendsScreen} />
<Stack.Screen name = "AddFriends" component={AddFriendsScreen} />
<Stack.Screen name = "FriendRequests" component={FriendRequests} />
<Stack.Screen name = "FriendInfo" component={FriendInfo} />

</Stack.Navigator>

    )
}

const GroupStack = () => {
    return(
        <Stack.Navigator>
        <Stack.Screen name = "GroupsHome" component={GroupScreen}/>
        <Stack.Screen name = "Add Groups" component={AddGroupsScreen}/>
        <Stack.Screen name = "FriendInfo" component={FriendInfo}/>
        <Stack.Screen name = "GroupInfo" component={GroupInfo}/>
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