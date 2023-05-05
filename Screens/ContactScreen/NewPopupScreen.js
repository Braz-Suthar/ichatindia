import { CurrentRenderContext } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar, TextInput, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import { horizontalScalePercent, moderateScale, verticalScalePercent } from '../../src/Metrics';


export default function NewPopupScreen({ chatIndividualyFunction, hideModal, createNewGroupFunction }) {

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
            <TouchableHighlight onPress={ hideModal } underlayColor={ colors.bgPrimary } style={{ ...styles.mainContainer, backgroundColor: colors.overlayBackgroundColor }}>
                <View style={{ ...styles.modalContainer, backgroundColor: colors.bgSecondary }}>
                    <TouchableHighlight onPress={ chatIndividualyFunction } underlayColor={ colors.bgPrimary } style={{ ...styles.button }}>
                        <>
                            {/* <Image source={require("./../../Images/FlatIconLogo.png")} style={{ width: 24, height: 24, marginRight: 12 }}/> */}
                            <Ionicons name={'ios-person-add'} size={ moderateScale(24) } style={{ color: colors.blue, marginRight: moderateScale(12) }} />
                            <Text allowFontScaling={false} style={{ ...styles.btnText, color: colors.textPrimary }}>Chat Individualy</Text>
                        </>
                    </TouchableHighlight>
                    <View style={{ ...styles.lineBreak, borderColor: colors.bgPrimary }}></View>
                    <TouchableHighlight onPress={ createNewGroupFunction } underlayColor={ colors.bgPrimary } style={{ ...styles.button }}>
                        <>
                            <MIcons name={'group-add'} size={ moderateScale(30) } style={{ color: colors.blue, marginRight: moderateScale(12) }} />
                            <Text allowFontScaling={false} style={{ ...styles.btnText, color: colors.textPrimary }}>Create New Group</Text>
                        </>
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: horizontalScalePercent(100),
        height: verticalScalePercent(100),
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 99999999,
    },
    modalContainer: {
        width: horizontalScalePercent(95),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: moderateScale(15),
        marginBottom: moderateScale(15)
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: horizontalScalePercent(100),
        padding: moderateScale(15),
    },
    btnText: {
        fontSize: moderateScale(20)
    },
    lineBreak: {
        width: horizontalScalePercent(100),
        borderWidth: moderateScale(2),
        borderStyle: 'solid',
    }
})