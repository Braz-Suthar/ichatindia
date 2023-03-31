import React from 'react'
import { Text } from "react-native"

export default function About(props) {

    const colors = props.colors

    return(
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ ...props.customStyle, color: colors.textSecondary }} >{ props.about }</Text>
    )
}
