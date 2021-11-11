import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image} from 'react-native'
import { auth, db } from '../../firebase'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/fontawesome-free-solid'
import Ionicons from 'react-native-vector-icons/Ionicons'


const GroupScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [groups, setGroups] = useState([]); // Initial empty array of users

    const getGroupMembers = async (groupName) => {
      let group = await db.collection("users").doc(auth?.currentUser?.uid).collection('groups').doc(groupName).collection('members').get();
      return group.docs.map(doc => doc.data());    
    }

    const switchVisible = async (groupName, visible) => {
      db.collection('users').doc(auth?.currentUser?.uid).collection('groups').doc(groupName).update({
        visible: !visible
      })
      let group = await getGroupMembers(groupName)
      console.log(group)
      group.forEach(member => {
        db.collection('users').doc(auth?.currentUser?.uid).collection('friends').doc(member.uid).update({
          visible: !visible
        })
      })
      }

    useEffect(() => {
        navigation.setOptions({   
            headerRight: () => (
                <TouchableOpacity style={{marginRight: 20}}
                onPress={()=>navigation.navigate('Add Groups')}>
                <FontAwesomeIcon icon = {faPlus}/>
                </TouchableOpacity>
            )
        })
        const subscriber = db.collection('users').doc(auth?.currentUser?.uid).collection('groups')
          .onSnapshot(querySnapshot => {
            const groups = [];
    
          querySnapshot.forEach(documentSnapshot => {
            groups.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setGroups(groups)
          setLoading(false)        
    
        })
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
    
      if (loading) {
        return <ActivityIndicator />;
      }


    return (
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('GroupInfo', {groupName: item.key})} style={{ height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 1, padding: 10, justifyContent: 'space-between'}}>
              <Text>{item.key}</Text>
              <TouchableOpacity onPress={() => switchVisible(item.groupName, item.visible)}>
              <Ionicons name={item.visible ? "radio-button-on-outline" : "radio-button-off-outline"} size={30}color={'#0992ed'} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

    )
}


export default GroupScreen