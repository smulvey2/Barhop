import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { auth, db } from '../firebase'
import 'firebase/firestore'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import firebase from '../firebase'
import Ionicons from 'react-native-vector-icons/Ionicons'  
import styles from '../styles/styles'
import { collection, query, getDocs, doc, updateDoc, setDoc, getDoc, orderBy, deleteDoc, onSnapshot } from "firebase/firestore";



const FriendRequests = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [requests, setRequests] = useState([]); // Initial empty array of users
const [thisFirst, setThisFirst] = useState('')
const [thisLast, setThisLast] = useState('')
const [thisUrl, setThisUrl] = useState('')

const addFriend = (uid, firstName, lastName, url) => {
setDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'friends', uid), {
  firstName: firstName,
  lastName: lastName,
  uid: uid,
  visible: true
})
.then(() => {
    console.log("Document successfully written!");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});
deleteDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'friendRequests', uid))
.then(() => {
    console.log("Document successfully deleted!");
})
.catch((error) => {
    console.error("Error deleting document: ", error);
});
deleteDoc(doc(db, 'users', uid, 'sentRequests', auth.currentUser.uid.toString()))
setDoc(doc(db, 'users', uid, 'friends', auth.currentUser.uid.toString()), {
  firstName: thisFirst,
  lastName: thisLast,
  uid: auth?.currentUser?.uid,
  visible: true
})
.then(() => {
  console.log("Document successfully written!");
})
.catch((error) => {
  console.error("Error writing document: ", error);
});
// updateDoc(doc(db, 'users', auth.currentUser.uid.toString()), {
//   totalFriends: firebase.firestore.FieldValue.increment(1)
// })
// updateDoc(doc(db, 'users', uid), {
//   totalFriends: firebase.firestore.FieldValue.increment(1)
// })
}

const declineFriend = (uid) => {
  deleteDoc(doc(db, 'users', auth.currentUser.uid.toString(), 'friendRequests', uid))
  .then(() => {
      console.log("Document successfully deleted!");
  })
  .catch((error) => {
      console.error("Error deleting document: ", error);
  });
}

useEffect(() => {

  (async () => {

    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setThisFirst(docSnap.data().firstName)
      setThisLast(docSnap.data().lastName)
  } else {
    // doc.data() will be undefined in this case
  console.log("No such document!");
  }
    const r = collection(db, 'users', auth.currentUser.uid.toString(), 'friendRequests')
    const q = query(r, orderBy('firstName'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const friends = [];
    querySnapshot.forEach((doc) => {
      friends.push({
        ...doc.data(),
        key: doc.id,
      });
    })
    setRequests(friends)
    setLoading(false)
  })
  return () => unsubscribe();
  })();

  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

    return (
    <FlatList
      data={requests}
      style={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Friend Info', {uid: item.key})}  style={styles.friends}>
          <Text style={styles.listsTextBlack}>{item.firstName} {item.lastName}</Text>
          <TouchableOpacity onPress={() => addFriend(item.key, item.firstName, item.lastName)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name='checkmark-outline' size={20} color='black' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => declineFriend(item.key)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Ionicons name='close-circle-outline' size={20} color='black' />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  )
}

export default FriendRequests