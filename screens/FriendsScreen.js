import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet} from 'react-native'
import { auth, db } from '../firebase'
import Ionicons from 'react-native-vector-icons/Ionicons'  
import styles from '../styles/styles'

const FriendsScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [friends, setFriends] = useState([]); // Initial empty array of users


    const switchVisible = (uid, visible) => {
        db.collection('users').doc(auth?.currentUser?.uid).collection('friends').doc(uid).update({
          visible: !visible
        })
        }

    useEffect(() => {
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
        const subscriber = db.collection('users').doc(auth?.currentUser?.uid).collection('friends').orderBy('firstName')
          .onSnapshot(querySnapshot => {
            const friends = [];
    
          querySnapshot.forEach(documentSnapshot => {
            friends.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
    
          setFriends(friends)
          setLoading(false)        
    
        })
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
    
      if (loading) {
        return <ActivityIndicator />;
      }

    return (
      <View>
        <FlatList
          data={friends}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Friend Info', {uid: item.key})} style={ styles.friends }>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
              <TouchableOpacity onPress={() => switchVisible(item.uid, item.visible)}>
              <Ionicons name={item.visible ? "radio-button-on-outline" : "radio-button-off-outline"} size={30}color={'#0992ed'} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        </View>
    )
}


export default FriendsScreen