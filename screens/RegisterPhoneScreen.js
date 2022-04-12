import PhoneInput from 'react-native-phone-number-input'
import React, {useState, useRef} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { auth, db } from '../firebase'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { KeyboardAvoidingView } from 'react-native';


const RegisterPhoneScreen = ({navigation}) => {
    const [value, setValue] = useState()
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <View>
            <PhoneInput defaultCode="US"
             defaultValue={value}
             layout="first"
             onChangeText={(text) => {
               setValue(text);
             }}
             withDarkTheme
             withShadow
             autoFocus/>
        </View>
    )
}

export default RegisterPhoneScreen

const styles = StyleSheet.create({
button:{
    width:200,
    marginTop: 10,
    alignContent:'center',
    justifyContent: 'center'
},
container: {
    flex: 1,
    justifyContent:'center',
    alignContent: 'center'
},
inner: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
},
header: {
    fontSize: 36,
    marginBottom: 48,
},
input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
},
});