import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image} from 'react-native'
import { auth, db } from '../../firebase'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBell, faPlus } from '@fortawesome/fontawesome-free-solid'
  

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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('FriendInfo', {uid: item.key})} style={{ height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 1, padding: 10}}>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={{paddingLeft: 20}}>{item.firstName} {item.lastName}</Text>
            </TouchableOpacity>
          )}
        />
        </View>
    )
}


export default FriendsScreen