import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar } from "react-native"
import Colors from '../../Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default function WelcomeScreen({ route, navigation }) {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const colors = Colors[themeState] 


    return(
        <>
            <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
            <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                <View style={{ ...styles.headerContainer}}>
                    <Image source={require('../../Images/chat.png')} style={{ width: wp(20), height: wp(20) }}/>
                </View>
                <View style={{ ...styles.footerContainer}}>
                    <TouchableHighlight onPress={() => navigation.navigate('RegistrationScreen') } style={{ ...styles.buttonContainer, backgroundColor: colors.bgSecondary}} underlayColor={ colors.secondaryButtonOverlay } >
                        <Text style={{ color: colors.textPrimary, fontWeight: 'bold', fontSize: 20}} >Create Account</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => navigation.navigate('LoginScreen') } underlayColor={ '#278eff'}style={{ ...styles.buttonContainer, backgroundColor: colors.blue}}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Login</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        width: wp('100%'),
        height: hp('100%'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('50%'),
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: wp('100%'),
        height: hp('50%'),
        paddingBottom: wp(10)
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('70%'),
        padding: wp(3),
        borderRadius: wp(2.5),
        marginBottom: wp(5)
    }
})
