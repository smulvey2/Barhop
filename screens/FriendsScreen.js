import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet} from 'react-native'
import { auth, db } from '../firebase'
import Ionicons from 'react-native-vector-icons/Ionicons'  
import styles from '../styles/styles'
import { collection, query, setDoc, doc, updateDoc, onSnapshot, getDoc, orderBy } from "firebase/firestore";


const FriendsScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [friends, setFriends] = useState([]); // Initial empty array of users

    const switchVisible = (uid, visible) => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid.toString(), 'friends', uid)
      setDoc(userDocRef, {
          visible: !visible
      }, {merge: true})
        }

    useEffect(() => {
      (async () => {
        const r = collection(db, 'users', auth.currentUser.uid.toString(), 'friends')
        const q = query(r, orderBy('firstName'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const friends = [];
        querySnapshot.forEach((doc) => {
          friends.push({
            ...doc.data(),
            key: doc.id,
          });
        })
        setFriends(friends)
      })
      return () => unsubscribe();
      })();

        navigation.setOptions({   
          headerLeft: () => (
              <TouchableOpacity style={{marginLeft: 20, backgroundColor: 'black', padding: 5, borderRadius: 10}}
              onPress={()=>navigation.navigate('Friend Requests')}>
              <Ionicons name='notifications' size={20} color='white' />
              </TouchableOpacity>
          ),
          headerRight: () => (
              <TouchableOpacity style={{marginRight: 20, backgroundColor: 'black', padding: 5, borderRadius: 10}}
              onPress={()=>navigation.navigate('Add Friends')}>
              <Ionicons name='person-add' size={20} color='white' />
              </TouchableOpacity>
          )
      })
        // Unsubscribe from events when no longer in use
      }, []);

    return (
      <View>
        <FlatList
          data={friends}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Friend Info', {uid: item.key})} style={ styles.friends }>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
              <TouchableOpacity onPress={() => switchVisible(item.uid, item.visible)} style={{width: 50, height: 45, alignItems: 'center', justifyContent: 'center'}}>
              <Ionicons name={item.visible ? "radio-button-on-outline" : "radio-button-off-outline"} size={30}color={'#0992ed'} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        </View>
    )
}


export default FriendsScreen