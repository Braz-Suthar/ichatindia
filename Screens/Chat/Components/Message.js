import React from 'react'
import { Text, View, StyleSheet } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function Message(props) {

    const colors = props.colors
    const messageData = props.message
    // console.log(messageData.sentAt.seconds)

    return(
        <View style={{...styles.mainContainer, transform: [{ scaleY: -1 }]}}>
            { props.received ? <>
                <View style={styles.messageReceivedBackground}>
                    <View style={{ ...styles.messageReceivedOuter, backgroundColor: colors.bgSecondary }}>
                        <Text userSelect='all' selectable={true} dataDetectorType='all' style={{...styles.messageText, color: colors.textSecondary }}>{ messageData.text }</Text>
                    </View>
                </View>
                <Text style={{...styles.messageTime, color: colors.textSecondary }}>{ `${ messageData.receivedAt && messageData.receivedAt.toDate().toString().split(' ')[4].toString().substring(0,5) }` }</Text>
            </> : <>
                <View style={styles.messageSentBackground}>
                    <View style={{ ...styles.messageSentOuter, backgroundColor: '#146C94' }}>
                        <Text userSelect='all' selectable={true} selectionColor='black' dataDetectorType='all' style={{...styles.messageText, color: 'white' }}>{ messageData.text }</Text>
                    </View>
                </View>
                <View style={styles.messageSentFooter}>
                    <Text style={{...styles.messageTime, color: colors.textSecondary }}>{ `${ messageData.sentAt && messageData.sentAt.toDate().toString().split(' ')[4].toString().substring(0,5) }` }</Text>
                    { !props.received && messageData.isSent ? 
                        ( props.seen ? <Ionicons name={'ios-checkmark-done'} size={ 13 } style={{ color: colors.blue, padding: 3 }} /> : <Ionicons name={'ios-checkmark-done'} size={ 13 } style={{ color: colors.textSecondary, padding: 3 }} />)
                        : <Ionicons name={'ios-checkmark'} size={ 13 } style={{ color: colors.textSecondary, padding: 3 }} />
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
        maxWidth: '80%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    messageSentOuter: {
        maxWidth: '80%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    messageText: {
        fontSize: 19,
    },
    messageTime: {
        fontSize: 12,
        marginTop: 2
    },
    messageSentFooter: {
        display: 'flex',
        flexDirection: 'row-reverse',
    }
})