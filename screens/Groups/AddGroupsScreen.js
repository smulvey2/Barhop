import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { auth, db } from '../../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { Input } from 'react-native-elements'


const AddGroupsScreen = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [group, setGroup] = useState([]); // Initial empty array of users
const [friends, setFriends] = useState([])
const [groupName, setGroupName] = useState('')

const addToGroup = (item) => {
  group.push(item)
  alert(JSON.stringify(group))
}

const removeFromGroup = (uid) => {
  const newList = group.filter(item => item.uid !== uid)
  alert(JSON.stringify(newList))
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
              <Text style={{paddingLeft: 20}}>{item.firstName} {item.lastName}</Text>
              <TouchableOpacity onPress={() => addToGroup(item)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
              <Ionicons name='add-circle-outline' size={20} color='black' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeFromGroup(item.uid)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name='remove-circle-outline' size={20} color='black' />
          </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => createGroup()}>
          <Text>Create</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddGroupsScreen