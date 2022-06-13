import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, Modal, Image } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'  
import FriendsScreen from './FriendsScreen'
import { AnimatedRegion } from 'react-native-maps'
import styles from '../styles/styles'
import { collection, query, setDoc, doc, where, getDocs, docSnap, onSnapshot, getDoc, orderBy, deleteDoc } from "firebase/firestore";
import QRCode from 'react-native-qrcode-svg';
import { Camera, CameraType } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner';



const AddFriendsScreen = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [users, setUsers] = useState([]); // Initial empty array of users
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [friends, setFriends] = useState([])
const [requests, setRequests] = useState([])
const [hasPermission, setHasPermission] = useState(null);
const [scanning, setScanning] = useState(false)
const [scanned, setScanned] = useState(false)
const [scannedName, setScannedName] = useState('')
const [scannedUserName, setScannedUserName] = useState('')
const [scannedUid, setScannedUid] = useState('')
const [scannedFriend, setScannedFriend] = useState()
const [searchName, setSearchName] = useState()
const [searchResult, setSearchResult] = useState()
const [searchFound, setSearchFound] = useState(false)
const [notFound, setNotFound] = useState(true)

const handleBarCodeScanned = async ({ type, data }) => {
  setScanned(true);
  setScannedUid(data)
  const docRef = doc(db, 'users', data);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setScannedFriend(docSnap.data())
    setScannedName(docSnap.data().firstName + ' ' + docSnap.data().lastName)
    setScannedUserName(docSnap.data().name)
  } else {
    // doc.data() will be undefined in this case
  console.log("No such document!");
  }
};


const searchUser = async () => {
const q = query(collection(db, "users"), where("name", "==", searchName));
const querySnapshot = await getDocs(q);
if(querySnapshot.size == 0)
{
    setNotFound(true)
    setTimeout(function () {
      setNotFound(false)
    }, 2000)
}
else{
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  setScannedFriend(doc.data())
  setScannedName(doc.data().firstName + ' ' + doc.data().lastName)
  setScannedUserName(doc.data().name)
  setScannedUid(doc.id)
});
  setSearchFound(true)
}
}

const sendRequest = (item) => {
  console.log(scannedUid + ', ' + item.firstName + ', ' + item.lastName) 
  setDoc(doc(db, 'users', scannedUid, 'friendRequests', auth.currentUser.uid.toString()), {
    firstName: firstName,
    lastName: lastName,
    uid: auth.currentUser.uid,
})
setDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'sentRequests', scannedUid), {
  firstName: item.firstName,
  lastName: item.lastName,
  uid: scannedUid,
})
resetScanning()
}

const resetScanning = () => {
  setScanning(false)
  setScanned(false)
  setScannedName('')
  setSearchFound(false)
}

const addFriend = (item) => {
  setDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'friends', scannedUid), {
    firstName: item.firstName,
    lastName: item.lastName,
    uid: scannedUid,
    visible: true
  })
  setDoc(doc(db, 'users', scannedUid, 'friends', auth.currentUser.uid.toString()), {
    firstName: firstName,
    lastName: lastName,
    uid: auth?.currentUser?.uid,
    visible: true
  })
  resetScanning()
  }

const removeRequest = (item) => {
  deleteDoc(doc(db, 'users', item.key, 'friendRequests', auth.currentUser.uid.toString()))
  deleteDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'sentRequests', item.key))
}

useEffect(() => { 
  (async () => {
    const r = collection(db, 'users')
    const q = query(r, orderBy('firstName'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const friends = [];
    querySnapshot.forEach((doc) => {
      if(doc.id != auth.currentUser.uid){
      friends.push({
        ...doc.data(),
        key: doc.id,
      });
    }
    else{
      setFirstName(doc.data().firstName)
      setLastName(doc.data().lastName)
    }
    })
    setUsers(friends)
    setLoading(false)
  })
  return () => unsubscribe();
  })(); 
  }, []);

  useEffect(() => { 
    (async () => {
      const r = collection(db, 'users', auth.currentUser.uid.toString(), 'friends')
      const q = query(r, orderBy('firstName'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push(
          doc.id
        );
      })
      setFriends(friends)
    })
    return () => unsubscribe();
    })();
  }, []);

  useEffect(() => { 
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        const r = collection(db, 'users', auth.currentUser.uid.toString(), 'sentRequests')
        const q = query(r, orderBy('firstName'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const friends = [];
        querySnapshot.forEach((doc) => {
          friends.push(
                doc.id
          );
        })
        setRequests(friends)
      })
      return () => unsubscribe();
      })();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }


  return (
    // <FlatList
    //   data={users}
    //   style={styles.list}
    //   contentContainerStyle={{ paddingBottom: 20 }}
    //   renderItem={({ item }) => (
    //     <TouchableOpacity onPress={() => navigation.navigate('Friend Info', {uid: item.key})} style={styles.friends}>
    //       <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
    //       <TouchableOpacity onPress={friends.includes(item.key) ? () => navigation.navigate('Friend Info', {uid: item.key}) : requests.includes(item.key) ?  () => removeRequest(item) : () => sendRequest(item)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
    //       <Ionicons name= {friends.includes(item.key) ? "checkmark-circle-outline" : requests.includes(item.key) ? "remove-circle-outline" : "add-circle-outline"} size={30}></Ionicons>
    //       </TouchableOpacity>
    //     </TouchableOpacity>
    //   )}
    // />


    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
   <TextInput
     placeholder="Search for friends"
     style={{ borderWidth: 2, borderRadius: 20, height: 40, width: '80%', marginTop: 10, paddingLeft: 10 }}
     onPressOut={() => { Keyboard.dismiss() }}
     value = {searchName}
     onChangeText = {text => setSearchName(text)}
     onSubmitEditing = {() => searchUser()}
   />
   {notFound ?
   <View style={{}}>
   <Text style={styles.genericTextBlack}>User not found (search is case sensitive)</Text>
   </View>
   : null
   }
   <TouchableOpacity style={{ backgroundColor: '#0992ed', borderWidth: 2, borderRadius: 30, padding: 10, marginBottom: 28 }}
     onPress={() => { setScanning(!scanning); }}>
     { scanning ?
     <Text style={styles.genericTextBlack}>Exit Scanner</Text>
     :
     <Text style={styles.genericTextBlack}>Scan a friend's QR Code</Text>
     }
   </TouchableOpacity>

  {/* search result modal */}
   <Modal
     animationType='fade'
     transparent={true}
     visible={searchFound}
     onRequestClose={() => {
       Alert.alert("Modal has been closed.");
       setSearchFound(!searchFound);
     }}>
    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => resetScanning()}>
     <TouchableWithoutFeedback>
       <View style={{ padding: 20, borderRadius: 30, backgroundColor: 'black', width: 300, height: 300}}>
       <View style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 15}}>
         <Image source={require('./../assets/defaultPic.jpg')} style={{marginTop: 5}}/>
         <Text style={[styles.genericTextBlack, {fontSize: 30, marginBottom: 10}]}>{scannedUserName}</Text>
         <Text style={styles.genericTextBlack}>{scannedName}</Text>
         <TouchableOpacity style={{ backgroundColor: '#0992ed', borderWidth: 2, borderRadius: 30, padding: 10, marginTop: 15, marginBottom: 10}}
     onPress={friends.includes(scannedUid) || auth.currentUser.uid == scannedUid ? () => resetScanning() :() => { sendRequest(scannedFriend)}}>
     {  friends.includes(scannedUid) || auth.currentUser.uid == scannedUid ?
     <Text style={styles.genericTextBlack}>Already Friends With {scannedUserName}</Text>
     :
     <Text style={styles.genericTextBlack}>Send Friend Request</Text>
     }
   </TouchableOpacity>
       </View>
       </View>
       </TouchableWithoutFeedback>
     </TouchableOpacity>
   </Modal>

  {/* scanning modal */}

   <Modal
     animationType='fade'
     transparent={true}
     visible={scanning}
     onRequestClose={() => {
       Alert.alert("Modal has been closed.");
       setScanning(!scanning);
     }}>
    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => resetScanning()}>
     <TouchableWithoutFeedback>
       <View style={{ padding: 20, borderRadius: 30, backgroundColor: 'black', width: 300, height: 300}}>
         {scannedName == '' ?
         <BarCodeScanner style={localStyles.camera}
         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}>
       </BarCodeScanner>
       :
       <View style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
         <Image source={require('./../assets/defaultPic.jpg')} style={{marginTop: 5}}/>
         <Text style={[styles.genericTextBlack, {fontSize: 30, marginBottom: 10}]}>{scannedUserName}</Text>
         <Text style={styles.genericTextBlack}>{scannedName}</Text>
         <TouchableOpacity style={{ backgroundColor: '#0992ed', borderWidth: 2, borderRadius: 30, padding: 10, marginTop: 15, marginBottom: 10}}
     onPress={friends.includes(scannedUid) || auth.currentUser.uid == scannedUid ? () => resetScanning() :() => { addFriend(scannedFriend)}}>
     {  friends.includes(scannedUid) || auth.currentUser.uid == scannedUid ?
     <Text style={styles.genericTextBlack}>Already Friends With {scannedUserName}</Text>
     :
     <Text style={styles.genericTextBlack}>Add Friend</Text>
     }
   </TouchableOpacity>
       </View>
         }
       </View>
       </TouchableWithoutFeedback>
     </TouchableOpacity>
   </Modal>
  


   <View style={{ borderWidth: 5, padding: 20, borderRadius: 30, backgroundColor: 'black', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.4 }}>
     <QRCode
       value={auth.currentUser.uid}
       size={250}
       logo={require('./../assets/HoppLogo.png')}
       color='#0992ed'
       logoSize={40}
     />
   </View>
 </View>
</TouchableWithoutFeedback>
  )
}

export default AddFriendsScreen


const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'blue'
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});