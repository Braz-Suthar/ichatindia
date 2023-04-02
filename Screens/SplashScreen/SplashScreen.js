import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Appearance, StatusBar, Animated, Easing, PermissionsAndroid } from "react-native"
import Colors from '../../Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'
import { login, logout } from './../../src/StateManagement/Slices/CurrentUserSlice'
import { useDispatch } from 'react-redux'
import Contacts, { getContactsByEmailAddress } from 'react-native-contacts';
import { set } from './../../src/StateManagement/Slices/MobileContactsSlice'

export default function SplashScreen() {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
    const dispatch = useDispatch()

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const getStoredContacts = async () => {
        try {
            const contacts = await AsyncStorage.getItem('mobileContacts') 
            if(contacts == null) return {}
            return JSON.parse(contacts)
        } catch (error) {
            console.log(error)
        }
    }

    const getMobileContacts = async () => {
        const contactsCount = await Contacts.getCount()
        let mobileContacts = await getStoredContacts()
        let mobileContactsCount = await AsyncStorage.getItem("mobileContactsCount")
        mobileContactsCount = mobileContactsCount == null ? 0 : mobileContactsCount
        if(mobileContactsCount == 0 || contactsCount != mobileContactsCount){
            const contacts = await Contacts.getAll()
            contacts.forEach(contact => {
                if(contact.phoneNumbers[0]){
                    const number = contact.phoneNumbers[0].number.toString().replaceAll(' ', '')
                    const pn = number.startsWith("+91") ? number : "+91" + number 
                    let pn_ = pn.replaceAll(' ', '')
                    mobileContacts[pn_] = {
                        fullname: contact.displayName,
                        phonenumber: pn_
                    }
                }
            })
            await AsyncStorage.setItem("mobileContacts", JSON.stringify(mobileContacts))
            await AsyncStorage.setItem("mobileContactsCount", '' + contactsCount)
        } 
        dispatch(set(mobileContacts))
        checkLoginStatus()
    }

    const requestContactsReadPermission = async () => {
        const isGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        if (isGranted === PermissionsAndroid.RESULTS.GRANTED) {
            getMobileContacts()
        }else{
            const mobileContacts = await getStoredContacts()
            mobileContacts && dispatch(set(mobileContacts))
            checkLoginStatus()
        }
    }

    const checkLoginStatus = async () => {
        const value = await AsyncStorage.getItem('user')
        if(value !== null) {
            const ref = firestore().collection("Users").doc('+91' + value)
            const result = await ref.get()
            if(result.exists){
                const userData = result.data()
                dispatch(login(userData))
            }else{
                dispatch(logout('noUserLoggedIn'))
            }
        }else{
            dispatch(logout('noUserLoggedIn'))
        }
    }

    const checkContactsReadPermission = async () => {
        const isContactsReadPermissionGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        if(isContactsReadPermissionGranted){
            getMobileContacts()
        }else{
            requestContactsReadPermission()
        }
    }
    

    const colors = Colors[themeState] 

    const imageScale = new Animated.Value(0)

    useEffect(() => {
        Animated.timing(imageScale, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if(finished) checkContactsReadPermission()
        })
    }, [])
     
    return(
        <>
            <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
            <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                <Animated.Image source={require('../../Images/chat.png')} style={{ width: 80, height: 80, transform: [{ scale: imageScale.interpolate({ inputRange: [0,1], outputRange: [15, 1] }) }] }}/>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
