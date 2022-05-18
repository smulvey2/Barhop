import React, {useEffect, useRef, useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const passwordRef = useRef()
    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            var user = userCredential.user;
        })
        .catch((error) => {
            var errorMessage = error.message
            alert(error)
        })
    }
    useEffect(()=> {
        const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              navigation.replace('App Home')
              // ...
            } else {
              // User is signed out
              // ...
              navigation.canGoBack()&&navigation.popToTop()
            }
          });
          return unsubscribe
    },[]

    )
    return (
        <View style = {styles.container}>
            <Input
            placeholder = "Enter your email"
            leftIcon = {{type:'material', name:'email'}}
            value = {email}
            onChangeText = {text=> setEmail(text)}
            onSubmitEditing={() => { passwordRef.current.focus(); }}
            />
            <Input
            placeholder = "Enter your password"
            leftIcon = {{type:'material', name:'lock'}}
            value = {password}
            ref = {passwordRef}
            onChangeText = {text=> setPassword(text)}
            secureTextEntry
            onSubmitEditing={signIn}
            />

            <Button title="Login" style={styles.button} onPress = {signIn}/>
            <Button title="Sign Up" style ={styles.button} onPress={()=>navigation.navigate('Register')}/>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
button:{
    width:200,
    marginTop: 10
},
container:{
    flex: 1,
    alignItems: 'center',
    padding: 10
}

})