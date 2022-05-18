import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { auth, db } from '../../firebase'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../../styles/styles'
import { collection, query, getDocs, doc, updateDoc, setDoc, getDoc, orderBy, onSnapshot } from "firebase/firestore";



const GroupScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [groups, setGroups] = useState([]); // Initial empty array of users

  const getGroupMembers = async (groupName) => {
    const groupRef = collection(db, 'users', auth.currentUser.uid.toString(), 'groups', groupName, 'members')
    const groupQuery = await getDocs(groupRef)
    return groupQuery.docs.map(doc => doc.data());
  }

  const switchVisible = async (groupName, visible) => {
    const userDocRef = doc(db, 'users', auth.currentUser.uid.toString(), 'groups', groupName)
    setDoc(userDocRef, {
        visible: !visible
    }, {merge: true})
    let group = await getGroupMembers(groupName)
    group.forEach(member => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid.toString(), 'friends', member.uid)
      setDoc(userDocRef, {
          visible: !visible
      }, {merge: true})
    })
  }

  useEffect(() => {
    (async () => {
      const r = collection(db, 'users', auth.currentUser.uid.toString(), 'groups')
      const q = query(r, orderBy('groupName'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push({
          ...doc.data(),
          key: doc.id,
        });
      })
      setGroups(friends)
      setLoading(false)
    })
    return () => unsubscribe();
    })();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{marginRight: 20, backgroundColor: 'black', padding: 5, borderRadius: 10}}
          onPress={() => navigation.navigate('New Group')}>
          <Ionicons name='add-circle' size={20} color='white' />
        </TouchableOpacity>
      )
    })
  }, [])

  if (loading) {
    return <ActivityIndicator />;
  }


  return (
    <FlatList
      data={groups}
      style={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Group', { groupName: item.key })} style={styles.friends}>
          <Text style={styles.listsTextBlack}>{item.key}</Text>
          <TouchableOpacity onPress={() => switchVisible(item.groupName, item.visible)} style={{width: 50, height: 45, alignItems: 'center', justifyContent: 'center'}}>
            <Ionicons name={item.visible ? "radio-button-on-outline" : "radio-button-off-outline"} size={30} color={'#0992ed'} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />

  )
}


export default GroupScreen