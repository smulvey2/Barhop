import React, {useState, useRef} from 'react'
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { auth, db} from '../firebase'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { KeyboardAvoidingView } from 'react-native';


const RegisterPhoneScreen = ({navigation}) => {
    const [value, setValue] = useState()
    const [phoneNumber, setPhoneNumber] = useState('');


// window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
//   'size': 'invisible',
//   'callback': (response) => {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     onSignInSubmit();
//   }
// }, auth);

const sendVerification = () => {
    console.log(phoneNumber)
    const appVerifier = window.recaptchaVerifier;

signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
    });
}

    return (
        <View style={{alignItems: 'center', paddingTop: 20}}>
            <View defaultCode="US"
             defaultValue={value}
             layout="first"
             onChangeText={(text) => {
               setValue(text);
             }}
             withDarkTheme
             withShadow
             autoFocus/>
             <TouchableOpacity onPress={sendVerification} style={styles.button}>
             <Text>Send Verification</Text>
             </TouchableOpacity>
        </View>
    )
}

export default RegisterPhoneScreen

const styles = StyleSheet.create({
button:{
    backgroundColor: 'green',
    width:200,
    marginTop: 10,
    height: 75,
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