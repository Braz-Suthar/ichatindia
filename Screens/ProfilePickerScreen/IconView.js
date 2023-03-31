import { CurrentRenderContext } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Appearance, Image, TouchableHighlight, StatusBar, TextInput, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'


const IconV = ({fn, imageData, colors}) => {
    return(
        <TouchableHighlight onPress={() => fn(imageData)} style={{ ...styles.iconContainer, backgroundColor: colors.bgSecondary }}>
            <Image source={{ uri: imageData }} style={{ width: 100, height: 100 }} />
        </TouchableHighlight>
    )
}

export default function IconView({ fn, data }) {

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
            <View style={{ ...styles.mainContainer }}>
                { data && data.map((item, index) => <IconV fn={fn} key={item} colors={colors} imageData={item} />)}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 7
    },
    iconContainer: {
        width: 125,
        height: 125,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
