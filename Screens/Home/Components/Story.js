import React from 'react'
import { StyleSheet, Text, View, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale } from './../../../src/Metrics'


const StoryUI = (props) => {

    const colors = props.colors
    
    return(
        <View style={{ ...styles.story }}>
            <View style={{ ...styles.storyUiOuter, borderColor: colors.blue, backgroundColor: colors.bgPrimary }}>
                <View style={{ ...styles.storyui }}></View>
            </View>
            <View style={{ width: horizontalScale(85), display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Text allowFontScaling={false} style={{ ...styles.storyText }} numberOfLines={1} ellipsizeMode={'tail'} >Braz Suthar</Text>
            </View>
        </View>
    )
}


export default function Story(props) {

    const colors = props.colors

    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ ...styles.header }}>
                <Text allowFontScaling={false} style={{ ...styles.headerText, color: colors.textPrimary }}>Story</Text>
                <Ionicons name={'ios-add-outline'} size={ moderateScale(28) } style={{ color: colors.blue, fontWeight: 'bold' }} />
            </View>
            <ScrollView style={{ paddingStart: horizontalScale(10), paddingEnd: horizontalScale(10) }} showsHorizontalScrollIndicator={false} contentInset={20} contentInsetAdjustmentBehavior={'scrollableAxes'} horizontal={true} alwaysBounceHorizontal={true}>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <StoryUI colors={ colors }/>
                <View style={{ width: horizontalScale(20) }}></View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: horizontalScalePercent(100),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(0),
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: horizontalScalePercent(100),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: horizontalScale(10),
        paddingRight: horizontalScale(10),
    },
    headerText: {
        fontSize: moderateScale(28),
        fontWeight: 'bold'
    },
    story: {
        width: horizontalScale(80),
        height: horizontalScale(105),
        marginRight: horizontalScale(3),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    storyUiOuter: {
        width: horizontalScale(74),
        height: horizontalScale(74),
        borderRadius: horizontalScale(37),
        borderStyle: 'solid',
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    storyui: {
        width: horizontalScale(66),
        height: horizontalScale(66),
        backgroundColor: 'white',
        borderRadius: horizontalScale(33),
    },
    storyText: {
        marginTop: verticalScale(2),
        fontSize: moderateScale(12),
    }
})