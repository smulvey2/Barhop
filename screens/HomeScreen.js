import React, { useLayoutEffect, useState, useEffect, useCallback, Component } from 'react'
import { View, Text, ActivityIndicator, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { auth, db } from '../firebase'
import {AntDesign} from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps'
import { getDistance, isPointWithinRadius } from 'geolib';
import { RNGooglePlaces } from 'react-native-google-places-api'


const HomeScreen = ({navigation}) => {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState([true])
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [errorMessage, setErrorMessage] = useState(null)
    const [markerLatitude, setMarkerLatitude] = useState(37.555)
    const [markerLongitude, setMarkerLongitude] = useState(-77.4738)
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [barName, setBarName] = useState('')
    const [open, setOpen] = useState(false)
    const [icon, setIcon] = useState('')
    
    const openBar = (name, open, icon) => {
      setBarName(name)
      setOpen(open)
      setIcon(icon)
      setModalVisible(!modalVisible)
    }

    useEffect(()=> {
        
        var axios = require('axios');
        var x = []

            var config = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latitude +','+ longitude+'&radius=5000&keyword=bar&key=AIzaSyB2scRUxaJogcl5dZlSL-y8DSrWofZCTN4',
            headers: { }
            };

            axios(config)
            .then(function (response) {
            x= response.data.results
            setData(x)
            })
            .catch(function (error) {
            console.log(error);
            });
            
        (async () => {
            
            //setData(await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-' + latitude + ',' + longitude + '&radius=50000&keyword=bar&key=AIzaSyB2scRUxaJogcl5dZlSL-y8DSrWofZCTN4'))
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let loc = await Location.getCurrentPositionAsync({});
            setLatitude(loc.coords.latitude);
            setLongitude(loc.coords.longitude);
            db.collection("users").doc(auth?.currentUser?.uid).update({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            })          
        })();
        navigation.setOptions({
            headerLeft: () => (
                <View style={{marginLeft: 20}}>
                <Avatar 
                rounded 
                source ={{uri: auth?.currentUser?.photoURL}} />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{marginRight: 20}}
                onPress={signOut}>
                <AntDesign name = 'logout' size={24} color='black'/>
                </TouchableOpacity>
            )
        })
        db.collection('users').doc(auth?.currentUser?.uid).get().then(function(doc) {
            if (doc.exists) {
                setName(doc.data().firstName);
                setLastName(doc.data().lastName)
                setLatitude(doc.data().latitude)
                setLongitude(doc.data().longitude)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        setLoading(false)
    }, []);
  
    if (loading) {
      return <ActivityIndicator />;
    }

    //console.log(data)
    return (
      <View style={{flex: 1}}>
        <MapView
         style={{ flex: 1 }}
         provider={PROVIDER_GOOGLE}
         showsUserLocation
         region={{
             latitude: latitude,
             longitude: longitude,
             latitudeDelta: 0.04,
             longitudeDelta: 0.05
          }}
         onPress={e => 
            modalVisible ? setModalVisible(false) : null
        } 
      >
          {data.map((marker, index) => (
          <MapView.Marker key={index}
            coordinate={{latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng}}
            pinColor= {isPointWithinRadius({ latitude: latitude, longitude: longitude },
                { latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng }, 300) ? "blue" : "red"}
            onPress={()=> openBar(marker.name, marker.opening_hours.open_now, marker.icon)}
          />
        ))}
      </MapView>
        <View>
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
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableOpacity>
        </View>
      </Modal>
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      width: '100%',
      height: 400,
      backgroundColor: '#EE5407',
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