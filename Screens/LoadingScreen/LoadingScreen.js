import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, Easing, StatusBar, TextInput, ScrollView, Animated } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/EvilIcons'
import Colors from '../../Colors'


export default function LoadingScreen({ text }) {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const colors = Colors[themeState] 

    const loaderRotation = new Animated.Value(0)

    const loadingAnimation = () => {
        Animated.loop(
            Animated.timing(loaderRotation, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start()
    }

    loadingAnimation()

    return(
        <>
            <View style={{ ...styles.mainContainer, backgroundColor: colors.overlayBackgroundColor }}>
                <Animated.View style={{ ...styles.modalContainer, transform: [{ rotateZ: loaderRotation.interpolate({ inputRange: [0,1], outputRange: ['0deg', '360deg'] }) }] }}>
                    <FontAwesome5 name={'spinner-3'} size={ 100 } style={{ color: colors.blue, padding: 10 }} />
                </Animated.View>
                <Text style={{ ...styles.text, color: colors.textSecondary }}>{ text }</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 999999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
})