import React from 'react'
import { Image, TouchableWithoutFeedback  } from "react-native"

export default function ProfilePicture(props) {

    const dpURL = props.dpURL

    return(
        <TouchableWithoutFeedback onPress={() => { props.dpOnClick(dpURL) }} >
            <Image source={{ uri: dpURL }} style={{ ...props.customStyle, borderRadius: 50 }}  />    
        </TouchableWithoutFeedback>
    )
}
