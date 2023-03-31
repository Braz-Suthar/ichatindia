import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native'

export default function ShowDPModal(props) {

    const colors = props.colors  
    const dpUrl = props.dpUrl

    return (
        <Pressable onPress={() => props.unSetShowDPURL()} style={{ ...styles.showDPModal, backgroundColor: colors.overlayBackgroundColor }}>
            <View style={{ ...styles.dpView, backgroundColor: colors.bgSecondary }}>
                <Image source={{uri: dpUrl}} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    showDPModal: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dpView: {
        width: 300,
        height: 300,
        borderRadius: 20
    }
})

