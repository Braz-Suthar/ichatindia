import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, KeyboardAvoidingView, TouchableHighlight, StatusBar, TextInput, TouchableWithoutFeedback, Keyboard, Platform } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackActions } from '@react-navigation/native';
import Colors from '../../Colors'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default function RegistrationScreen({ navigation }) {

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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ ...styles.keyboardAvoiding, backgroundColor: colors.bgPrimary }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={{ ...styles.mainContainer }}>
                        <View style={{ ...styles.header }}>
                            <View style={{ ...styles.topbar }}>
                                <TouchableHighlight style={{ width: wp('37') }} onPress={() => navigation.goBack() } underlayColor={ colors.bgPrimary }>
                                    <View style={{ ...styles.backbutton }}>
                                        <Ionicons name={'ios-chevron-back'} size={ wp(8) } style={{ color: colors.blue }} />
                                        <Text style={{ color: colors.blue, fontSize: 19 }}>Welcome Screen</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <Text style={{ ...styles.heading, color: colors.blue }}>
                                Create Account   
                            </Text>
                            <Text style={{ ...styles.subheading, color: colors.textSecondary }}>
                                { subHeadingText }
                            </Text>
                        </View>
                        <View style={{ ...styles.middle }}>
                            <View style={{ ...styles.inputContainer }}>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-call'} size={ wp(6) } styl e={{ color: colors.textSecondary }}/>
                                    <TextInput onChange={ handlePhonenumberInput } maxLength={10} keyboardType='phone-pad' textContentType='telephoneNumber' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput }} placeholder='Phone Number'/>
                                </View>
                                <View style={{ ...styles.inputErrorContainer }}>
                                    <Text style={{ color: 'red' }}>{ !otpError && errorMessage }</Text>
                                </View>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-lock-open'} size={ wp(6) } style={{ color: colors.textSecondary }}/>
                                    <TextInput onChange={e => {setCode(e.nativeEvent.text); if(otpError){ setErrorMessage("") }}} maxLength={6} keyboardType='phone-pad' textContentType='oneTimeCode' placeholder='Code' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput }} />
                                </View>
                                <View style={{ ...styles.inputErrorContainer }}>
                                    <Text style={{ color: 'red' }}>{ otpError && errorMessage }</Text>
                                </View>
                                <View style={{ ...styles.inputErrorContainer, marginTop: wp(5) }}>
                                    <Text style={{ color: colors.blue, fontSize: 16 }}>Resend Code</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.footer }}>
                            <TouchableHighlight disabled={!inputVerified} style={{ ...styles.button, backgroundColor: inputVerified ? colors.blue : colors.disabledBlue}} underlayColor='#278eff' onPress={ () => verifyCode() }>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Create Account</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            { showLoading && <LoadingScreen text={ loadingText } /> }
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
    topbar: {
        width: wp('90%')
    },
    backbutton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    heading: {
        fontSize: 38,
        marginVertical: wp(5),
        fontWeight: 'bold',
        width: wp('80%'),
    },
    subheading: {
        fontSize: 18,
        marginBottom: wp(6),
        width: wp('80%'),
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
