import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StatusBar, Appearance, StyleSheet, ScrollView, Image , TextInput, TouchableHighlight } from 'react-native';
import Colors from '../../Colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Username from '../Home/Components/Username.js';
import About from '../Home/Components/About.js'
import ProfilePicture from '../Home/Components/ProfilePicture.js';
import Message from './Components/Message.js';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import sendNotification from './sendNotification.js';
import { useSelector } from 'react-redux';


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

  const phonenumber = route.params.userData.phonenumber
  const [loggedInUser, setLoggedInUser] = useState()
  const [userData, setUserData] = useState()
  const [messageData, setMessageData] = useState({})
  const [text, setText] = useState()
  const [inputRef, setInputRef] = useState()
  

  useEffect(() => {
    const setUser = async () => {
      try {
        const value = await AsyncStorage.getItem('user')
        if(value !== null) setLoggedInUser(value)
      } catch (error) {
        console.log(error)
      }
    }
    setUser()
  }, [])
  
  useEffect(() => {
    const getData = async () => {
      try {
        let data = {}
        const chatRef = firestore().collection('Users').doc("+91" + loggedInUser).collection('chats').doc(phonenumber)
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
    if(loggedInUser) getData()
  }, [loggedInUser])


  useEffect(() => {
    let subscriber
    let subscriber_
    if(userData){
      let c = null
      const onResult = async (QuerySnapshot) => {
        let d = {}
        const changes = QuerySnapshot.docChanges()
        // console.log("changes -->", changes)
        if(c == null){
          c = [ ...changes ]
          // console.log("if")
          c.forEach(change => {
            // console.log("change.doc.data()")
            const d_ = change.doc.data()
            d = { ...d, [d_.textID]: d_ }
          })
          // console.log(d)
          setMessageData({ ...d, ...messageData })
          d = {}
        }else if(changes.length) {
          // console.log("else")
          changes.forEach(change => {
            // console.log(change.doc.data())
            const d_ = change.doc.data()
            d = { ...d, [d_.textID]: d_ }
          })
          setMessageData({ ...d, ...messageData })
          d = {}
        }
        // console.log(c)
        // changes.forEach(change => {
        //   // console.log("----->", change.doc)
          
        // })
        // QuerySnapshot.forEach(element => {
        //   const d_ = element.data()
        //   d = { ...d, [d_.textID]: d_ }
        // })
      }

      const onError = error => {
        console.log(error)
      }

      subscriber = firestore().collection("Chats").doc(userData.chatID).collection('_').orderBy('sentAt', 'desc').onSnapshot({ includeMetadataChanges: true }, onResult, onError)
    }

    if(userData){
      let c = null
      const onResult = async (QuerySnapshot) => {
        // console.log('-----> ', QuerySnapshot)
        const changes = QuerySnapshot.docChanges()
        // console.log("changes -->", changes)
        if(c == null){
          c = [ ...changes ]
          // console.log("if")
          c.forEach(change => {
            // console.log(change.doc.data())
            firestore().collection("Chats").doc(userData.chatID).collection('_').doc(change.doc.data().textID).update({
              'isRead': true
            }).then(res => {
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
            // const d_ = change.doc.data()
            // d = { ...d, [d_.textID]: d_ }
          })
          // console.log(d)
          // setMessageData({ ...d, ...messageData })
          // d = {}
        }
      }

      const onError = (error) => {
        console.log(error)
      }
      console.log(userData.phonenumber)
      subscriber_ = firestore().collection("Chats").doc(userData.chatID).collection('_').where("isRead", '==', false).where('sender', '==', userData.phonenumber).onSnapshot({ includeMetadataChanges: true }, onResult, onError)
    }

    if(subscriber) return () => subscriber()
    if(subscriber_) return () => subscriber_()
  }, [userData])


  // useEffect(() => {
  //   if(messageData && Object.keys(messageData).length == 0){
  //     setMessageData([])
  //   }
  // }, [messageData])

  const sendMessage = async () => {
    if(!messageData || messageData){
      let chatID 
      const text_ = text
      inputRef.clear()
      const textID = uuid.v4()
      const timeStamp = firestore.FieldValue.serverTimestamp()
      
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
        sender: loggedInUser,
        sentAt: timeStamp,
        text: text_.toString()
      }
      
      const ref_ = firestore().collection("Users").doc("+91" + loggedInUser).collection("chats").doc(phonenumber)
      const result = await ref_.get()
      if(result.exists){
        chatID = result.data().chatID
        const ref =  firestore().collection("Chats").doc(chatID).collection('_').doc(textID)
        await ref.set(data)
        await firestore().collection("Users").doc("+91" + loggedInUser).collection("chats").doc(phonenumber).update({ 
          lastUpdatedAt: timeStamp,
          lastTextID: textID
         })
         await firestore().collection("Users").doc(phonenumber).collection("chats").doc("+91" + loggedInUser).update({ 
          lastUpdatedAt: timeStamp,
          lastTextID: textID
         })
      }else{
        chatID = uuid.v4()
        const ref =  firestore().collection("Chats").doc(chatID).collection('_').doc(textID)
        await ref.set(data)
        const ref_ = firestore().collection("Users").doc("+91" + loggedInUser).collection("chats").doc(phonenumber)
        await ref_.set({
          'chatID': chatID.toString(),
          'phonenumber': userData.phonenumber,
          'savedName': userData.fullname,
          'lastUpdatedAt': timeStamp,
          'lastTextID': textID.toString()
        })
        const ref__ = firestore().collection("Users").doc(phonenumber).collection("chats").doc("+91" + loggedInUser)
        await ref__.set({
          'chatID': chatID.toString(),
          'phonenumber': loggedInUser,
          'savedName': null,
          'lastUpdatedAt': timeStamp,
          'lastTextID': textID.toString()
        })
      }
      sendNotification.sendNotification({ text: text, savedName: userData.savedName, chatID: chatID, textID: textID, token: currentUser.token })
    }
  }

  return (
        <>
        <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
        <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
            <View style={{ ...styles.header }}>
                <View style={{ ...styles.headerLeft}}>
                    <Username username={ userData && (userData.savedName ? userData.savedName : userData.fullname) } customStyle={{ fontSize: 34 }} colors={ colors } />
                    <About about={ userData && userData.about } customStyle={{ fontSize: 15 }} colors={ colors } />
                </View>
                <View style={{ ...styles.dpOuter, backgroundColor: colors.blue}}>
                    <ProfilePicture dpURL={ userData && userData.profilePicture } dpOnClick={(url) => { console.log(url) }} customStyle={{ width: 50, height: 50 }}/>
                </View>
            </View>
            <ScrollView keyboardDismissMode={'on-drag'} showsVerticalScrollIndicator={false} paddingVertical={20} style={{ ...styles.textScrollView, transform: [{ scaleY: -1 }]}}>
                {
                  messageData && Object.keys(messageData).map((key) => {
                    // console.log(message)
                    return <Message key={key} colors={ colors } received={messageData[key].receiver == "+91" + loggedInUser } seen={true} message={messageData[key]}/>
                  })
                }
                <View style={{ padding: 20 }}></View>
            </ScrollView>
            <View style={{ ...styles.footer}}>
              <Ionicons name={'ios-attach'} size={ 24 } style={{ color: colors.textSecondary, padding: 6 }} />
              <Ionicons name={'ios-happy-outline'} size={ 24 } style={{ color: colors.textSecondary, padding: 6 }} />
              <TextInput multiline={ true } ref={input => { setInputRef(input) }} onChangeText={(text_) => { setText(text_) }} style={{ ...styles.textInput, backgroundColor: colors.bgSecondary, color: colors.textPrimary }} placeholderTextColor={ colors.textPrimary } placeholder='type your message here'/>
              <TouchableHighlight onPress={sendMessage}>
                <Ionicons name={'ios-paper-plane-outline'} size={ 24 } style={{ color: colors.textSecondary, padding: 6 }} />
              </TouchableHighlight>
            </View>
        </View>
        </>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 15
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  headerLeft: {
    width: '80%',
  },
  dpOuter: {
    width: 52,
    height: 52,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end'
  },
  textInput: {
    width: '65%',
    paddingHorizontal: 10,
    marginHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 20,
  }
})