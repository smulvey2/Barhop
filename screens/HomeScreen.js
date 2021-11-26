import React, { useLayoutEffect, useState, useEffect, useCallback, Component } from 'react'
import { View, Text, ActivityIndicator, Modal, StyleSheet, TouchableOpacity, Image, TextInput, Button, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native'
import { auth, db, firebase } from '../firebase'
import { AntDesign } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps'
import { getDistance, isPointWithinRadius } from 'geolib';
import { RNGooglePlaces } from 'react-native-google-places-api'
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'  


const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState([true])
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [markerLatitude, setMarkerLatitude] = useState(43.038902)
  const [markerLongitude, setMarkerLongitude] = useState(-87.906471)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [barName, setBarName] = useState('')
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const [reviews, setReviews] = useState([])
  const [review, setReview] = useState('')
  const [input, setInput] = useState(false)
  const [markersSet, setMarkersSet] = useState(false)

  console.log(markersSet)

  const markerArray = async (lat, long) => {
    var axios = require('axios');
    var x = []

    var config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + long + '&radius=3000&type=bar&key=AIzaSyB2scRUxaJogcl5dZlSL-y8DSrWofZCTN4',
      headers: {}
    };

    axios(config)
      .then(function (response) {
        x = response.data.results
        setData(x)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const enterReview = async () => {
    setInput(false)
    db.collection('bars').doc(id).collection('reviews').doc().set({
      name: name,
      lastName: lastName,
      review: review,
      //postedAt: firebase.FieldValue.serverTimestamp()
    })
  }

  const openBar = async (id, name, open) => {
    db.collection('bars').doc(id).set({
      name: name
    })
    let bar = await db.collection("bars").doc(id).collection('reviews').get()
    setReviews(bar.docs.map(doc => doc.data()))
    setBarName(name)
    setOpen(open)
    setId(id)
    setModalVisible(!modalVisible)
  }

  useEffect(() => {

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      if(!markersSet){
        console.log('hits')
      markerArray(loc.coords.latitude, loc.coords.longitude)
      setMarkersSet(true)
      }     
      db.collection("users").doc(auth?.currentUser?.uid).update({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      })
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
    db.collection('users').doc(auth?.currentUser?.uid).get().then(function (doc) {
      if (doc.exists) {
        setName(doc.data().firstName);
        setLastName(doc.data().lastName)
        setLatitude(doc.data().latitude)
        setLongitude(doc.data().longitude)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    setLoading(false)
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  //console.log(data)
  return (
    <GestureRecognizer
      style={{ flex: 1, backgroundColor: 'transparent' }}
      onSwipeDown={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.025
            }}
            onPress={e =>
              modalVisible ? setModalVisible(false) : null
            }
          >
            {data.map((marker, index) => (
              <MapView.Marker key={index}
                coordinate={{ latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng }}
                pinColor={isPointWithinRadius({ latitude: latitude, longitude: longitude },
                  { latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng }, 300) ? "blue" : "red"}
                onPress={() => openBar(marker.place_id, marker.name, marker.opening_hours.open_now, marker.icon)}
              >
              <View style={styles.circle}>
                  <Ionicons style={{marginLeft:3}}name='beer-outline' size={20} color='white'/>
              </View>

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
                <Text style={styles.modalText}>{barName} {open ? 'is open now' : 'is closed now'} </Text>
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
                  <Button title='Cancel' onPress={() => setInput(false)}/>
                
                </View>
                :
                <View>
                  <Button title='Write a live review' onPress={() => setInput(true)}>
                  </Button>
                </View>
}
                <FlatList
                  data={reviews}
                  renderItem={({ item }) => (
                    <View style={styles.reviews}>
                      <Text>{item.name} {item.lastName}</Text>
                      <Text>{'\n'}{item.review}</Text>
                      </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
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
    borderWidth:2,
    width:300,
    flex:1,
    flexDirection:'column',
    margin:20
  },
  circle: {
    width: 30,
    height: 30,
    borderWidth:2,
    borderRadius: 30 / 2,
    backgroundColor: 'red',
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