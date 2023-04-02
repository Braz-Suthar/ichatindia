import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar, TextInput, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackActions } from '@react-navigation/native';
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

export default function SetupProfileScreen({ route, navigation }) {

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
            setProfilePicturePicked(imageData)
        } catch (error) {
            setProfilePicturePicked("")
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
            setCoverPicturePicked(imageData)
        } catch (error) {
            setCoverPicturePicked("")
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
            <ScrollView style={{ minHeight: '100%', backgroundColor: colors.bgPrimary }} scrollEnabled={false} showsVerticalScrollIndicator={false}>

                <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                    <View style={{ ...styles.headerContainer}}>
                        <View style={{ padding: 8 }}>
                            <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 50, }}>Setup Profile</Text>
                            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <TouchableHighlight onPress={ handleCoverPicker } style={{ ...styles.coverPhotoContainer }}>
                                    <>
                                        <View style={{ ...styles.coverContainerOverlay, backgroundColor: colors.coverContainerOverlay }}></View>
                                        <Image source={{ uri: coverPicturePicked.path }} style={{ width: 'auto', height: 150, borderRadius: 12 }}/>
                                    </>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => setShowModal(true) } style={{ ...styles.dpContainer, backgroundColor: colors.bgPrimary }}>
                                    <Image source={{ uri: profilePicturePicked.path }} style={{ width: 98, height: 98, borderRadius: 49 }} />
                                </TouchableHighlight>
                            </View>
                            <View>
                                <Text style={{ fontSize: 15, textAlign: 'center', color: colors.textSecondary, marginTop: 20, marginBottom: 20 }}>Click on above photos to replace them with yours.</Text>
                            </View>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-person'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput maxLength={20} keyboardType='default' onChange={ e => setFullname(e.nativeEvent.text ) } value={ fullname } textContentType='name' placeholder='Enter Full Name' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}></Text>
                            </View>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-lock-open'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput keyboardType='default' onChange={e => setPassword(e.nativeEvent.text)} value={ password } placeholder='Set a password' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}></Text>
                            </View>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-lock-closed'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput keyboardType='default' onChange={ e => {setConfirmPassword(e.nativeEvent.text);setErrors({ ...errors, confirmPasswordError: null })} } value={ confirmPassword } textContentType='password' placeholder='Confirm password' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}>{ errors && errors.confirmPasswordError }</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ ...styles.footerContainer }}>
                        <TouchableHighlight disabled={ !inputVerified } onPress={ handleCreateProfileClick } style={{ ...styles.buttonContainer, backgroundColor: inputVerified ? colors.blue : colors.disabledBlue }} underlayColor='#278eff' >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Setup Profile</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
            { showLoading && <LoadingScreen text={"Creating Account..."}/>}
            { showModal && <ProfilePickerScreen hideModal={ hideModal } showFlatIconPickerScreenFn={ showFlatIconPickerScreenFn } galleryPickerFunction={ handleProfilePicker } /> }
            { showFlatIconPickerScreen && <FlatIconPickerScreen hideFn={ hideFlatIconPickerScreenFn } fn={ setProfilePictureFn } /> }
        </>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    headerContainer: {
        padding: 25
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 10
    },
    coverPhotoContainer: {
        width: '100%',
        height: 150,
        marginTop: 50,
        borderRadius: 12,
    },
    coverContainerOverlay: {
        width: '100%',
        height: 150,
        position: 'absolute',
        zIndex: 1,
    },
    dpContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        padding: 15,
        borderRadius: 12,
        marginTop: 120
    },
    inputContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginVertical: 7
    }, 
    input: {
        padding: 7,
        fontSize: 20,
        flexGrow: 1,
    },
    inputErrorContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        paddingHorizontal: 5
    }
})
