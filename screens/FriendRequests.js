import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { faCheck, faBan } from '@fortawesome/fontawesome-free-solid'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import firebase from 'firebase'

const FriendRequests = ({navigation}) => {

const [loading, setLoading] = useState(true); // Set loading to true on component mount
const [requests, setRequests] = useState([]); // Initial empty array of users
const [thisFirst, setThisFirst] = useState('')
const [thisLast, setThisLast] = useState('')
const [thisUrl, setThisUrl] = useState('')

const addFriend = (uid, firstName, lastName, url) => {
  db.collection("users").doc(auth?.currentUser?.uid).collection('friends').doc(uid).set({
    firstName: firstName,
    lastName: lastName,
    uid: uid,
    photoURL: url,
    visible: true
})
.then(() => {
    console.log("Document successfully written!");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});
db.collection('users').doc(auth?.currentUser?.uid).collection('friendRequests').doc(uid).delete()
.then(() => {
    console.log("Document successfully deleted!");
})
.catch((error) => {
    console.error("Error deleting document: ", error);
});

db.collection("users").doc(uid).collection('friends').doc(auth?.currentUser?.uid).set({
  firstName: thisFirst,
  lastName: thisLast,
  uid: auth?.currentUser?.uid,
  photoURL: thisUrl,
  visible: true
})
.then(() => {
  console.log("Document successfully written!");
})
.catch((error) => {
  console.error("Error writing document: ", error);
});
db.collection('users').doc(auth?.currentUser?.uid).update({
  totalFriends: firebase.firestore.FieldValue.increment(1)
})
db.collection('users').doc(uid).update({
  totalFriends: firebase.firestore.FieldValue.increment(1)
})
}

const declineFriend = (uid) => {
  db.collection('users').doc(auth?.currentUser?.uid).collection('friendRequests').doc(uid).delete()
  .then(() => {
      console.log("Document successfully deleted!");
  })
  .catch((error) => {
      console.error("Error deleting document: ", error);
  });
}

useEffect(() => {

  db.collection('users').doc(auth?.currentUser?.uid).get().then(function(doc) {
    if (doc.exists) {
        setThisFirst(doc.data().firstName);
        setThisLast(doc.data().lastName);
        setThisUrl(doc.data().photoURL)
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
    


    const subscriber = db.collection('users').doc(auth?.currentUser?.uid).collection('friendRequests').orderBy('firstName')
      .onSnapshot(querySnapshot => {
        const requests = [];

      querySnapshot.forEach(documentSnapshot => {
        requests.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setRequests(requests)
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
      data={requests}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('FriendInfo', {uid: item.key})}  style={{ height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 1, padding: 10, justifyContent: 'space-between'}}>
          <Text>{item.firstName} {item.lastName}</Text>
          <TouchableOpacity onPress={() => addFriend(item.key, item.firstName, item.lastName, item.photoURL)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <FontAwesomeIcon icon = {faCheck}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => declineFriend(item.key)} style={{height:50, width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <FontAwesomeIcon icon = {faBan}/>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  )
}

export default FriendRequests