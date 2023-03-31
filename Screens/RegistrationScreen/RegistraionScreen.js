import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar, TextInput, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackActions } from '@react-navigation/native';
import Colors from '../../Colors'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export default function RegistrationScreen({ route, navigation }) {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const colors = Colors[themeState]
    const [subHeadingText, setSubHeadingText] = useState("Enter your phone number below to get a verification code")
    const [confirm, setConfirm] = useState('')
    const [errorMessage, setErrorMessage] = useState(" ")
    const [otpError, setOtpError] = useState(false)
    const [code, setCode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [inputVerified, setInputVerified] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [loadingText, setLaodingText] = useState('')


    const checkPhonenumberExist = async (number) => {
        setShowLoading(false)
        const user = await firestore().collection('Users').where('phonenumber', '==', '+91' + number).get()
        if(user._docs.length){
            setShowLoading(false)
            setOtpError(false)
            setErrorMessage("+91" + number + " already exists.")
        }else{
            sendCode(number)
        }
    }

    const sendCode = async (phonenumber) => {
        setShowLoading(true)
        setLaodingText("Sending Code...")
        try{
            const confirmation = await auth().signInWithPhoneNumber('+91'+ phonenumber)
            setConfirm(confirmation)
            setSubHeadingText("A verification code has been sent to phone number +91 " + phonenumber)
            console.log('Code Sent to +91' + phoneNumber)
            setShowLoading(false)
        }catch (error) {
            console.log("Error while sending code: " + error)
            setOtpError(false)
            setErrorMessage("Couldn't send verification code. Please try again.")
            setShowLoading(false)
        }
    }

    useEffect(() => {
        setOtpError(false)
        setErrorMessage(" ")
        if(code.length > 0){
            setInputVerified(true)
        }else{
            setInputVerified(false)
        }
    }, [code])

    const handlePhonenumberInput = (event) => {
        if(!otpError){
            setErrorMessage("")
        }
        console.log(event.nativeEvent.text)
        if(event.nativeEvent.text.length == 10){
            setShowLoading(true)
            setLaodingText("Sending Code...")
            setPhoneNumber(event.nativeEvent.text)
            checkPhonenumberExist(event.nativeEvent.text)
        }else{
            setInputVerified(false)
            setPhoneNumber(event.nativeEvent.text)
        }
    }

    const verifyCode = async () => {
        setShowLoading(true)
        setLaodingText("Verifying Number...")
        try {
            await confirm.confirm(code)
            setShowLoading(false)
            navigation.dispatch(   
                StackActions.replace('SetupProfileScreen', { phoneNumber: phoneNumber}) 
            )
        } catch (error) {
            setOtpError(true)
            setErrorMessage("Invalid verification code. Please try again.")
            setShowLoading(false)
        }
    }

    return(
        <>
            <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
            <ScrollView style={{ minHeight: '100%', backgroundColor: colors.bgPrimary }} scrollEnabled={false} showsVerticalScrollIndicator={false}>

                <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                    <View style={{ ...styles.headerContainer}}>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                            <TouchableHighlight style={{ width: 30 }} onPress={() => navigation.goBack() } underlayColor={ colors.bgPrimary }>
                                <Ionicons name={'ios-chevron-back'} size={ 30 } style={{ color: colors.textSecondary }} />
                            </TouchableHighlight>
                        </View>
                        <View style={{ padding: 8 }}>
                            <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 50, marginTop: 50 }}>Create Account</Text>
                            <View>
                                <Text style={{ fontSize: 24, color: colors.textSecondary, marginTop: 20, marginBottom: 20 }}>{ subHeadingText }</Text>
                            </View>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-call'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput onChange={ handlePhonenumberInput } maxLength={10} keyboardType='phone-pad' textContentType='telephoneNumber' placeholder='Phone number' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}>{ !otpError && errorMessage }</Text>
                            </View>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-lock-open'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput onChange={e => {setCode(e.nativeEvent.text); if(otpError){ setErrorMessage("") }}} maxLength={6} keyboardType='phone-pad' textContentType='oneTimeCode' placeholder='Code' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}>{ otpError && errorMessage }</Text>
                            </View>
                            <View style={{ ...styles.inputErrorContainer, marginTop: 20 }}>
                                <Text style={{ color: colors.blue, fontSize: 16 }}>Resend Code</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ ...styles.footerContainer }}>
                        <TouchableHighlight disabled={!inputVerified} style={{ ...styles.buttonContainer, backgroundColor: inputVerified ? colors.blue : colors.disabledBlue}} underlayColor='#278eff' onPress={ () => verifyCode() }>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Create Account</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
            { showLoading && <LoadingScreen text={ loadingText } /> }
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
        height: '50%',
        padding: 25
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: '100%',
        height: '50%',
        paddingBottom: 40
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        padding: 15,
        borderRadius: 12,
        marginTop: 300
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
        flexGrow: 1
    },
    inputErrorContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        paddingHorizontal: 5
    }
})
