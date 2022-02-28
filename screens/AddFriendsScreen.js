import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'  
import FriendsScreen from './FriendsScreen'
import { AnimatedRegion } from 'react-native-maps'


const AddFriendsScreen = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [users, setUsers] = useState([]); // Initial empty array of users
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [photoURL, setPhotoURL] = useState('')
const [friends, setFriends] = useState([])
const [requests, setRequests] = useState([])

const sendRequest = (item) => {
  db.collection("users").doc(item.key).collection('friendRequests').doc(auth?.currentUser?.uid).set({
    firstName: firstName,
    lastName: lastName,
    uid: auth.currentUser.uid,
    photoURL: photoURL
})
db.collection("users").doc(auth?.currentUser?.uid).collection('sentRequests').doc(item.key).set({
  firstName: item.firstName,
  lastName: item.lastName,
  uid: item.key,
  photoURL: item.photoURL
})
}

const removeRequest = (item) => {
  db.collection("users").doc(item.uid).collection('friendRequests').doc(auth?.currentUser?.uid).delete()
  db.collection("users").doc(auth?.currentUser?.uid).collection('sentRequests').doc(item.key).delete()
}

useEffect(() => { 
    const subscriber = db.collection('users').orderBy('firstName')
      .onSnapshot(querySnapshot => {
        const users = [];

      querySnapshot.forEach(documentSnapshot => {
        if(documentSnapshot.id != auth.currentUser.uid){
        users.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      }
      else {
        setFirstName(documentSnapshot.data().firstName)
        setLastName(documentSnapshot.data().lastName)
        setPhotoURL(documentSnapshot.data().photoURL)
      }
      })
      
      setUsers(users)
      setLoading(false)        

    })   

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => { 
    const subscriber = db.collection('users').doc(auth?.currentUser?.uid).collection('friends')
      .onSnapshot(querySnapshot => {
        const friends = [];

      querySnapshot.forEach(documentSnapshot => {
        friends.push(
          documentSnapshot.id,
        );
      })
      
      setFriends(friends)
      setLoading(false)        

    })   

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => { 
    const subscriber = db.collection('users').doc(auth?.currentUser?.uid).collection('sentRequests')
      .onSnapshot(querySnapshot => {
        const requests = [];

      querySnapshot.forEach(documentSnapshot => {
        requests.push(
          documentSnapshot.id
        );
      })
      
      setRequests(requests)
      setLoading(false)        
    })   

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }


  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('FriendInfo', {uid: item.key})} style={{ height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 1, padding: 10, justifyContent: 'space-between'}}>
          <Text style={{fontSize: 20}}>{item.firstName} {item.lastName}</Text>
          <TouchableOpacity onPress={friends.includes(item.key) ? () => navigation.navigate('FriendInfo', {uid: item.key}) : requests.includes(item.key) ?  () => removeRequest(item) : () => sendRequest(item)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name= {friends.includes(item.key) ? "checkmark-circle-outline" : requests.includes(item.key) ? "remove-circle-outline" : "add-circle-outline"} size={30}></Ionicons>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  )
}

export default AddFriendsScreen