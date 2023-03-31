import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProfilePicture from './ProfilePicture'
import Username from './Username'
import { useSelector } from 'react-redux'



const ChatItem = (props) => {

    const colors = props.colors
    const dpURL = props.chatItem.profilePicture
    const chatOnClick = props.chatOnClick
    const dpOnClick = props.dpOnClick
    const chatItem = props.chatItem
    const currentUserPhonenumber = props.currentUserPhonenumber
    
    return(
        <TouchableHighlight onPress={ () => { chatOnClick(chatItem) } }>
            <View style={{ ...styles.chatItem, backgroundColor: colors.bgSecondary}}>
                <View style={{ ...styles.chatItemLeft }} >
                    <ProfilePicture dpURL={ dpURL } dpOnClick={ dpOnClick } customStyle={{ width: 50, height: 50 }}/>
                </View>
                
                <View style={{ ...styles.chatItemMiddle }}>
                    <Username username={ props.chatItem.savedName || props.chatItem.phonenumber } colors={ colors } customStyle={{ fontSize: 25, marginTop: -5 }}/>
                    <View style={{ ...styles.chatItemTextView }}>
                        { chatItem && chatItem.sender == currentUserPhonenumber && <Ionicons name={ chatItem.isSent && chatItem.isReceived ? 'ios-checkmark-done' : chatItem.isSent && !chatItem.isReceived ? 'ios-checkmark' : 'ios-hourglass-outline' } size={ 14 } style={{ color: chatItem.isReceived && chatItem.isRead ? colors.blue : colors.textSecondary }}/>}
                        <Text style={{ ...styles.textMessage, color: colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{ props.chatItem.lastMessage }</Text>
                    </View>
                </View>
                <View style={{ ...styles.chatItemRight }}>
                    <Text style={{ color: colors.textSecondary }}>11/07/22</Text>
                    <View style={{ ...styles.newMessagesBadge, backgroundColor: colors.blue}}>
                        <Text style={{ color: 'white' }}>99</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default function Chat(props) {

    const colors = props.colors
    const addIconClick = props.addIconClickListner
    const currentUser = useSelector((state) => state.currentUser.currentUser)
    
    return(
        <View style={{ ...styles.mainContainer }}>
            <View style={{ ...styles.header }}>
                <Text style={{ ...styles.headerText, color: colors.textPrimary }}>Chat</Text>
                <TouchableHighlight onPress={addIconClick}>
                    <Ionicons name={'ios-add-outline'} size={ 32 } style={{ color: colors.blue, fontWeight: 'bold' }} />
                </TouchableHighlight>
            </View>
            <ScrollView style={{ ...styles.scrollView }} vertical={true} verticalScroll={true} contentInsetAdjustmentBehavior={'scrollableAxes'} >
                { props.chatItems && props.chatItems.map(chatItem => {
                    return<>
                        <ChatItem colors={ colors } key={chatItem.chatID} chatItem={ chatItem } currentUserPhonenumber={ currentUser.phonenumber } chatOnClick={ props.chatOnClick } dpOnClick={ props.dpOnClick } />
                    </>
                }) }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    chatItem: {
        width: '100%',
        borderRadius: 12,
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3
    }, 
    scrollView: {
        padding: 15
    },
    textMessage: {
        fontSize: 14
    },
    chatItemLeft: {
        width: '15%',
        borderRadius: 50
    },
    chatItemMiddle: {
        marginLeft: 10,
        display: 'flex',
        flexDirection: 'column',
        width: '68%',
    },
    chatItemRight: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flexGrow: 1
    },
    chatItemTextView: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 1
    },
    newMessagesBadge: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 5,
        width: 22,
        height: 22,
        marginTop: 6
    }
})