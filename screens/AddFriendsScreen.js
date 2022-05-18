import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'  
import FriendsScreen from './FriendsScreen'
import { AnimatedRegion } from 'react-native-maps'
import styles from '../styles/styles'
import { collection, query, setDoc, doc, updateDoc, onSnapshot, getDoc, orderBy, deleteDoc } from "firebase/firestore";



const AddFriendsScreen = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [users, setUsers] = useState([]); // Initial empty array of users
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [friends, setFriends] = useState([])
const [requests, setRequests] = useState([])

const sendRequest = (item) => {
  setDoc(doc(db, 'users', item.key, 'friendRequests', auth.currentUser.uid.toString()), {
    firstName: firstName,
    lastName: lastName,
    uid: auth.currentUser.uid,
})
setDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'sentRequests', item.key), {
  firstName: item.firstName,
  lastName: item.lastName,
  uid: item.key,
  photoURL: item.photoURL
})
}

const removeRequest = (item) => {
  deleteDoc(doc(db, 'users', item.key, 'friendRequests', auth.currentUser.uid.toString()))
  deleteDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'sentRequests', item.key))
}

useEffect(() => { 
  (async () => {
    const r = collection(db, 'users')
    const q = query(r, orderBy('firstName'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const friends = [];
    querySnapshot.forEach((doc) => {
      if(doc.id != auth.currentUser.uid){
      friends.push({
        ...doc.data(),
        key: doc.id,
      });
    }
    else{
      setFirstName(doc.data().firstName)
      setLastName(doc.data().lastName)
    }
    })
    setUsers(friends)
    setLoading(false)
  })
  return () => unsubscribe();
  })(); 
  }, []);

  useEffect(() => { 
    (async () => {
      const r = collection(db, 'users', auth.currentUser.uid.toString(), 'friends')
      const q = query(r, orderBy('firstName'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push(
          doc.id
        );
      })
      setFriends(friends)
    })
    return () => unsubscribe();
    })();
  }, []);

  useEffect(() => { 
      (async () => {
        const r = collection(db, 'users', auth.currentUser.uid.toString(), 'sentRequests')
        const q = query(r, orderBy('firstName'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const friends = [];
        querySnapshot.forEach((doc) => {
          friends.push(
                doc.id
          );
        })
        setRequests(friends)
      })
      return () => unsubscribe();
      })();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }


  return (
    <FlatList
      data={users}
      style={styles.list}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Friend Info', {uid: item.key})} style={styles.friends}>
          <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
          <TouchableOpacity onPress={friends.includes(item.key) ? () => navigation.navigate('Friend Info', {uid: item.key}) : requests.includes(item.key) ?  () => removeRequest(item) : () => sendRequest(item)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name= {friends.includes(item.key) ? "checkmark-circle-outline" : requests.includes(item.key) ? "remove-circle-outline" : "add-circle-outline"} size={30}></Ionicons>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  )
}

export default AddFriendsScreen