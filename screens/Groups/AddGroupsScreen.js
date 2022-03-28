import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { auth, db } from '../../firebase'
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Input } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'


const AddGroupsScreen = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [group, setGroup] = useState([]); // Initial empty array of users
const [friends, setFriends] = useState([])
const [groupName, setGroupName] = useState('')
const [thing, setThing] = useState(false)

const addToGroup = (item) => {
  if(!group.includes(item)){
  var tempGroup = group
  tempGroup.push(item)
  setGroup(tempGroup)
  setThing(!thing)
  }
}

const removeFromGroup = (uid) => {
  var index = group.indexOf(uid)
  var newList = []
  newList = group
  newList.splice(index, 1)
  setGroup(newList)
  setThing(!thing)
}

const createGroup = () => {

  db.collection("users").doc(auth?.currentUser?.uid).collection('groups').doc(groupName).set({
    groupName: groupName
  })
  .then(() => {
    console.log("Document successfully written!");
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
  });
group.forEach(item => {
  db.collection("users").doc(auth?.currentUser?.uid).collection('groups').doc(groupName).collection('members').doc(item.uid).set(
    {
      firstName: item.firstName,
      lastName: item.lastName,
      uid: item.uid,
      photoURL: item.photoURL
    }
  )
  .then(() => {
      console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
})
navigation.popToTop()
}

useEffect(() => { 
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
            <Input
            placeholder = "Enter a group name"
            label = "Group Name"
            leftIcon = {{type:'material', name:'group'}}
            value = {groupName}
            onChangeText = {text=> setGroupName(text)}
            />
            <FlatList
          data={friends}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('FriendInfo', {uid: item.key})} style={{ height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 1, padding: 10, justifyContent: 'space-between'}}>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={{paddingLeft: 20, textAlign: 'left'}}>{item.firstName} {item.lastName}</Text>
          <TouchableOpacity onPress={group.includes(item.uid) ? () => removeFromGroup(item.uid): () => addToGroup(item.uid)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name={group.includes(item.uid) ? "radio-button-on-outline" : "radio-button-off-outline"} size={30}color={'#0992ed'} />
          </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => createGroup()} style={styles.create}>
          <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Create</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddGroupsScreen

const styles = StyleSheet.create({
    create:{
      alignItems: 'center',
      borderColor: 'black',
      borderRadius: 30,
      borderWidth: 1,
      justifyContent: 'center',
      backgroundColor: '#0992ed',
      padding: 10,
      margin: 3
    }
})