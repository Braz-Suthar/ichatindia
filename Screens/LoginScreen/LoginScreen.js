import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, TouchableHighlight, StatusBar, TextInput, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'
import firestore from '@react-native-firebase/firestore'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from './../../src/StateManagement/Slices/CurrentUserSlice'
import { useDispatch } from 'react-redux';

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
            <ScrollView style={{ minHeight: '100%', backgroundColor: colors.bgPrimary }} scrollEnabled={false} showsVerticalScrollIndicator={false}>

                <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                    <View style={{ ...styles.headerContainer}}>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                            <TouchableHighlight style={{ width: 30 }} onPress={() => navigation.goBack() } underlayColor={ colors.bgPrimary }>
                                <Ionicons name={'ios-chevron-back'} size={ 30 } style={{ color: colors.textSecondary }} />
                            </TouchableHighlight>
                        </View>
                        <View style={{ padding: 8 }}>
                            <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 50, marginVertical: 50 }}>Login</Text>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-call'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput onChange={e => { setPhonenumber(e.nativeEvent.text); setErrors({ ...errors, phonenumberError: '' }) }} keyboardType='phone-pad' textContentType='telephoneNumber' placeholder='Phone number' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}>{ errors && errors.phonenumberError }</Text>
                            </View>
                            <View style={{ ...styles.inputContainer, backgroundColor: colors.bgSecondary }}>
                                <Ionicons name={'ios-lock-closed'} size={ 24 } style={{ color: colors.textSecondary, marginRight: 12 }} />
                                <TextInput textContentType='password' onChange={e => { setPassword(e.nativeEvent.text); setErrors({ ...errors, passwordError: '' })}} secureTextEntry={true} placeholder='Password' style={{ ...styles.input, color: colors.textSecondary }} placeholderTextColor={ colors.textSecondary } />
                            </View>
                            <View style={{ ...styles.inputErrorContainer }}>
                                <Text style={{ color: 'red' }}>{ errors && errors.passwordError }</Text>
                            </View>
                            <View style={{ ...styles.inputErrorContainer, marginTop: 20 }}>
                                <Text style={{ color: colors.blue, fontSize: 16 }}>Reset Password</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ ...styles.footerContainer }}>
                        <TouchableHighlight disabled={!inputVerified} style={{ ...styles.buttonContainer, backgroundColor: inputVerified ? colors.blue : colors.disabledBlue }} underlayColor='#278eff' onPress={ handleLoginClick }>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>Login</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
            { showLoading && <LoadingScreen text={"Logging..."}/> }
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
