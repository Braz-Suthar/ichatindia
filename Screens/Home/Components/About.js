import React from 'react'
import { Text } from "react-native"

export default function About(props) {

    const colors = props.colors

    return(
        <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode={'tail'} style={{ ...props.customStyle, color: colors.textSecondary }} >{ props.about }</Text>
    )
}
