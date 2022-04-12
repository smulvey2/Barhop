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
import styles from '../styles/styles'

const Stack = createStackNavigator()
const screenOptionStyle = {
        headerShown: false,
}
const FriendsStack = ()=> {
    return(
<Stack.Navigator screenOptions ={{headerShown: true, headerStyle:{backgroundColor: '#0992ed'}, headerTintColor: 'white'}}>

<Stack.Screen name = "Friends" component={FriendsScreen} options={{headerTitleStyle: styles.headerTitle}}/>
<Stack.Screen name = "Add Friends" component={AddFriendsScreen} options={{headerTitleStyle: styles.headerTitle}}/>
<Stack.Screen name = "Friend Requests" component={FriendRequests} options={{headerTitleStyle: styles.headerTitle}}/>
<Stack.Screen name = "Friend Info" component={FriendInfo} options={{headerTitleStyle: styles.headerTitle}}/>

</Stack.Navigator>

    )
}

const GroupStack = () => {
    return(
        <Stack.Navigator screenOptions ={{headerShown: true, headerStyle:{backgroundColor: '#0992ed'}, headerTintColor: 'white', headerTitleStyle:{fontFamily: 'ChalkboardSE-Bold'}}}>
        <Stack.Screen name = "Groups" component={GroupScreen} options={{headerTitleStyle: styles.headerTitle}}/>
        <Stack.Screen name = "New Group" component={AddGroupsScreen} options={{headerTitleStyle: styles.headerTitle}}/>
        <Stack.Screen name = "Friend Info" component={FriendInfo} options={{headerTitleStyle: styles.headerTitle}}/>
        <Stack.Screen name = "Group" component={GroupInfo} options={{headerTitleStyle: styles.headerTitle}}/>
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
        screenOptions ={{headerShown: true, headerStyle:{backgroundColor: '#0992ed'}, headerTintColor: 'white', fontFamily: 'ChalkboardSE-Bold', headerTitleStyle:{fontFamily: 'ChalkboardSE-Bold'}}}>
            <Stack.Screen name = "Profile" component={ProfileScreen} options={{headerTitleStyle: styles.headerTitle}}/>
        </Stack.Navigator>
    )}

    export {HomeStack, ProfileStack, FriendsStack, GroupStack}