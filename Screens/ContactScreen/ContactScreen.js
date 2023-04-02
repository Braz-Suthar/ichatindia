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
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 24, color: colors.textPrimary}}>{ fullname }</Text>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, color: colors.textSecondary}}>{ about }</Text>
                            </>
                        </TouchableHighlight>
                    </>
                    <View>
                        <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} disabled={createGroupReq && isSelected} onPress={iconClickHandler}>
                            <Ionicons name={createGroupReq ? isSelected ? 'ios-checkmark-circle' : 'ios-add-circle-outline' : 'ios-chatbubble-ellipses-outline'} size={ 24 } style={{ color: colors.blue, fontWeight: 'bold', marginRight: 10 }} /> 
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
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => {removeSelected(contactID)}}style={{ width: '100%', textAlign: 'right', marginBottom: -10 }}>
                <Ionicons name={'ios-close-circle'} size={ 24 } style={{ color: colors.blue, fontWeight: 'bold', width: '100%', textAlign: 'right',}} />
            </TouchableHighlight>
            <View style={{ ...styles.selectedContactItemViewOuter, borderColor: colors.blue, backgroundColor: colors.bgPrimary }}>
                <View style={{ ...styles.selectedContactItemView }}>
                    <Image style={{ ...styles.selectedContactItemView }} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/ichatindia.appspot.com/o/FlatIcons%2F45.png?alt=media&token=775e27ce-8dca-4a2c-98c0-01cb0315d03f'}}/>
                </View>
            </View>
            <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Text style={{ ...styles.selectedContactName }} numberOfLines={1} ellipsizeMode={'tail'} >Braz Suthar</Text>
            </View>
        </View>
    )
}


export default function ContactScreen({ route, navigation }) {

    const createGroupReq = route.params.createGroupReq
    const colors = route.params.colors

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
                    const user = await firestore().collection("Users").doc(mobileContacts[contact].phonenumber).get()
                    if(user.exists){
                        const userData = user.data()
                        const cont = { uuid: uuid.v4(), fullname: mobileContacts[contact].fullname, phonenumber: mobileContacts[contact].phonenumber, about: userData.about, profilePicture: userData.profilePicture}
                        _.push(cont)
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
                    <TouchableHighlight onPress={() => navigation.goBack() }>
                        <Ionicons name={'ios-chevron-back'} size={ 32 } style={{ color: colors.blue, fontWeight: 'bold', marginRight: 10 }} />
                    </TouchableHighlight>
                    <Text style={{ ...styles.headerText, color: colors.textPrimary }}>{ createGroupReq ? 'Create New Group' : 'Chat Individualy'}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: colors.bgSecondary, width: '100%', paddingTop: 5, paddingBottom: 5, borderRadius: 10, marginBottom: 5 }}>
                    <View style={{ ...styles.leftContainer }}>
                        <Ionicons name={'ios-search-outline'} size={ 18 } style={{ color: colors.textSecondary }} />
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
                        <ScrollView showsHorizontalScrollIndicator={false} contentInset={20} contentInsetAdjustmentBehavior={'scrollableAxes'} horizontal={true} alwaysBounceHorizontal={true}>
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
                <ScrollView style={{ marginTop: 12 }}>
                    { ichatUserContactList && ichatUserContactList.map((contact) => {
                        return <>
                            <ContactItem startIndividualChat={startIndividualChat} onSelectIconClick={ selectContactForGroup } conatctID={contact.uuid} key={contact.uuid} createGroupReq={createGroupReq} isSelected={selectedContact && selectedContact.includes(contact.uuid)} dpOnClick={ setShowDPURLFunction } fullname={contact.fullname} about={contact.about} phonenumber={contact.phonenumber} colors={colors} profilePicture={contact.profilePicture}/>
                        </>
                    }) }
                    { showCreateGroupButton &&  <View style={{ paddingVertical: 50 }}></View>}
                </ScrollView>
                {
                    showCreateGroupButton &&
                    <TouchableHighlight onPress={ createNewGroupFunction } style={{ ...styles.button, backgroundColor: colors.bgSecondary }}>
                        <>
                            <MIcons name={'group-add'} size={ 30 } style={{ color: colors.blue, marginRight: 12 }} />
                            <Text style={{ ...styles.btnText, color: colors.textPrimary }}>Create New Group</Text>
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
        width: "100%",
        height: "100%",
        padding: 12
    },
    header:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 13
    },
    headerText: {
        fontSize: 32,
        flexGrow: 1
    },
    contactItem: {
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 3
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    details: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 18,
        width: "75%",
        paddingRight: 15
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        borderRadius: 15
    },
    btnText: {
        fontSize: 20
    },
    leftContainer: {
        width: '15%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: '80%',
    },
    textInput: {
        padding: 0,
        fontSize: 18,
        width: '100%',
    },
    selectedContactListContainer: {
        width: '100%',
        marginBottom: 13,
        paddingTop: 12
    },
    selectedContactItemViewContainer: {
        width: 80,
        height: 80,
        marginRight: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    selectedContactItemViewOuter: {
        width: 40,
        height: 40,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedContactItemView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 50,
    },
    selectedContactName: {
        marginTop: 5,
    }
})