import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Appearance, StatusBar, Animated, Easing } from "react-native"
import Colors from '../../Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'
import { login, logout } from './../../src/StateManagement/Slices/CurrentUserSlice'
import { useDispatch } from 'react-redux'

export default function SplashScreen() {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
    const dispatch = useDispatch()

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    useEffect(() => {
        
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('user')
                if(value !== null) {
                    // value previously stored
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
            } catch(e) {
                dispatch(logout('noUserLoggedIn'))
            }
        }
        getData()

    }, [])

    const colors = Colors[themeState] 

    const imageScale = new Animated.Value(0)

    useEffect(() => {
        Animated.timing(imageScale, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start()
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
