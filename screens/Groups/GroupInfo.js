import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image} from 'react-native'
import { auth, db } from '../../firebase'
import styles from '../../styles/styles'
import Ionicons from 'react-native-vector-icons/Ionicons'



const FriendsScreen = ({route, navigation}) => {
    const {groupName} = route.params;

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [friends, setFriends] = useState([]); // Initial empty array of users

    useEffect(() => {
        const subscriber = db.collection('users').doc(auth?.currentUser?.uid).collection('groups').doc(groupName).collection('members').orderBy('firstName')
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
            <TouchableOpacity onPress={() => navigation.navigate('FriendInfo', {uid: item.key})} style={styles.friends}>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
              <TouchableOpacity onPress={friends.includes(() => removeFromGroup(item.uid))} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
              <Ionicons name={"remove-circle-outline"} size={30}color={'#0992ed'} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        </View>
    )
}


export default FriendsScreen