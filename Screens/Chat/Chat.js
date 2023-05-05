import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StatusBar, Appearance, StyleSheet, ScrollView, Image , TextInput, TouchableHighlight } from 'react-native';
import Colors from '../../Colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/Octicons'
import Username from '../Home/Components/Username.js';
import About from '../Home/Components/About.js'
import ProfilePicture from '../Home/Components/ProfilePicture.js';
import Message from './Components/Message.js';
import firestore from '@react-native-firebase/firestore'
import uuid from 'react-native-uuid'
import sendNotification from './sendNotification.js';
import { useSelector } from 'react-redux';
import { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale } from './../../src/Metrics'


export default function ChatScreen({ route, navigation }) {

  const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
  const currentUser = useSelector((state) => state.currentUser.currentUser)

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeState(colorScheme)
    })
    return () => subscription.remove()
  }, [])

  const colors = Colors[themeState] 

  const phonenumber = route.params.userData.phonenumber // reciever phone number
  const [userData, setUserData] = useState()  // reciever user data
  const [messageData, setMessageData] = useState({})  // all messages
  const [text, setText] = useState() // message
  const [inputRef, setInputRef] = useState()  // text input reference
  const [height, setHeight] = useState(0)
  
  
  useEffect(() => {
    const getData = async () => {
      try {
        let data = {}
        const chatRef = firestore().collection('Users').doc(currentUser.phonenumber).collection('chats').doc(phonenumber)
        const chatCollection = await chatRef.get()
        if(chatCollection.exists){
          let userData_ = chatCollection.data()
          data = { ...userData_ }
        }
        const userRef = firestore().collection('Users').doc(phonenumber)
        const userDoc = await userRef.get()
        data = { ...data, ...userDoc.data() }
        setUserData(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])


  useEffect(() => {
    let subscriber_
    let subscriber__


    if(userData){
      const onResult = async (QuerySnapshot) => {
        let d = {}
        
        QuerySnapshot.forEach(snapshot => {
          const data = snapshot.data()
          const _ = { ...data }
          d[data.textID] = _
        })
        

        setMessageData({ ...d })
        d = {}
      }

      const onError = error => {
        console.log(error)
      }

      subscriber_ = firestore().collection("Chats").doc(userData.chatID).collection('_').orderBy('sentAt', 'desc').onSnapshot({ includeMetadataChanges: true }, onResult, onError)
    }

    if(userData){

      const onResult = async (QuerySnapshot) => {
        const batch = firestore().batch()
        QuerySnapshot.forEach(snapshot => {
          batch.update(firestore().collection('Chats').doc(userData.chatID).collection('_').doc(snapshot.data().textID), {isRead: true})
        })

        await batch.commit()
      }

      const onError = error => {
        console.log(error)
      }

      firestore().collection("Chats").doc(userData.chatID).collection('_').where('sender', '==', userData.phonenumber).where('isRead', '!=', true).onSnapshot({ includeMetadataChanges: true }, onResult, onError)
    }

    if(subscriber_) return () => subscriber_()
    if(subscriber__) return () => subscriber__()
  }, [userData])

  const sendMessage = async () => {
    if(!messageData || messageData){
      let chatID 
      const text_ = text
      inputRef.clear()
      const textID = uuid.v4()
      const timeStamp = firestore.FieldValue.serverTimestamp()
      // text data
      const data = {
        textID: textID,
        isDeleted: false,
        isRead: false,
        isReceived: false,
        isReply: false,
        isSent: true,
        readAt: null,
        receivedAt: null,
        receiver: phonenumber,
        replyTextID: null,
        sender: currentUser.phonenumber,
        sentAt: timeStamp,
        text: text_.toString()
      }
      
      const ref_ = firestore().collection("Users").doc(currentUser.phonenumber).collection("chats").doc(phonenumber)
      const result = await ref_.get()
      if(result.exists){
        // chat already exists
        chatID = result.data().chatID
        const ref =  firestore().collection("Chats").doc(chatID).collection('_').doc(textID)
        await ref.set(data)
        await firestore().collection("Users").doc(currentUser.phonenumber).collection("chats").doc(phonenumber).update({ 
          lastUpdatedAt: timeStamp,
          lastTextID: textID
         })
         await firestore().collection("Users").doc(phonenumber).collection("chats").doc(currentUser.phonenumber).update({ 
          lastUpdatedAt: timeStamp,
          lastTextID: textID
         })
      }else{
        // chat doesn't exist, creating new one
        chatID = uuid.v4()
        // saving text data
        const ref =  firestore().collection("Chats").doc(chatID).collection('_').doc(textID)
        await ref.set(data)
        // for sender
        const ref_ = firestore().collection("Users").doc(currentUser.phonenumber).collection("chats").doc(phonenumber)
        await ref_.set({
          'chatID': chatID.toString(),
          'phonenumber': userData.phonenumber,
          'savedName': userData.fullname,
          'lastUpdatedAt': timeStamp,
          'lastTextID': textID.toString()
        })
        // for reciever
        const ref__ = firestore().collection("Users").doc(phonenumber).collection("chats").doc(currentUser.phonenumber)
        await ref__.set({
          'chatID': chatID.toString(),
          'phonenumber': currentUser.phonenumber,
          'savedName': null,
          'lastUpdatedAt': timeStamp,
          'lastTextID': textID.toString()
        })
      }
      sendNotification.sendNotification({ text: text, savedName: userData.savedName, chatID: chatID, textID: textID, token: userData.token })
    }
  }

  return (
        <>
        <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
        <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
            <View style={{ ...styles.header }}>
                <TouchableHighlight onPress={() => navigation.goBack() } underlayColor={ colors.bgPrimary } style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Ionicons name={'ios-chevron-back'} size={ moderateScale(30) } style={{ color: colors.textSecondary, marginLeft: moderateScale(-8) }} />
                </TouchableHighlight>
                <View style={{ ...styles.headerLeft}}>
                    <Username username={ userData && (userData.savedName ? userData.savedName : userData.fullname) } customStyle={{ fontSize: moderateScale(22) }} colors={ colors } />
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                      <Icon name={'dot-fill'} size={ moderateScale(18) } style={{ color: 'green', marginRight: moderateScale(5) }} />
                      <About about={ userData && userData.about } customStyle={{ fontSize: moderateScale(12) }} colors={ colors } />
                    </View>
                </View>
                <View style={{ ...styles.dpOuter, backgroundColor: colors.bgPrimary }}>
                    <ProfilePicture dpURL={ userData && userData.profilePicture } dpOnClick={(url) => { console.log(url) }} customStyle={{ width: horizontalScale(43), height: horizontalScale(43) }}/>
                </View>
            </View>
            <ScrollView keyboardDismissMode={'on-drag'} showsVerticalScrollIndicator={false} paddingVertical={moderateScale(20)} style={{ ...styles.textScrollView, transform: [{ scaleY: -1 }]}}>
                {
                  messageData && Object.keys(messageData).map((key) => {
                    return <Message key={key} colors={ colors } received={messageData[key].receiver == currentUser.phonenumber } message={messageData[key]}/>
                  })
                }
                <View style={{ padding: moderateScale(20) }}></View>
            </ScrollView>
            <View style={{ ...styles.footer}}>
              <Ionicons name={'ios-attach'} size={ moderateScale(24) } style={{ color: colors.textSecondary, padding: moderateScale(6) }} />
              <Ionicons name={'ios-happy-outline'} size={ moderateScale(24) } style={{ color: colors.textSecondary, padding: moderateScale(6) }} />
              <TextInput multiline={ true } onContentSizeChange={(event) => {setHeight(event.nativeEvent.contentSize.height)}} ref={input => { setInputRef(input) }} onChangeText={(text_) => { setText(text_) }} style={{ ...styles.textInput, backgroundColor: colors.bgSecondary, color: colors.textPrimary, maxHeight: 80 }} placeholderTextColor={ colors.textPrimary } placeholder='type your message here'/>
              <TouchableHighlight onPress={sendMessage}>
                <Ionicons name={'ios-paper-plane-outline'} size={ moderateScale(24) } style={{ color: colors.textSecondary, padding: moderateScale(6) }} />
              </TouchableHighlight>
            </View>
        </View>
        </>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    width: horizontalScalePercent(100),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: moderateScale(15)
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  headerLeft: {
    width: horizontalScalePercent(70),
  },
  dpOuter: {
    width: horizontalScale(46),
    height: horizontalScale(46),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(23),
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end'
  },
  textInput: {
    width: horizontalScalePercent(65),
    paddingHorizontal: moderateScale(10),
    marginHorizontal: moderateScale(15),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(10),
    fontSize: moderateScale(20),
  }
})