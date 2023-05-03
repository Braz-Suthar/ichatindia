import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Appearance, Image, TouchableHighlight } from "react-native"
import Colors from '../../Colors'


const IconV = ({fn, imageData, colors}) => {
    return(
        <TouchableHighlight underlayColor={colors.bgPrimary} onPress={() => fn(imageData)} style={{ ...styles.iconContainer, borderColor: colors.bgPrimary, backgroundColor: colors.bgSecondary }}>
            <Image source={{ uri: imageData }} style={{ width: 100, height: 100, }} />
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
            <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                { data && data.map((item) => <IconV fn={fn} key={item} colors={colors} imageData={item} />)}
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
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
