import React from 'react'
import { StyleSheet, View } from "react-native"
import About from './About'
import ProfilePicture from './ProfilePicture'
import Username from './Username'

export default function Header(props) {

    const fullname = props.data.fullname
    const about = props.data.about
    const profilePicture = props.data.profilePictureUrl

    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ ...styles.leftContainer }}>
                <Username username={ fullname } dpURL={ profilePicture }  colors={ props.colors } customStyle={{ fontWeight: 'bold', fontSize: 36 }} />
                <About about={ about } colors={ props.colors } customStyle={{ fontSize: 18 }}/>
            </View>
            <View style={{ ...styles.rightContainer }}>
                <ProfilePicture customStyle={{ width: 60, height: 60 }} dpURL={ profilePicture } dpOnClick={ props.dpOnClick } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    leftContainer: {
        width: '77%',
    },
    rightContainer: {
        width: '22%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    }
})