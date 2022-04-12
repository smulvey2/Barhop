import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { auth, db } from '../../firebase'
import { TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Modal, Keyboard} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../../styles/styles'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


header: ({ navigation, route, options, back }) => {
  const title = 'Title Here Please';

  return (
    <MyHeader
      title={title}
      leftButton={
        back ? <MyBackButton onPress={navigation.goBack} /> : undefined
      }
      style={options.headerStyle}
    />
  );
};


const AddGroupsScreen = ({navigation}) => {

  

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [group, setGroup] = useState([]); // Initial empty array of users
const [friends, setFriends] = useState([])
const [groupName, setGroupName] = useState('')
const [thing, setThing] = useState(false)
const [added, setAdded] = useState(false)
const [input, setInput] = useState(false)

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
  navigation.setOptions({
    headerTitle: TitleComponent
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
      {/* <View style={{height: 60, backgroundColor: '#0992ed', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', alignContent: 'space-between'}}>
        <TouchableOpacity style={{width: 30, height: 30, justifyContent: 'center', backgroundColor: 'black', borderRadius: 10, position: 'absolute', left: 15}}>
          <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>X</Text>
        </TouchableOpacity>
        <TextInput
      style={{textAlign: 'center', width: '50%', borderWidth: 0, fontSize: 20, position: 'absolute'}}
      placeholder = "New Group"
      placeholderTextColor={'white'}
      value = {groupName}
      onChangeText = {text=> setGroupName(text)}
      />
      <TouchableOpacity style={group.length != 0 ? styles.createActive : styles.createInactive} disabled={group.length == 0}>
        <Text style={{color: group.length != 0 ? 'white' : 'black', textAlign: 'center'}}>Create</Text>
      </TouchableOpacity>

      </View> */}

            <FlatList
          data={friends}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Friend Info', {uid: item.key})} style={styles.friends}>
              <Image source= {{uri: item.photoURL}} style={{height:25, width:25}}/>
              <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
          <TouchableOpacity onPress={group.includes(item.uid) ? () => removeFromGroup(item.uid): () => addToGroup(item.uid)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name={group.includes(item.uid) ? "radio-button-on-outline" : "radio-button-off-outline"} size={30}color={'#0992ed'} />
          </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => createGroup()} style={stylee.create}>
          <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Create</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddGroupsScreen

const TitleComponent = () => {
const [active, setActive] = useState(false)
  
    return (
      <TextInput
        style={{
          fontFamily: 'ChalkboardSE-Bold',
        }}
        placeholder="Name your Group"
        placeholderTextColor={'white'}
        selectionColor={'white'}
        color={'white'}
        fontSize={18}
      />
    );
  

};

const stylee = StyleSheet.create({
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