import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet} from 'react-native'
import { auth, db } from '../firebase'
import Ionicons from 'react-native-vector-icons/Ionicons'  

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
          style={{paddingBottom: 300, paddingTop: 20,}}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('FriendInfo', {uid: item.key})} style={ styles.friends }>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={{paddingLeft: 20}}>{item.firstName} {item.lastName}</Text>
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

const styles = StyleSheet.create({
  friends: {
    height: 50, 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderColor: 'black', 
    borderRadius: 5, 
    borderWidth: 1, 
    padding: 10, 
    justifyContent: 'space-between', 
    marginLeft: 10, 
    marginRight: 10,
    shadowOffset:{
      width: 5,
      height: 5
    },
    shadowOpacity: 0.4,
    backgroundColor: 'white'
  }
})