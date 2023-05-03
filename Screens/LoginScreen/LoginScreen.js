import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, TouchableHighlight, StatusBar, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'
import firestore from '@react-native-firebase/firestore'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from './../../src/StateManagement/Slices/CurrentUserSlice'
import { useDispatch } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default function LoginScreen({ navigation }) {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
    const dispatch = useDispatch()

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const colors = Colors[themeState] 
    const [errors, setErrors] = useState({})
    const [phonenumber, setPhonenumber] = useState('')
    const [password, setPassword] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [inputVerified, setInputVerified] = useState(false)

    useEffect(() => {
        if(phonenumber.length == 10 && password.length > 0){
            setInputVerified(true)
        }else{
            setInputVerified(false)
        }
    }, [phonenumber, password])

    const handleLoginClick = async () => {
        setShowLoading(false)
        try {
            const ref = firestore().collection("Users").doc('+91' + phonenumber)
            const result = await ref.get()
            if(!result.exists){
                setShowLoading(false)
                setErrors({ ...errors, phonenumberError: "+91" + phonenumber + " doesn't exist." })
            }
    
            if(result.exists){
                const userData = result.data()
                if(userData.password == password){
                    await AsyncStorage.setItem('user', phonenumber)
                    setShowLoading(false)
                    dispatch(login(userData))
                }else{
                    setShowLoading(false)
                    setErrors({ ...errors, passwordError: 'Incorrect Password.' })
                }
            }
        } catch (error) {
            setShowLoading(false)
            setErrors({ ...errors, passwordError: 'Something went wrong. Please try again.' })
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
                                Log In   
                            </Text>
                            <Text style={{ ...styles.subheading, color: colors.textSecondary }}>Log into iChat using your phonenumber and password.</Text>
                        </View>
                        <View style={{ ...styles.middle }}>
                            <View style={{ ...styles.inputContainer }}>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-call'} size={ wp(6) } styl e={{ color: colors.textSecondary }}/>
                                    <TextInput onChange={e => { setPhonenumber(e.nativeEvent.text); setErrors({ ...errors, phonenumberError: '' }) }} maxLength={10} keyboardType='phone-pad' textContentType='telephoneNumber' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput }} placeholder='Phone Number'/>
                                </View>
                                <View style={{ ...styles.inputErrorContainer }}>
                                    <Text style={{ color: 'red' }}>{ errors && errors.phonenumberError }</Text>
                                </View>
                                <View style={{ ...styles.textInputContainer, backgroundColor: colors.bgSecondary }}>
                                    <Ionicons name={'ios-lock-open'} size={ wp(6) } style={{ color: colors.textSecondary }}/>
                                    <TextInput textContentType='password' onChange={e => { setPassword(e.nativeEvent.text); setErrors({ ...errors, passwordError: '' })}} secureTextEntry={true} placeholder='Password' placeholderTextColor={ colors.textSecondary } style={{ ...styles.textinput }} />
                                </View>
                                <View style={{ ...styles.inputErrorContainer }}>
                                    <Text style={{ color: 'red' }}>{ errors && errors.passwordError }</Text>
                                </View>
                                <View style={{ ...styles.inputErrorContainer, marginTop: wp(5) }}>
                                    <Text style={{ color: colors.blue, fontSize: 16 }}>Reset Password</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.footer }}>
                            <TouchableHighlight disabled={!inputVerified} onPress={ handleLoginClick } style={{ ...styles.button, backgroundColor: inputVerified ? colors.blue : colors.disabledBlue}} underlayColor='#278eff' >
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Log In</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            { showLoading && <LoadingScreen text={"Logging..."}/> }
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
