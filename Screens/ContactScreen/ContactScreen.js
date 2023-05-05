import React, { useState, useEffect } from 'react';
import { Image, ScrollView, Text, StyleSheet, View, TouchableHighlight, PermissionsAndroid, TextInput  } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Contacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import ShowDPModal from './../Home/Components/ShowDP'
import uuid from 'react-native-uuid'
import { StackActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { horizontalScale, horizontalScalePercent, moderateScale, verticalScalePercent } from '../../src/Metrics';


const ContactItem = (props) => {
    
    const fullname = props.fullname
    const about = props.about
    const profilePicture = props.profilePicture
    const itemOnClickHandler = props.itemOnClickHandler
    const colors = props.colors
    const dpOnClick = props.dpOnClick
    const createGroupReq = props.createGroupReq
    const isSelected = props.isSelected
    const onSelectIconClick = props.onSelectIconClick
    const contactID = props.conatctID
    const startIndividualChat = props.startIndividualChat
    const phonenumber = props.phonenumber

    const iconClickHandler = () => {
        if(createGroupReq && !isSelected) {
            onSelectIconClick(contactID) 
        }else if(!createGroupReq){
            startIndividualChat({ savedName: fullname, phonenumber: phonenumber })
        }else{
            console.log("Nothing")
        }
    }
    
    return(
        <>
            <TouchableHighlight style={{ ...styles.contactItem, backgroundColor: colors.bgSecondary}}>
                <>
                    <TouchableHighlight onPress={() => dpOnClick(profilePicture)} style={{ ...styles.profilePicture }}>
                        <Image source={{uri: profilePicture}} style={{ ...styles.profilePicture }}/>
                    </TouchableHighlight>
                    <>
                        <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} style={{ ...styles.details }} onPress={() => console.log("UsernameClicked")}>
                            <>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: moderateScale(22), color: colors.textPrimary}}>{ fullname }</Text>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: moderateScale(16), color: colors.textSecondary}}>{ about }</Text>
                            </>
                        </TouchableHighlight>
                    </>
                    <View>
                        <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} disabled={createGroupReq && isSelected} onPress={iconClickHandler}>
                            <Ionicons name={createGroupReq ? isSelected ? 'ios-checkmark-circle' : 'ios-add-circle-outline' : 'ios-chatbubble-ellipses-outline'} size={ moderateScale(24) } style={{ color: colors.blue, fontWeight: 'bold', marginRight: moderateScale(10) }} /> 
                        </TouchableHighlight>
                    </View>
                </>
            </TouchableHighlight>
        </>
    )
}


const SelectedContactItemView = (props) => {

    const colors = props.colors
    const removeSelected = props.removeSelectedFunction
    const contactID = props.contactID

    return(
        <View style={{ ...styles.selectedContactItemViewContainer }}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => {removeSelected(contactID)}}style={{ width: horizontalScalePercent(17), textAlign: 'right', marginBottom: moderateScale(-11.5) }}>
                <Ionicons name={'ios-close-circle'} size={ moderateScale(22) } style={{ color: colors.blue, fontWeight: 'bold', width: horizontalScalePercent(20), textAlign: 'right',}} />
            </TouchableHighlight>
            <View style={{ ...styles.selectedContactItemViewOuter, borderColor: colors.blue, backgroundColor: colors.bgPrimary }}>
                <View style={{ ...styles.selectedContactItemView }}>
                    <Image style={{ ...styles.selectedContactItemView }} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/ichatindia.appspot.com/o/FlatIcons%2F45.png?alt=media&token=775e27ce-8dca-4a2c-98c0-01cb0315d03f'}}/>
                </View>
            </View>
            <View style={{ width: horizontalScalePercent(23), display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Text allowFontScaling={false} style={{ ...styles.selectedContactName }} numberOfLines={1} ellipsizeMode={'tail'} >Braz Suthar</Text>
            </View>
        </View>
    )
}


export default function ContactScreen({ route, navigation }) {

    const createGroupReq = route.params.createGroupReq
    const colors = route.params.colors
    const currentUser = useSelector((state) => state.currentUser.currentUser)

    const [ichatUserContactList, setIchatUserContactList] = useState()
    const [selectedContact, setSelectedContact] = useState()
    const [showDPURL, setShowDPURL] = useState(null)
    const [showCreateGroupButton, setShowCreateGroupButton] = useState(false)
    const mobileContacts = useSelector((state) => state.mobileContacts.contacts)

    useEffect(() => {
        console.log(selectedContact)
        if(selectedContact && selectedContact.length > 1){
            setShowCreateGroupButton(true)
        }else{
            setShowCreateGroupButton(false)
        }
    }, [selectedContact])

    const setShowDPURLFunction = (url) => {
        setShowDPURL(url)
      }
    
    const unSetShowDPURLFunction = () => {
        setShowDPURL(null)
    }

    const selectContactForGroup = (contactID) => {
        if(selectedContact && selectedContact.length)
            setSelectedContact([ ...selectedContact, contactID ])

        if(!selectedContact)
            setSelectedContact([ contactID ])
    }

    const removeSelectedFunction = (contactID) => {
        const index = selectedContact.indexOf(contactID)
        if(index > -1) {
            selectedContact.splice(index, 1)
            setSelectedContact([ ...selectedContact ])
        }
    }

    const createNewGroupFunction = () => {

    }

    const startIndividualChat = (userData) => {
        console.log("Start individual chat: ", userData)
        navigation.dispatch(   
            StackActions.replace('Chat', { userData: userData }) 
        );
    }

    const goToProfileFunction = () => {

    }

    const showProfilePictureFunction = () => {

    }

    useEffect(() => {
        if(mobileContacts){
            const _ = []
            async function getIchatUserContacts(){
                for await (const contact of Object.keys(mobileContacts)){
                    if(mobileContacts[contact].phonenumber != currentUser.phonenumber){
                        const user = await firestore().collection("Users").doc(mobileContacts[contact].phonenumber).get()
                        if(user.exists){
                            const userData = user.data()
                            const cont = { uuid: uuid.v4(), fullname: mobileContacts[contact].fullname, phonenumber: mobileContacts[contact].phonenumber, about: userData.about, profilePicture: userData.profilePicture}
                            _.push(cont)
                        }
                    }
                }
                return Promise.resolve(_)
            }
            getIchatUserContacts().then(data => setIchatUserContactList(data))
        }
    }, [])

    useEffect(() => {
        console.log('iChatUserContactList', ichatUserContactList)
    }, [ichatUserContactList])

    useEffect(() => {
        if(selectedContact && selectedContact.length == 0)
            setSelectedContact(undefined)
    }, [selectedContact])


    return(
        <>
            <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary}}>
                <View style={{ ...styles.header }}>
                    <TouchableHighlight onPress={() => navigation.goBack()} underlayColor={ colors.bgPrimary }>
                        <Ionicons name={'ios-chevron-back'} size={ moderateScale(32) } style={{ color: colors.blue, fontWeight: 'bold', marginRight: moderateScale(10) }} />
                    </TouchableHighlight>
                    <Text style={{ ...styles.headerText, color: colors.textPrimary }}>{ createGroupReq ? 'Create New Group' : 'Chat Individualy'}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: colors.bgSecondary, width: horizontalScalePercent(93), paddingTop: moderateScale(5), paddingBottom: moderateScale(5), borderRadius: moderateScale(10), marginBottom: moderateScale(5) }}>
                    <View style={{ ...styles.leftContainer }}>
                        <Ionicons name={'ios-search-outline'} size={ moderateScale(18) } style={{ color: colors.textSecondary }} />
                    </View>
                    <View style={{ ...styles.rightContainer }}>
                        <TextInput 
                            placeholder='Search contact by name or number'
                            placeholderTextColor={colors.textSecondary}
                            multiline={false}
                            numberOfLines={1}
                            style={{ ...styles.textInput, color: colors.textPrimary }}
                        />
                    </View>
                </View>
                {
                    selectedContact && 
                    <View style={{ ...styles.selectedContactListContainer}}>
                        <ScrollView showsHorizontalScrollIndicator={false} contentInset={moderateScale(20)} contentInsetAdjustmentBehavior={'scrollableAxes'} horizontal={true} alwaysBounceHorizontal={true}>
                            {
                                selectedContact && selectedContact.map((selectedContactItem, index) => {
                                    return <>
                                        <SelectedContactItemView contactID={selectedContactItem} removeSelectedFunction={ removeSelectedFunction } key={selectedContactItem} colors={colors} />
                                    </>
                                })
                            }
                        </ScrollView>
                    </View>
                }
                <ScrollView style={{ marginTop: moderateScale(12) }}>
                    { ichatUserContactList && ichatUserContactList.map((contact) => {
                        return <>
                            <ContactItem startIndividualChat={startIndividualChat} onSelectIconClick={ selectContactForGroup } conatctID={contact.uuid} key={contact.uuid} createGroupReq={createGroupReq} isSelected={selectedContact && selectedContact.includes(contact.uuid)} dpOnClick={ setShowDPURLFunction } fullname={contact.fullname} about={contact.about} phonenumber={contact.phonenumber} colors={colors} profilePicture={contact.profilePicture}/>
                        </>
                    }) }
                    { showCreateGroupButton &&  <View style={{ paddingVertical: moderateScale(50) }}></View>}
                </ScrollView>
                {
                    showCreateGroupButton &&
                    <TouchableHighlight onPress={ createNewGroupFunction } style={{ ...styles.button, backgroundColor: colors.bgSecondary }}>
                        <>
                            <MIcons name={'group-add'} size={ moderateScale(30) } style={{ color: colors.blue, marginRight: moderateScale(12) }} />
                            <Text allowFontScaling={false} style={{ ...styles.btnText, color: colors.textPrimary }}>Create New Group</Text>
                        </>
                    </TouchableHighlight>
                }
            </View>
            { showDPURL && <ShowDPModal dpUrl={showDPURL} unSetShowDPURL={ unSetShowDPURLFunction } colors={ colors } /> }
        </>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        width: horizontalScalePercent(100),
        height: verticalScalePercent(100),
        padding: moderateScale(12)
    },
    header:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: moderateScale(13),
    },
    headerText: {
        fontSize: moderateScale(30),
        flexGrow: 1
    },
    contactItem: {
        width: horizontalScalePercent(93),
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(8),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: moderateScale(10),
        marginTop: moderateScale(3)
    },
    profilePicture: {
        width: horizontalScale(44),
        height: horizontalScale(44),
        borderRadius: horizontalScale(22),
    },
    details: {
        display: "flex",
        flexDirection: "column",
        marginLeft: moderateScale(18),
        width: horizontalScalePercent(65),
        paddingRight: moderateScale(15)
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: horizontalScalePercent(90),
        padding: moderateScale(15),
        borderRadius: moderateScale(15)
    },
    btnText: {
        fontSize: moderateScale(20)
    },
    leftContainer: {
        width: horizontalScalePercent(15),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: horizontalScalePercent(73),
    },
    textInput: {
        padding: 0,
        fontSize: moderateScale(18),
        width: horizontalScalePercent(73),
    },
    selectedContactListContainer: {
        width: horizontalScalePercent(100),
        marginBottom: moderateScale(13),
        paddingTop: moderateScale(12),
    },
    selectedContactItemViewContainer: {
        width: horizontalScale(80),
        height: horizontalScale(80),
        marginRight: moderateScale(10),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    selectedContactItemViewOuter: {
        width: horizontalScale(42),
        height: horizontalScale(42),
        borderRadius: horizontalScale(21),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedContactItemView: {
        width: horizontalScalePercent(13),
        height: horizontalScalePercent(13),
        backgroundColor: 'white',
        borderRadius: horizontalScalePercent(6.5),
    },
    selectedContactName: {
        marginTop: moderateScale(5),
    }
})