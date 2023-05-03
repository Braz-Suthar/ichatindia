import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Appearance, TouchableHighlight, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Colors from '../../Colors'
import IconView from './IconView';
import storage from '@react-native-firebase/storage'
import _ from './_'

export default function FlatIconPickerScreen({ fn, hideFn }) {

    const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeState(colorScheme)
        })
        return () => subscription.remove()
    }, [])

    const colors = Colors[themeState] 
    const [images, setImages] = useState([])
    const [imagesList, setImagesList] = useState([])

    async function fetchFlatIconsImages(){
        const imageRefs = await storage().ref('/FlatIcons/').listAll()
        const urls = await Promise.all(imageRefs.items.map(ref => ref.getDownloadURL()))
        setImages(urls)
    }

    useEffect(() => {
        const data = _(images)
        setImagesList(data)
    }, [images])

    useEffect(() => {
        fetchFlatIconsImages()
    }, [])

    return(
        <>
            <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
                <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={true} style={{ ...styles.scrollViewContainer, backgroundColor: colors.bgPrimary }}>
                    <View style={{ height: 20, backgroundColor: colors.bgPrimary }}></View>
                    { imagesList && imagesList.map((images, index) => <IconView fn={fn} key={index} data={images}/>)}
                    <View style={{ height: 80 }}></View>
                </ScrollView>
                <View  style={{ ...styles.buttonContainer }}>
                    <TouchableHighlight underlayColor={ colors.bgPrimary } style={{ ...styles.button, backgroundColor: colors.bgSecondary }} onPress={hideFn} >
                        <>
                            <Ionicons name={'ios-close-circle-outline'} size={ 24 } style={{ color: colors.blue, marginRight: 12 }} />
                            <Text style={{ fontSize: 20, color: colors.textSecondary }}>Close FlatIcon Gallery</Text>
                        </>
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 999999999999,
    },
    scrollViewContainer: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '95%',
        borderRadius: 15,
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
})