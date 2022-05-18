import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, Image } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { collection, query, getDocs, doc, updateDoc, setDoc, getDoc, orderBy } from "firebase/firestore";


const FriendInfo = ({route, navigation}) => {
const {uid} = route.params;

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [firstName, setFirstName] = useState(''); // Initial empty array of users
const [lastName, setLastName] = useState('');
const [url, setUrl] = useState('')
const [about, setAbout] = useState('')
const [totalFriends, setTotalFriends] = useState('')
const [initials, setInitials] = useState('')

useEffect(() => {
  (async () => {
  const docRef = doc(db, 'users', uid);
  const docQuery = await getDoc(docRef);
  if (docQuery.exists()) {
        setFirstName(docQuery.data().firstName);
        setLastName(docQuery.data().lastName);
        setUrl(docQuery.data().photoURL);
        setAbout(docQuery.data().about ? docQuery.data().about : "This user hasn't set their bio yet")
        setTotalFriends(docQuery.data().totalFriends ? docQuery.data().totalFriends.toString() : "This user has no friends yet")
        setInitials(docQuery.data().firstName.charAt(0) + docQuery.data().lastName.charAt(0))
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
})();
})



  return(
<View style={{alignItems: 'center'}}>
    {/* <Image
    style={{width: 100, height: 100}} 
    source= {{url}}/> */}
          <TouchableOpacity style={{marginTop:15, width: 75, height: 75, borderRadius: 75 / 2, backgroundColor: '#0992eded', borderColor: 'black', borderWidth: 4, justifyContent:'center'}}>
          <Text style={{color: 'white', textAlign:'center', fontSize:35}}>{initials}</Text>            
          </TouchableOpacity>

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