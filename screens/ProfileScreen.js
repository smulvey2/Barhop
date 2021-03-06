import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, Button, Image, Touchable } from 'react-native'
import { auth, db } from '../firebase'
import {AntDesign} from '@expo/vector-icons'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { Avatar, Input } from 'react-native-elements'
import Icon from 'react-native-ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'  
import { collection, query, getDocs, doc, updateDoc, setDoc, getDoc, orderBy, deleteDoc, onSnapshot } from "firebase/firestore";


const ProfileScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [firstName, setFirstName] = useState(''); // Initial empty array of users
    const [lastName, setLastName] = useState('');
    const [url, setUrl] = useState('')
    const [totalFriends, setTotalFriends] = useState('')
    const [about, setAbout] = useState('')
    const [editAbout, setEditAbout] = useState(false)
    const [tempAbout, setTempAbout] = useState('')

    // const enterAbout = ()=> {
    //     docRef = db.collection('users').doc(auth?.currentUser?.uid)

    //     var setWithMerge = docRef.set({
    //         about: tempAbout
    //     }, { merge: true });
    //     setEditAbout(false)
    // }

    const signOut = ()=> {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
        .catch((error) => {

        })
    }
    // useEffect(()=> {
    //     db.collection('users').doc(auth?.currentUser?.uid).get().then(function(doc) {
    //         if (doc.exists) {
    //             setTempAbout(doc.data().about ? doc.data().about : 'Share any information about yourself here')
    //         } else {
    //             // doc.data() will be undefined in this case
    //             console.log("No such document!");
    //         }
    //     }).catch(function(error) {
    //         console.log("Error getting document:", error);
    //     });  
    // }, []);
    useEffect(() => {
        (async () => {
            const docRef = doc(db, 'users', auth.currentUser.uid.toString());
            const docQuery = await getDoc(docRef);
            if (docQuery.exists()) {
                  setFirstName(docQuery.data().firstName);
                  setLastName(docQuery.data().lastName);
                  setUrl(docQuery.data().photoURL);
                  setAbout(docQuery.data().about ? docQuery.data().about : "This user hasn't set their bio yet")
                  setTotalFriends(docQuery.data().totalFriends ? docQuery.data().totalFriends.toString() : "This user has no friends yet")
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          })();
      })
      
        return(
      <View style ={{alignItems: 'center', justifyContent: 'center'}}>
          {/* <Image
          style={{width: 100, height: 100}} 
          source= {{url}}/> */}
            
          <Text style={{padding:20}}>
              {firstName} {lastName}
          </Text>

          {/* <TouchableOpacity style={{paddingLeft: 300, padding: 5}} onPress={() => setEditAbout(true)}>
                <Ionicons size={30} name="create-outline"></Ionicons>
                </TouchableOpacity>

            {editAbout ?
            <View width={400}>
            <Input
                value={tempAbout}
                multiline= {true}
                onChangeText = {text=> setTempAbout(text)}
                />
                <Button title='Submit' onPress={() => enterAbout()}/>
                <Button title='Cancel' onPress={()=> setEditAbout(false)}/>
            </View>
                :
          <Text style={{padding:20, borderWidth: 2, borderColor: 'black'}}>
                {about}
          </Text>} */}
          <Text style={{padding:20}}>Bar Mates: {totalFriends}</Text>
          <View style={{padding: 150}}>
          </View>
          <View style={{marginTop:'auto', padding:10}}>
          <Button title="Sign Out" onPress={signOut}/>
          </View>
      </View>
        )
}


export default ProfileScreen