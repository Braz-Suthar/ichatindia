import { CurrentRenderContext } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar, TextInput, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'


export default function ProfilePickerScreen({ galleryPickerFunction, hideModal, showFlatIconPickerScreenFn }) {

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
            <TouchableHighlight onPress={ hideModal } style={{ ...styles.mainContainer, backgroundColor: colors.overlayBackgroundColor }}>
                <View style={{ ...styles.modalContainer, backgroundColor: colors.bgSecondary }}>
                    <TouchableHighlight onPress={ showFlatIconPickerScreenFn } style={{ ...styles.galleryButton }}>
                        <>
                            <Image source={require("./../../Images/FlatIconLogo.png")} style={{ width: 24, height: 24, marginRight: 12 }}/>
                            <Text style={{ ...styles.btnText, color: colors.textPrimary }}>Choose from FlatIcon</Text>
                        </>
                    </TouchableHighlight>
                    <View style={{ ...styles.lineBreak, borderColor: colors.bgPrimary }}></View>
                    <TouchableHighlight onPress={ galleryPickerFunction } style={{ ...styles.galleryButton }}>
                        <>
                            <Ionicons name={'ios-images'} size={ 24 } style={{ color: colors.blue, marginRight: 12 }} />
                            <Text style={{ ...styles.btnText, color: colors.textPrimary }}>Choose from Gallery</Text>
                        </>
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 99999999,
    },
    modalContainer: {
        width: '95%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 15
    },
    galleryButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    btnText: {
        fontSize: 20
    },
    lineBreak: {
        width: '100%',
        borderWidth: 2,
        borderStyle: 'solid',
    }
})