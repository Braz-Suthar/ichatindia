import React from 'react'
import { StyleSheet, View } from "react-native"
import About from './About'
import ProfilePicture from './ProfilePicture'
import Username from './Username'
import { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale } from './../../../src/Metrics'

export default function Header(props) {

    const fullname = props.data.fullname
    const about = props.data.about
    const profilePicture = props.data.profilePictureUrl

    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ ...styles.leftContainer }}>
                <Username username={ fullname } dpURL={ profilePicture }  colors={ props.colors } customStyle={{ fontWeight: 'bold', fontSize: moderateScale(28) }} />
                <About about={ about } colors={ props.colors } customStyle={{ fontSize: moderateScale(14) }}/>
            </View>
            <View style={{ ...styles.rightContainer }}>
                <ProfilePicture customStyle={{ width: horizontalScale(53), height: horizontalScale(53) }} dpURL={ profilePicture } dpOnClick={ props.dpOnClick } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: horizontalScalePercent(100),
        display: 'flex',
        flexDirection: 'row',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        paddingLeft: horizontalScale(10),
        paddingRight: horizontalScale(10),
    },
    leftContainer: {
        width: horizontalScalePercent(74),
    },
    rightContainer: {
        width: horizontalScalePercent(21),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    }
})