import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'
import ImagePicker from 'react-native-image-crop-picker'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import ProfilePickerScreen from '../ProfilePickerScreen/ProfilePickerScreen'
import FlatIconPickerScreen from '../ProfilePickerScreen/FlatIconPickerScreen';
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import uuid from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { login } from './../../src/StateManagement/Slices/CurrentUserSlice'
import { useDispatch } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default function SetupProfileScreen({ route }) {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
    const dispatch = useDispatch()

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const colors = Colors[themeState] 
    const phonenumber = route.params.phoneNumber
    const [profilePicturePicked, setProfilePicturePicked] = useState({path: "https://firebasestorage.googleapis.com/v0/b/ichatindia.appspot.com/o/FlatIcons%2F45.png?alt=media&token=775e27ce-8dca-4a2c-98c0-01cb0315d03f"})
    const [coverPicturePicked, setCoverPicturePicked] = useState({path: "https://firebasestorage.googleapis.com/v0/b/ichatindia.appspot.com/o/Assets%2Fdefaultcover.jpg?alt=media&token=f4a500fa-9f02-4a6a-a6ba-1a632cd2f62e"})
    const [errors, setErrors] = useState({})
    const [inputVerified, setInputVerified] = useState(false)
    const [fullname, setFullname] = useState('')
    const [password, setPassword] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showFlatIconPickerScreen, setShowFlatIconPickerScreen] = useState(false)

    const hideModal = () => {
        setShowModal(false)
    }

    const showFlatIconPickerScreenFn = () => {
        setShowFlatIconPickerScreen(true)
    }

    const hideFlatIconPickerScreenFn = () => {
        setShowFlatIconPickerScreen(false)
    }

    const setProfilePictureFn = (url) => {
        setProfilePicturePicked({path: url})
        hideFlatIconPickerScreenFn()
        hideModal()
    }

    const handleProfilePicker = async () => {
        setShowModal(false)
        try {
            const imageData = await ImagePicker.openPicker({
                width: 500,
                height: 500,
                cropping: true,
                mediaType: 'photo',
                cropperActiveWidgetColor: colors.blue,
                cropperStatusBarColor: colors.bgPrimary,
                cropperToolbarColor: colors.bgPrimary,
                cropperToolbarWidgetColor: colors.textPrimary,
                freeStyleCropEnabled: true,
                cropperToolbarTitle: 'Edit Profile Picture',
                cropperCircleOverlay: true,
                enableRotationGesture: true,
            })
            if(imageData)
                setProfilePicturePicked(imageData)
        } catch (error) {
            setErrors({ ...errors, profileError: 'Error while picking profile picture'  + error })
        }
    }
    
    const handleCoverPicker = async () => {
        try {
            const imageData = await ImagePicker.openPicker({
                width: 400,
                height: 300,
                cropping: true,
                mediaType: 'photo',
                cropperActiveWidgetColor: colors.blue,
                cropperStatusBarColor: colors.bgPrimary,
                cropperToolbarColor: colors.bgPrimary,
                cropperToolbarWidgetColor: colors.textPrimary,
                freeStyleCropEnabled: true,
                cropperToolbarTitle: 'Edit Cover Picture',
                enableRotationGesture: true,
            })
            if(imageData)
                setCoverPicturePicked(imageData)
        } catch (error) {
            setErrors({ ...errors, coverError: 'Error while picking cover picture'  + error })
        }
    }


    const writeData = async () => {

        try {
            await messaging().registerDeviceForRemoteMessages()
            const token = await messaging().getToken()
            const profileImage = await fetch(profilePicturePicked.path)
            const profileImageBlob = await profileImage.blob()
            const profileImageRef = storage().ref('/Images/').child(uuid.v4() + '.png')
            await profileImageRef.put(profileImageBlob)
            const profilePictureUrl = await profileImageRef.getDownloadURL()
            setProfilePicturePicked({ path: profilePictureUrl })
            const coverImage = await fetch(coverPicturePicked.path)
            const coverImageBlob = await coverImage.blob()
            const coverImageRef = storage().ref('/Images/').child(uuid.v4() + '.png')
            await coverImageRef.put(coverImageBlob)
            const coverPictureUrl = await coverImageRef.getDownloadURL()
            setCoverPicturePicked({ path: coverPictureUrl })
            const data = {
                fullname: fullname,
                password: password,
                phonenumber: '+91' + phonenumber,
                coverPicture: coverPictureUrl,
                profilePicture: profilePictureUrl,
                isActive: true,
                about: "Default",
                token: token
            }
            console.log(data)
            await firestore().collection("Users").doc("+91" + phonenumber).set(data)
            return true
        } catch (error) {
            console.log(error)
            setErrors({ confirmPasswordError: 'Something went wrong. Please try again.' })
            return false
        }
    }

    const handleCreateProfileClick = async () => {
        setShowLoading(true)
        if (inputVerified){
            if(password != confirmPassword){
                setErrors({ ...errors, confirmPasswordError: "Passwords don't match" })
                setShowLoading(false)
            }else{
                try{
                    const result = await writeData()
                    setShowLoading(false)
                    if(result){
                        const user = await firestore().collection("Users").doc("+91" + phonenumber).get()
                        if(user.exists){
                            const userData = await user.data()
                            await AsyncStorage.setItem('user', phonenumber)
                            dispatch(login(userData))
                        }
                    }else{
                        setErrors({ confirmPasswordError: 'Something went wrong. Please try again.' })
                    }
                }catch(error){
                    setErrors({ confirmPasswordError: 'Something went wrong. Please try again.' })
                }
            }
        }

    }

    useEffect(() => {
        if(fullname.length > 0 && password.length > 0 && confirmPassword.length > 0){
            setInputVerified(true)
        }else{
            setInputVerified(false)
        }
    }, [fullname, password, confirmPassword])

    return(
        <>
            <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ ...styles.keyboardAvoiding, backgroundColor: colors.bgPrimary }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={{ ...styles.mainContainer }}>
                        <View style={{ ...styles.header }}>
                            <Text style={{ ...styles.heading, color: colors.blue, }}>Setup Profile</Text>
                            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <TouchableHighlight onPress={ handleCoverPicker } underlayColor={ colors.bgPrimary } style={{ ...styles.coverPhotoContainer }}>
                                    <>
                                        <View style={{ ...styles.coverContainerOverlay, backgroundColor: colors.coverContainerOverlay }}></View>
                                        <Image source={{ uri: coverPicturePicked.path }} style={{ width: 'auto', height: wp(50), borderRadius: wp(3) }}/>
                                    </>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => setShowModal(true) } underlayColor={ colors.bgPrimary } style={{ ...styles.dpContainer, backgroundColor: colors.bgPrimary }}>
                                    <Image source={{ uri: profilePicturePicked.path }} style={{ width: wp(28), height: wp(28), borderRadius: wp(14) }} />
                                </TouchableHighlight>
                            </View>
                            <View>
                                <Text style={{ fontSize: 15, textAlign: 'center', color: colors.textSecondary, marginTop: wp(3), marginBottom: wp(3) }}>Click on above photos to replace them with yours.</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.middle }}>
                            <View style={{ ...styles.inputContainer }}>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-person'} size={ wp(6) } style={{ color: colors.textSecondary }}/>
                                    <TextInput returnKeyType='next' maxLength={20} keyboardType='default' onChange={ e => setFullname(e.nativeEvent.text ) } value={ fullname } textContentType='name' placeholder='Enter Full Name' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput, color: colors.textSecondary }} />
                                </View>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-lock-open'} size={ wp(6) } style={{ color: colors.textSecondary }}/>
                                    <TextInput returnKeyType='next' keyboardType='default' onChange={e => setPassword(e.nativeEvent.text)} value={ password } placeholder='Set a password' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput, color: colors.textSecondary }} />
                                </View>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-lock-closed'} size={ wp(6) } style={{ color: colors.textSecondary }}/>
                                    <TextInput returnKeyType='done' keyboardType='default' onChange={ e => {setConfirmPassword(e.nativeEvent.text);setErrors({ ...errors, confirmPasswordError: null })} } value={ confirmPassword } textContentType='password' placeholder='Confirm password' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput }} />
                                </View>
                                <View style={{ ...styles.inputErrorContainer }}>
                                    <Text style={{ color: 'red' }}>{ errors && errors.confirmPasswordError }</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.footer }}>
                            <TouchableHighlight disabled={ !inputVerified } onPress={ handleCreateProfileClick } style={{ ...styles.button, backgroundColor: inputVerified ? colors.blue : colors.disabledBlue}} underlayColor='#278eff' >
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Setup Profile</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            { showLoading && <LoadingScreen text={"Creating Account..."}/>}
            { showModal && <ProfilePickerScreen hideModal={ hideModal } showFlatIconPickerScreenFn={ showFlatIconPickerScreenFn } galleryPickerFunction={ handleProfilePicker } /> }
            { showFlatIconPickerScreen && <FlatIconPickerScreen hideFn={ hideFlatIconPickerScreenFn } fn={ setProfilePictureFn } /> }
        </>
    )

}

const styles = StyleSheet.create({
    keyboardAvoiding: {
        padding: wp(6),
        width: wp('100%'),
        height: hp('100%'),
    },
    mainContainer: {
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 38,
        fontWeight: 'bold',
        width: wp('90%'),
    },
    coverPhotoContainer: {
        width: wp('90%'),
        height: wp(50),
        marginTop: wp(5),
        borderRadius: wp(3),
    },
    coverContainerOverlay: {
        width: wp('90%'),
        height: wp(50),
        position: 'absolute',
        zIndex: 1,
    },
    dpContainer: {
        width: wp(30),
        height: wp(30),
        borderRadius: wp(15),
        marginTop: wp(-15),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middle: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputContainer: {
        width: wp('80%'),
    },
    textInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: wp(3),
        marginVertical: wp(3),
        paddingHorizontal: wp(3)
    },
    textinput: {
        margin: 0,
        fontSize: 18,
        flexGrow: 1,
        paddingVertical: wp(1.5),
        paddingHorizontal: wp(2.5),
        width: wp('70%')
    },
    footer: {
        paddingVertical: wp(4),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('80%'),
        padding: wp(3),
        borderRadius: wp(3),
    },
    inputErrorContainer: {
        width: wp('80%'),
        display: 'flex',
        flexDirection: 'row-reverse',
        paddingHorizontal: wp(1)
    }
})
