import React from 'react'
import { StyleSheet, View, TextInput } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale } from './../../../src/Metrics'

export default function Search(props) {

    const colors = props.colors
    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: colors.bgSecondary, width: horizontalScalePercent(95.5), paddingTop: verticalScale(2), paddingBottom: verticalScale(2), borderRadius: moderateScale(6) }}>
                <View style={{ ...styles.leftContainer }}>
                    <Ionicons name={'ios-search-outline'} size={ moderateScale(17) } style={{ color: colors.textSecondary }} />
                </View>
                <View style={{ ...styles.rightContainer }}>
                    <TextInput 
                        allowFontScaling={false}
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
        width: horizontalScalePercent(100),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    leftContainer: {
        width: horizontalScalePercent(14),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: horizontalScalePercent(80),
    },
    textInput: {
        padding: 0,
        fontSize: moderateScale(15),
        width: horizontalScalePercent(76),
    }
})