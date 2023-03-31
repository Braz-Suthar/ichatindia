import React from 'react'
import { Text } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Username(props) {

    const colors = props.colors

    return(
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ ...props.customStyle, color: colors.textPrimary }} >{ props.username }</Text>
    )
}


{/* <Icon name="check" size={30} color="#900" /> */}