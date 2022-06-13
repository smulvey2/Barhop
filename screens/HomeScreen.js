import React, { useLayoutEffect, useState, useEffect, useCallback, Component } from 'react'
import { View, Text, ActivityIndicator, Modal, StyleSheet, TouchableOpacity, Animated, TextInput, Button, Keyboard, TouchableWithoutFeedback, FlatList, KeyboardAvoidingView } from 'react-native'
import { auth, db } from '../firebase'
import { AntDesign } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps'
import { getDistance, isPointWithinRadius } from 'geolib';
import GestureRecognizer from 'react-native-swipe-gestures';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-virtualized-view';
import { collection, query, getDocs, doc, updateDoc, setDoc, getDoc, orderBy } from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
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
  const [description, setDescription] = useState('')
  const [input, setInput] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState(false)
  const [bars, setBars] = useState([])
  const [friends, setFriends] = useState([])
  const [friendsAtBar, setFriendsAtBar] = useState([])
  const [friendsBars, setFriendsBars] = useState([])
  const [state, setState] = useState(false)
  const [coordSet, setCoordSet] = useState(false)
  const [currentBar, setCurrentBar] = useState('')
  const [bar, setBar] = useState([])
  const [checkedIn, setCheckedIn] = useState(false)
  const [region, setRegion] = useState(false)
  const [index, setIndex] = useState(-1)
  const [reviewIndex, setReviewIndex] = useState(-1)
  const [dropdown, setDropdown] = useState(false)
  var markersSet = false
  const ip = "18.189.31.193"
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

  //called when user checks into bar, makes "Checked In!" message appear and fade
  fadeOut = async () => {
    setCheckedIn(true)
    setTimeout(function () {
      setCheckedIn(false)
    }, 2000)
  };

  const openDelete = async (i) => {
    setReviewIndex(i)
    setDropdown(true)
  }
  const deleteReview = async () => {
    setDropdown(false)
    var templist = bars[index].reviews
    templist.splice(reviewIndex, 1)
    var tempBars = bars
    tempBars[index].reviews = templist
    setBars(tempBars)
    fetch("http://" + ip + ":3000/api/deleteReview/" + id + ", " +  reviewIndex)
  }

  //posts review to bar
  const enterReview = async () => {
    setInput(false)
    var tempList = []
    if(bars[index].reviews != null){
    tempList = bars[index].reviews
    }
    let tempReview = {user: name + " " + lastName, review: review, date: 'Now', uid: auth.currentUser.uid}
    tempList.push(tempReview)
    var tempBars = bars
    tempBars[index].reviews = tempList
    setBars(tempBars)
    fetch("http://" + ip + ":3000/api/writeReview/" + id + ", " + name + " " + lastName + ", " + auth.currentUser.uid + "un1qu3spl1tt3rk3y" + review)
  }

  //posts description of bar (not for production use)
  const enterDescription = async () => {
    setDescriptionInput(false)
    fetch("http://" + ip + ":3000/api/writeDescription/" + id + ", " + description)
  }

  //called when user checks into bar
  const checkIn = () => {
    fadeOut()
    fetch("http://" + ip + ":3000/api/addBarUser/" + id + ", " + auth.currentUser.uid)
    if (currentBar != null) {
      fetch("http://" + ip + ":3000/api/removeBarUser/" + BigInt(currentBar) + ", " + auth.currentUser.uid)
    }
    setDoc(doc(db, 'users', auth.currentUser.uid.toString()), {
      currentBar: id
    },
      { merge: true })
    setCurrentBar(id)
  }

  //called when user checks out of bar
  const checkOut = () => {
    fetch("http://" + ip + ":3000/api/removeBarUser/" + id + ", " + auth.currentUser.uid)
    setDoc(doc(db, 'users', auth.currentUser.uid.toString()), {
      currentBar: null
    },
      { merge: true })
    setCurrentBar(null)
  }

  //loads the list of nearby bars
  const getBars = async (latitude, longitude) => {
    fetch("http://" + ip + ":3000/api/location/" + latitude + ", " + longitude)
      .then((res) => res.json())
      .then((bars) => setBars(bars))
  }

  //called when bars is changed, checks for friends at bars
  useEffect(() => {
    if (bars.length > 0) {
      let tempBars = bars;
      tempBars.forEach(bar => {
        if (bar.users)
          friends.forEach(friend => {
            if (bar.users.includes(friend.key) && friend.visible) {
              if (bar.friendsAt == undefined) {
                bar.friendsAt = []
              }
              bar.friendsAt.push(friend)
            }
          })
      })
      setBars(tempBars)
    }
  }, [bars])


  //called when user clicks on a bar, sets info for popup modal
  const openBar = async (bar, ind) => {
    setBarName(bar.name)
    setFriendsAtBar(bar.friendsAt)
    setId(bar.id)
    setState(!state)
    setBar(bar)
    setModalVisible(!modalVisible)
    setIndex(ind)
  }

  useEffect(() => {
    //checks user location permissions
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      //checks user info from firebase
        const docRef = doc(db, 'users', auth.currentUser.uid.toString())
        const docQuery = await getDoc(docRef)
        if (docQuery.exists()) {
          setName(docQuery.data().firstName);
          setLastName(docQuery.data().lastName)
          if (docQuery.data().latitude != undefined && docQuery.data().longitude != undefined) {
            setLatitude(docQuery.data().latitude)
            setLongitude(docQuery.data().longitude)
            setMapLatitude(docQuery.data().latitude)
            setMapLongitude(docQuery.data().longitude)
            setCurrentBar(docQuery.data().currentBar)
            if (!markersSet) {
              getBars(docQuery.data().latitude, docQuery.data().longitude)
              markersSet = true;
            }
          }
        } else {
          console.log("No such document!");
        }

      //checks friends list from firebase
          const r = collection(db, 'users', auth.currentUser.uid.toString(), 'friends')
          const q = query(r, orderBy('firstName'))
          const querySnapshot = await getDocs(q)
          const friends = [];
          querySnapshot.forEach((doc) => {
            friends.push({
              ...doc.data(),
              key: doc.id,
            });
          setFriends(friends)
        })

      //checks user location
      let loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      if (!markersSet) {
        getBars(loc.coords.latitude, loc.coords.longitude)
      }
      if (coordSet == false) {
        setMapLatitude(loc.coords.latitude)
        setMapLongitude(loc.coords.longitude)
        setCoordSet(true)
      }
      const userDocRef = doc(db, 'users', auth.currentUser.uid.toString())
      await updateDoc(userDocRef, {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      })
      setRegion(true)
    })();

    //header
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
  }, []);

  if (mapLatitude == 0) {
    return (
      <View style={{ backgroundColor: 'black', width:'100%', height: '100%', justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='#0992ed'/>
      </View>
    )
  }
  return (
    <GestureRecognizer
      style={{ flex: 1, backgroundColor: 'transparent' }}
      onSwipeDown={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={{ flex: 1 }}>
          {/* define the mapview */}
          <MapView
            customMapStyle={mapStyle}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={{
              latitude: mapLatitude,
              longitude: mapLongitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.025
            }}
            onPress={e =>
              modalVisible ? setModalVisible(false) : null
            }
          >

            {/* define the marker array */}
            {bars.map((marker, index) => (
              <MapView.Marker key={index}
                extraData={state.refresh}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                onPress={() => openBar(marker, index)}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                {marker.friendsAt != undefined ?
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', margin: 5 }}>
                        {marker.friendsAt[0] != undefined ?
                          <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>{marker.friendsAt[0].firstName.charAt(0) + marker.friendsAt[0].lastName.charAt(0)}</Text>
                          </View>
                          : <View style={styles.emptyCircle}></View>}
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-end', margin: 5 }}>
                        {marker.friendsAt[1] != undefined ?
                          <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>{marker.friendsAt[1].firstName.charAt(0) + marker.friendsAt[1].lastName.charAt(0)}</Text>
                          </View>
                          : <View style={styles.emptyCircle}></View>}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-start', margin: 5 }}>
                        {marker.friendsAt[2] != undefined ?
                          <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>{marker.friendsAt[2].firstName.charAt(0) + marker.friendsAt[2].lastName.charAt(0)}</Text>
                          </View>
                          : <View style={styles.emptyCircle}></View>}
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-start', margin: 5 }}>
                        {marker.friendsAt[3] != undefined ?
                          <View style={styles.initialsCircle}>
                            <Text style={styles.initialsText}>{marker.friendsAt[3].firstName.charAt(0) + marker.friendsAt[3].lastName.charAt(0)}</Text>
                          </View>
                          : <View style={styles.emptyCircle}></View>}
                      </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute' }}>
                      <View style={marker.id != currentBar ? styles.circle : styles.goldCircle}>
                        <Ionicons style={{ marginLeft: 3 }} name='beer-outline' size={20} color='white' />
                      </View>
                    </View>
                  </View>
                  : <View style={marker.id != currentBar ? styles.circle : styles.goldCircle}>
                    <Ionicons style={{ marginLeft: 3 }} name='beer-outline' size={20} color='white' />
                  </View>}
              </MapView.Marker>
            ))}
          </MapView>


          {/* popup modal */}
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

              {/* description modal popup */}
              <View style={{ justifyContent: 'center' }}>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={descriptionInput}
                  style={{ opacity: '50%' }}
                >
                  <View style={styles.reviewModalView}>
                    <TextInput
                      scrollEnabled={true}
                      style={{ borderWidth: 1, width: '110%', height: '60%' }}
                      placeholder={'Enter your description here'}
                      multiline={true}
                      onChangeText={text => setDescription(text)}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity onPress={() => enterDescription()} style={styles.modalButton}>
                      <Text>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDescriptionI(false)} style={styles.modalButton}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>


              {/* reviews modal popup */}
              <View style={{ justifyContent: 'center' }}>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={input}
                >
                  <View style={styles.reviewModalView}>
                    <TextInput
                      scrollEnabled={true}
                      style={{ borderWidth: 1, width: '110%', height: '60%' }}
                      placeholder={'Enter your review here'}
                      multiline={true}
                      onChangeText={text => setReview(text)}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity onPress={() => enterReview()} style={styles.modalButton}>
                      <Text>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setInput(false)} style={styles.modalButton}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>

              {/* delete modal */}
              <View style={{ justifyContent: 'center' }}>
                <Modal
                  animationType='fade'
                  transparent={true}
                  visible={dropdown}
                >
                  <View style={styles.deleteModalView}>
                    <Text style={{fontSize: 20}}>Delete your review?</Text>
                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => deleteReview()} style={styles.modalButton}>
                      <Text style={{color:'white'}}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDropdown(false)} style={styles.modalButton}>
                      <Text style={{color:'white'}}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>


              <ScrollView style={styles.modalView}>
                <KeyboardAvoidingView>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* displays name of the bar and checkin button */}
                    <Text style={styles.titleText}>{barName}</Text>
                    {checkedIn ?
                      <Text style={{ paddingRight: 20 }}>Checked In!</Text>
                      : null
                    }
                    {id != currentBar ?
                      <TouchableOpacity onPress={() => checkIn()} style={styles.buttonClear}>
                        <Ionicons name="checkmark-outline" color="black" size={25} />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={() => checkOut()} style={styles.button}>
                        <Ionicons name="checkmark-outline" color="white" size={25} />
                      </TouchableOpacity>
                    }
                  </View>

                  {/* button to bring up description modal */}
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setDescriptionInput(true)} style={styles.button}>
                      <Ionicons name="create-outline" color="white" size={25} />
                    </TouchableOpacity>
                  </View> */}


                  {/* bar description */}
                  <View style={{ padding: 10 }}>
                    <Text style={styles.modalText}>{bar.description}</Text>
                  </View>

                  {/* list of friends at bar */}
                  <View style={{ backgroundColor: 'black', borderRadius: 20 }}>
                    <FlatList
                      style={{ padding: 15 }}
                      ListHeaderComponent={<Text style={{ paddingBottom: 10, color: 'white' }}>{friendsAtBar != null ? 'Friends at ' : 'No friends at ' }{barName}</Text>}
                      data={friendsAtBar}
                      extraData={state}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { navigation.navigate('FriendInfo', { uid: item.key }); setModalVisible(false); }} style={styles.friends}>
                          <Text style={{ color: 'white' }}>{item.firstName} {item.lastName} </Text>
                        </TouchableOpacity>
                      )}
                      listKey={(item, index) => "A" + index.toString()}
                      keyExtractor={(item, index) => "A" + index.toString()}
                    />
                  </View>

                  {/* list of bar reviews and review entry */}
                  <View style={{ backgroundColor: 'black', borderRadius: 20, marginTop: 20, marginBottom: 20 }}>
                    <FlatList
                      style={{ padding: 15 }}
                      ListHeaderComponent={<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                        <Text style={{ paddingBottom: 10, color: 'white' }}>Live Reviews</Text>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'space-between' }}>
                          <TouchableOpacity onPress={() => setInput(true)} style={styles.button}>
                            <Ionicons name="create-outline" color="white" size={25} />
                          </TouchableOpacity>
                        </View>
                      </View>}
                      data={bar.reviews}
                      renderItem={({ item, index }) => (
                        <View style={styles.reviews}>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={{ padding: 10 }}>{item.user}     {item.date}</Text>
                          <TouchableOpacity onPress={() => openDelete(index)} style={styles.smallButton}>
                            <Text style={{color: 'white', fontSize: 10, paddingLeft: 2, paddingRight: 2}}>X</Text>
                          </TouchableOpacity>
                          </View>
                          <Text style={{ paddingRight: 10, paddingLeft: 10 }}>{'\n'}{item.review}</Text>
                        </View>
                      )}
                      listKey={(item, index) => "B" + index.toString()}
                      keyExtractor={(item, index) => "B" + index.toString()}
                    />
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GestureRecognizer>

  );
}


const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  friends: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: '#0992ed',
    padding: 10,
    margin: 3
  },
  initialsCircle: {
    backgroundColor: '#0992ed',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'column',
    height: 20,
    width: 20,
    justifyContent: 'center',
  },
  emptyCircle: {
    borderRadius: 10,
    flexDirection: 'column',
    height: 20,
    width: 20,
    justifyContent: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 10,
    padding: 2
  },
  reviews: {
    borderWidth: 2,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
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
  goldCircle: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 30 / 2,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700'
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
    position: 'absolute',
    bottom: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  reviewModalView: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: '10%',
    alignItems: 'center',
    width: '90%',
    height: '60%',
    backgroundColor: "white",
    borderWidth: 5,
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  deleteModalView: {
    justifyContent: 'center',
    alignSelf: 'center',
    top: '40%',
    width:'50%',
    alignItems: 'center',
    backgroundColor: "white",
    borderWidth: 5,
    borderRadius: 20,
    padding: 10,
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#0992ed',
  },
  smallButton: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#0992ed',
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10
  },
  modalButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    width: '50%',
    borderRadius: 30,
    backgroundColor: '#0992ed',
    alignItems: 'center'
  },
  buttonClear: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 30,
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
    textAlign: "center",
    padding: 10
  }
});

export default HomeScreen