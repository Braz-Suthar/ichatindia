import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProfilePicture from './ProfilePicture'
import Username from './Username'
import { useSelector } from 'react-redux'
import { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale } from './../../../src/Metrics'



const ChatItem = (props) => {

    const colors = props.colors
    const dpURL = props.chatItem.profilePicture
    const chatOnClick = props.chatOnClick
    const dpOnClick = props.dpOnClick
    const chatItem = props.chatItem
    console.log(chatItem)
    
    return(
        <TouchableHighlight onPress={ () => { chatOnClick(chatItem) } } underlayColor={ colors.bgPrimary }>
            <View style={{ ...styles.chatItem, backgroundColor: colors.bgSecondary}}>
                <View style={{ ...styles.chatItemLeft }} >
                    <ProfilePicture dpURL={ dpURL } dpOnClick={ dpOnClick } customStyle={{ width: horizontalScale(50), height: horizontalScale(50) }}/>
                </View>
                
                <View style={{ ...styles.chatItemMiddle }}>
                    <Username username={ props.chatItem.savedName || props.chatItem.phonenumber } colors={ colors } customStyle={{ fontSize: moderateScale(15), marginTop: -3 }}/>
                    <View style={{ ...styles.chatItemTextView }}>
                        { chatItem.sender == props.currentUserPhonenumber && (chatItem.isReceived ? chatItem.isRead  ? <Ionicons name={'ios-checkmark-done'} size={ moderateScale(11.5) } style={{ color: colors.blue }}/> : <Ionicons name={'ios-checkmark-done'} size={ moderateScale(11.5) } style={{ color: colors.textSecondary }}/> : <Ionicons name={'ios-checkmark'} size={ moderateScale(11.5) } style={{ color: colors.textSecondary }}/>)}
                        <Text allowFontScaling={false} style={{ ...styles.textMessage, color: colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{ props.chatItem.lastMessage }</Text>
                    </View>
                </View>
                <View style={{ ...styles.chatItemRight }}>
                    <Text allowFontScaling={false} style={{ color: colors.textSecondary, fontSize: moderateScale(9) }}>11/07/22</Text>
                    {chatItem.newTextsCount > 0 && <View style={{ ...styles.newMessagesBadge, backgroundColor: colors.blue}}>
                        <Text allowFontScaling={false} style={{ color: 'white', fontSize: moderateScale(9) }}>{ chatItem.newTextsCount }</Text>
                    </View>}
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
                <Text allowFontScaling={false} style={{ ...styles.headerText, color: colors.textPrimary }}>Chat</Text>
                <TouchableHighlight onPress={addIconClick} underlayColor={ colors.bgPrimary }>
                    <Ionicons name={'ios-add-outline'} size={ moderateScale(28) } style={{ color: colors.blue, fontWeight: 'bold' }} />
                </TouchableHighlight>
            </View>
            <ScrollView style={{ ...styles.scrollView, }} vertical={true} verticalScroll={true} contentInsetAdjustmentBehavior={'scrollableAxes'} >
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
        width: horizontalScalePercent(100),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(10),
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
    chatItem: {
        width: horizontalScalePercent(93),
        borderRadius: 12,
        padding: moderateScale(8),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(2),
    }, 
    scrollView: {
        padding: moderateScale(10)
    },
    textMessage: {
        fontSize: moderateScale(10),
        marginLeft: moderateScale(3)
    },
    chatItemLeft: {
        width: horizontalScale(50),
        borderRadius: horizontalScale(25),
    },
    chatItemMiddle: {
        marginLeft: horizontalScale(10),
        display: 'flex',
        flexDirection: 'column',
        width: horizontalScalePercent(60),
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
        width: horizontalScalePercent(56),
        marginTop: verticalScale(1.5),
        alignItems: 'center',
    },
    newMessagesBadge: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: moderateScale(4),
        width: horizontalScale(18),
        height: horizontalScale(18),
        marginTop: moderateScale(5)
    }
})