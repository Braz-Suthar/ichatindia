import React from 'react'
import { StyleSheet, View, TextInput } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'


export default function Search(props) {

    const colors = props.colors
    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: colors.bgSecondary, width: '100%', paddingTop: 5, paddingBottom: 5, borderRadius: 10 }}>
                <View style={{ ...styles.leftContainer }}>
                    <Ionicons name={'ios-search-outline'} size={ 18 } style={{ color: colors.textSecondary }} />
                </View>
                <View style={{ ...styles.rightContainer }}>
                    <TextInput 
                        placeholder='Search chat, group or text'
                        placeholderTextColor={colors.textSecondary}
                        multiline={false}
                        numberOfLines={1}
                        style={{ ...styles.textInput, color: colors.textPrimary }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    leftContainer: {
        width: '15%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: '80%',
    },
    textInput: {
        padding: 0,
        fontSize: 18,
        width: '100%',
    }
})