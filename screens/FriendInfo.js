import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, Image } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'

const FriendInfo = ({route, navigation}) => {
const {uid} = route.params;

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [firstName, setFirstName] = useState(''); // Initial empty array of users
const [lastName, setLastName] = useState('');
const [url, setUrl] = useState('')
const [about, setAbout] = useState('')
const [totalFriends, setTotalFriends] = useState('')

useEffect(() => {
  db.collection('users').doc(uid).get().then(function(doc) {
    if (doc.exists) {
        setFirstName(doc.data().firstName);
        setLastName(doc.data().lastName);
        setUrl(doc.data().photoURL);
        setAbout(doc.data().about ? doc.data().about : "This user hasn't set their bio yet")
        setTotalFriends(doc.data().totalFriends.toString())
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});  

setLoading(false)
})

    // Unsubscribe from events when no longer in use

  if (loading) {
    return <ActivityIndicator />;
  }


  return(
<View style={{alignItems: 'center'}}>
    <Image
    style={{width: 100, height: 100}} 
    source= {{url}}/>
    <Text style={{padding: 20}}>
        {firstName} {lastName}
    </Text>
    <View style={{alignItems: 'center'}}>
      <Text style={{padding: 20}}>
        {about}
        </Text>
        <Text style={{padding:20}}>
          Bar Mates: {totalFriends}
          </Text>
    </View>

</View>

  )

}

export default FriendInfo