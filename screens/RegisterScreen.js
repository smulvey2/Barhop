import React, {useState, useRef} from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { auth, db } from '../firebase'
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { KeyboardAvoidingView } from 'react-native';


const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const userNameRef = useRef()
    const passwordRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()

    const register = ({navigation}) => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            user.updateProfile({
                displayName: userName,
                photoURL: imageURL ? imageURL:"https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
                friends: "my friend"
            })
            db.collection("users").doc(user.uid).set({
                name: userName,
                email: email,
                photoURL: imageURL ? imageURL:"https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
                firstName: firstName,
                lastName: lastName
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
            var errorMessage = error.Message;
            alert(errorMessage)
        })
        navigation.popToTop()
    }
    return (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inner}>
            <Input
            placeholder = "Enter your email"
            label = "Email"
            leftIcon = {{type:'material', name:'email'}}
            value = {email}
            onChangeText = {text=> setEmail(text)}
            onSubmitEditing={() => { userNameRef.current.focus(); }}
            />
            <Input
            placeholder = "Enter your username"
            label = "UserName"
            leftIcon = {{type:'material', name:'badge'}}
            value = {userName}
            onChangeText = {text=> setUserName(text)}
            ref={userNameRef}
            onSubmitEditing={() => { passwordRef.current.focus(); }}
            />
            <Input
            placeholder = "Enter your password"
            label = "Password"
            leftIcon = {{type:'material', name:'lock'}}
            value = {password}
            onChangeText = {text=> setPassword(text)}
            secureTextEntry
            ref={passwordRef}
            onSubmitEditing={() => { firstNameRef.current.focus(); }}
            />
            <Input
            placeholder = "Enter your First Name"
            label = "First Name"
            leftIcon = {{type:'material', name:'badge'}}
            value = {firstName}
            onChangeText = {text=> setFirstName(text)}
            ref={firstNameRef}
            onSubmitEditing={() => { lastNameRef.current.focus(); }}
            />
            <Input
            placeholder = "Enter your Last Name"
            label = "Last Name"
            leftIcon = {{type:'material', name:'badge'}}
            value = {lastName}
            onChangeText = {text=> setLastName(text)}
            ref={lastNameRef}
            onSubmitEditing={register}
            />
            <Button title="Next" style ={styles.button} onPress={() => navigation.navigate('RegisterPhoneScreen')}/>
            <Button title="Sign Up" style ={styles.button} onPress={register}/>
            <View style={{ flex : 1 }} />
            </View>
                    </TouchableWithoutFeedback>

    )
}

export default RegisterScreen

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