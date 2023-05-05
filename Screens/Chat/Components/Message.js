import React from 'react'
import { Text, View, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { horizontalScalePercent, moderateScale } from '../../../src/Metrics'

export default function Message(props) {

    const colors = props.colors
    const messageData = props.message

    return(
        <View style={{...styles.mainContainer, transform: [{ scaleY: -1 }]}}>
            { props.received ? <>
                <View style={styles.messageReceivedBackground}>
                    <View style={{ ...styles.messageReceivedOuter, backgroundColor: colors.bgSecondary }}>
                        <Text allowFontScaling={false} userSelect='all' selectable={true} dataDetectorType='all' style={{...styles.messageText, color: colors.textSecondary }}>{ messageData.text }</Text>
                    </View>
                </View>
                <Text allowFontScaling={false} style={{...styles.messageTime, color: colors.textSecondary }}>{ `${ messageData.sentAt && messageData.sentAt.toDate().toString().split(' ')[4].toString().substring(0,5) }` }</Text>
            </> : <>
                <View style={styles.messageSentBackground}>
                    <View style={{ ...styles.messageSentOuter, backgroundColor: '#146C94' }}>
                        <Text allowFontScaling={false} userSelect='all' selectable={true} selectionColor='black' dataDetectorType='all' style={{...styles.messageText, color: 'white' }}>{ messageData.text }</Text>
                    </View>
                </View>
                <View style={styles.messageSentFooter}>
                    <Text allowFontScaling={false} style={{...styles.messageTime, color: colors.textSecondary }}>{ `${ messageData.sentAt && messageData.sentAt.toDate().toString().split(' ')[4].toString().substring(0,5) }` }</Text>
                    { !props.received && !messageData.isRecieved ? 
                        ( messageData.isRead ? <Ionicons name={'ios-checkmark-done'} size={ moderateScale(14) } style={{ color: '#146C94', padding: moderateScale(3) }} /> : <Ionicons name={'ios-checkmark-done'} size={ moderateScale(14) } style={{ color: colors.textSecondary, padding: moderateScale(3) }} />)
                        : <Ionicons name={'ios-checkmark'} size={ moderateScale(14) } style={{ color: colors.textSecondary, padding: moderateScale(3) }} />
                    }
                </View>
            </> }
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingVertical: 0,
    },
    messageReceivedBackground: {
        display: 'flex',
        flexDirection: 'row',
    },
    messageSentBackground: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    messageReceivedOuter: {
        maxWidth: horizontalScalePercent(80),
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(10),
        borderBottomRightRadius: moderateScale(10),
        borderTopRightRadius: moderateScale(10),
        borderTopLeftRadius: moderateScale(15),
    },
    messageSentOuter: {
        maxWidth: horizontalScalePercent(80),
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(10),
        borderBottomLeftRadius: moderateScale(10),
        borderTopRightRadius: moderateScale(15),
        borderTopLeftRadius: moderateScale(10),
    },
    messageText: {
        fontSize: moderateScale(15),
    },
    messageTime: {
        fontSize: moderateScale(10),
        marginTop: moderateScale(3)
    },
    messageSentFooter: {
        display: 'flex',
        flexDirection: 'row-reverse',
    }
})