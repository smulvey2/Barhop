import React, { useLayoutEffect, useState, useEffect, useCallback, Component } from 'react'
import { View, Text, ActivityIndicator, Modal, StyleSheet, TouchableOpacity, Image, TextInput, Button, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native'
import { auth, db, firebase } from '../firebase'
import { AntDesign } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps'
import { getDistance, isPointWithinRadius } from 'geolib';
import GestureRecognizer from 'react-native-swipe-gestures';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CheckBoxIcon from 'react-native-elements/dist/checkbox/CheckBoxIcon';
import { render } from 'react-dom';


const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState([true])
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [mapLatitude, setMapLatitude] = useState(0)
  const [mapLongitude, setMapLongitude] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [barName, setBarName] = useState('')
  const [barUsers, setBarUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const [reviews, setReviews] = useState([])
  const [review, setReview] = useState('')
  const [input, setInput] = useState(false)
  const [bars, setBars] = useState([])
  const [friends, setFriends] = useState([])
  const [friendsAtBar, setFriendsAtBar] = useState([])
  const [friendsBars, setFriendsBars] = useState([])
  const [state, setState] = useState(false)
  const [coordSet, setCoordSet] = useState(false)
  const [markersSet, setMarkersSet] = useState(false)
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        },
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]

  const enterReview = async () => {
    setInput(false)
    db.collection('bars').doc(id).collection('reviews').doc().set({
      name: name,
      lastName: lastName,
      review: review,
    })
  }

  const checkIn = () => {
    fetch("http://192.168.0.115:3000/api/addBarUser/" + id + ", " + auth.currentUser.uid)
    db.collection('users').doc(auth.currentUser.uid).set({
      currentBar: id
    },
      { merge: true })
  }

  const checkOut = () => {
    fetch("http://192.168.68.115:3000/api/removeBarUser/" + id + ", " + auth.currentUser.uid)
    db.collection('users').doc(auth.currentUser.uid).set({
      currentBar: null
    },
      { merge: true })
  }


  const openBar = async (id, name, users) => {
    // setBarName(name)
    // setId(id)
    // // if (users != null) {
    // //   setBarUsers(users)
    // //   const friendsTemp = []
    // //   friends.forEach(friend => {
    // //     if (barUsers.includes(friend.key)) {
    // //       friendsTemp.push(friend)
    // //     }
    // //   })
    // //   setFriendsAtBar(friendsTemp)
    // //   console.log(friendsAtBar[0])
    // //   setState(!state)
    // //   console.log(state)
    // // }
    // setModalVisible(!modalVisible)
  }

  useEffect(() => {

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }


      await db.collection('users').doc(auth?.currentUser?.uid).get().then(function (doc) {
        if (doc.exists) {
          setName(doc.data().firstName);
          setLastName(doc.data().lastName)
          setLatitude(doc.data().latitude)
          setLongitude(doc.data().longitude)
          setMapLatitude(doc.data().latitude)
          setMapLongitude(doc.data().longitude)
          if(!markersSet){
          fetch("http://192.168.68.115:3000/api/location/" + doc.data().latitude + ", " + doc.data().longitude)
        .then((res) => res.json())
        .then((bars) => setBars(bars))
        .then(setMarkersSet(true))
        .then(console.log("6"))
          }
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
      await db.collection('users').doc(auth?.currentUser?.uid).collection('friends').orderBy('firstName')
        .onSnapshot(querySnapshot => {
          const friends = [];
          console.log("7")
          querySnapshot.forEach(documentSnapshot => {
            friends.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
  
          setFriends(friends)
        })


      let loc = await Location.getCurrentPositionAsync({});
      console.log("1" + markersSet)
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      if(!markersSet){
      await fetch("http://192.168.68.115:3000/api/location/" + loc.coords.latitude + ", " + loc.coords.longitude)
      .then(console.log("2"))
      .then((res) => res.json())
      .then((bars) => setBars(bars))
      .then(setMarkersSet(true))
      .then(bars.forEach(bar => {
        console.log('hits')
            bar.friendsAt = []
            if (bar.users)
              bar.users.forEach(user => {
                if (friends.includes(user)) {
                  var friendID = friends.indexOf(user)
                  var initials = friend.firstName.charAt(0) + friend.lastName.charAt(0)
                  var friend = {
                    friendID: friendID,
                    initials: initials,
                    firstName: friend.firstName,
                    lastName: friend.lastName
                  }
                  bar.friendsAt.push(friend)
                  console.log(friend)
                }
              })
          }))
          .then(console.log("3"))
      }
      if(coordSet == false){
        setMapLatitude(loc.coords.latitude)
        setMapLongitude(loc.coords.longitude)
        setCoordSet(true)
        console.log("4")
      }
      db.collection("users").doc(auth?.currentUser?.uid).update({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      })
      console.log("5")
    })();

    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Avatar
            rounded
            source={{ uri: auth?.currentUser?.photoURL }} />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }}
          onPress={signOut}>
          <AntDesign name='logout' size={24} color='black' />
        </TouchableOpacity>
      )
    })
    
      console.log("8")
    setLoading(false)
  }, []);

  // useEffect(() => {
  //   console.log("hits")
  //   bars.forEach(bar => {
  //     bar.friendsAt = []
  //     if (bar.users)
  //       bar.users.forEach(user => {
  //         if (friends.includes(user)) {
  //           var friendID = friends.indexOf(user)
  //           var initials = friend.firstName.charAt(0) + friend.lastName.charAt(0)
  //           var friend = {
  //             friendID: friendID,
  //             initials: initials,
  //             firstName: friend.firstName,
  //             lastName: friend.lastName
  //           }
  //           bar.friendsAt.push(friend)
  //           console.log(friend)
  //         }
  //       })
  //   })
  // })


  if (loading) {
    return <ActivityIndicator />;
  }
  //console.log(latitude + ", " + longitude)
  return (
    <GestureRecognizer
      style={{ flex: 1, backgroundColor: 'transparent' }}
      onSwipeDown={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <MapView
            customMapStyle={mapStyle}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            region={{
              latitude: mapLatitude,
              longitude: mapLongitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.025
            }}
            onPress={e =>
              modalVisible ? setModalVisible(false) : null
            }
          >
            {bars.map((marker, index) => (
              <MapView.Marker key={index}
                extraData={state.refresh}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                pinColor={isPointWithinRadius({ latitude: latitude, longitude: longitude },
                  { latitude: marker.latitude, longitude: marker.longitude }, 300) ? "blue" : "red"}
                onPress={() => openBar(marker.id, marker.name, marker.users)}
              >
                <View style={styles.circle}>
              <Ionicons style={{ marginLeft: 3 }} name='beer-outline' size={20} color='white' />
            </View>
              {/* {marker.friendsAt != undefined ?
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                  {marker.friendsAt[0] != undefined ? 
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', margin: 5 }}>
                      <View style={{ backgroundColor: 'white', borderRadius: 10, flexDirection: 'column', height: 20, width: 20 }}></View>
                    </View>
                     : null}
                    {marker.friendsAt[1] != undefined ? 
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-end', margin: 5 }}>
                      <View style={{ backgroundColor: 'blue', borderRadius: 10, flexDirection: 'column', height: 20, width: 20 }}></View>
                    </View>
                     : null}

                  </View>

                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                  {marker.friendsAt[2] != undefined ? 
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-start', margin: 5 }}>
                      <View style={{ backgroundColor: 'blue', borderRadius: 10, flexDirection: 'column', height: 20, width: 20 }}></View>
                    </View>
                     : null}
                    {marker.friendsAt[3] != undefined ? 
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-start', margin: 5 }}>
                      <View style={{ backgroundColor: 'blue', borderRadius: 10, flexDirection: 'column', height: 20, width: 20 }}></View>
                    </View>
                     : null}
                  </View>

                  <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute' }}>
                    <View style={styles.circle}>
                      <Ionicons style={{ marginLeft: 3 }} name='beer-outline' size={20} color='white' />
                    </View>
                  </View>
                </View>
              : <View style={styles.circle}>
              <Ionicons style={{ marginLeft: 3 }} name='beer-outline' size={20} color='white' />
            </View>} */}
              </MapView.Marker>
            ))}
          </MapView>

          <View style={{ backgroundColor: 'rgba(52, 52, 52, alpha)' }}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{barName}</Text>
                <Button title="Check In" onPress={() => checkIn()} />
                <Button title="Check Out" onPress={() => checkOut()} />
                <FlatList
                  data={friendsAtBar}
                  extraData={state}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { navigation.navigate('FriendInfo', { uid: item.key }); setModalVisible(false); }} style={{ height: 50, flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 1, padding: 10, justifyContent: 'space-between' }}>
                      <Text style={{ paddingLeft: 20 }}>{item.firstName} {item.lastName} </Text>
                    </TouchableOpacity>
                  )}
                />
                {input ?
                  <View width={400}>
                    <TextInput
                      style={{ borderWidth: 1 }}
                      placeholder={'Enter your review here'}
                      multiline={true}
                      onChangeText={text => setReview(text)}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <Button title='Submit' onPress={() => enterReview()} />
                    <Button title='Cancel' onPress={() => setInput(false)} />

                  </View>
                  :
                  <View>
                    <Button title='Write a live review' onPress={() => setInput(true)}>
                    </Button>
                  </View>
                }
                {/* <FlatList
                  data={reviews}
                  renderItem={({ item }) => (
                    <View style={styles.reviews}>
                      <Text>{item.name} {item.lastName}</Text>
                      <Text>{'\n'}{item.review}</Text>
                      </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                /> */}
              </View>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GestureRecognizer>

  );
}

const styles = StyleSheet.create({
  reviews: {
    borderWidth: 2,
    width: 300,
    flex: 1,
    flexDirection: 'column',
    margin: 20
  },
  circle: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 30 / 2,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0992ed'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default HomeScreen