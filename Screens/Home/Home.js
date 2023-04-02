import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Appearance, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import Colors from '../../Colors.js';
import Header from './Components/Header.js';
import Story from './Components/Story.js';
import Chat from './Components/Chat.js';
import Search from './Components/Search.js';
import ShowDPModal from './Components/ShowDP.js';
import NewPopupScreen from '../ContactScreen/NewPopupScreen.js';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux'



export default function HomeScreen({ route, navigation }) {

  const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
  const currentUser = useSelector((state) => state.currentUser.currentUser)
  const mobileContacts = useSelector((state) => state.mobileContacts.contacts)

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeState(colorScheme)
    })
    return () => subscription.remove()
  }, [])

  const colors = Colors[themeState]   

  const [ showDPURL, setShowDPURL ] = useState(null)
  const [ showNewPopupScreen, setShowNewPopupScreen ] = useState(false)
  const [chatItems, setChatItems] = useState()

  const setShowDPURLFunction = (url) => {
    setShowDPURL(url)
  }

  const unSetShowDPURLFunction = () => {
    setShowDPURL(null)
  }

  const dpOnClick = () => {
    navigation.navigate('Profile', { userData: currentUser })
  }
  
  const chatOnClick = async (chatItem) => {
    navigation.navigate('Chat', { userData: {phonenumber: chatItem.phonenumber, savedName: chatItem.savedName} })
  }

  const createNewGroupFunction = () => {
    navigation.navigate('ContactScreen', { colors: colors, createGroupReq: true })
  }

  const chatIndividualyFunction = () => {
    navigation.navigate('ContactScreen', { colors: colors, createGroupReq: false })
  }
  
  const hideModal = () => {
    setShowNewPopupScreen(false)
  }

  const showModal = () => {
    setShowNewPopupScreen(true)
  }

  useEffect(() => {
    if(mobileContacts) {
      const onResult = async (QuerySnapshot) => {
          const lastChatCount = await AsyncStorage.getItem('chatCount')
          const chatCount = QuerySnapshot.size
          if(lastChatCount == null || lastChatCount == undefined || lastChatCount == 0) {
            await AsyncStorage.setItem('chatCount', chatCount.toString())
          }else if(lastChatCount < chatCount) {
            await AsyncStorage.setItem('chatCount', chatCount.toString())
            const newChatItems = QuerySnapshot._docs.filter(doc => !doc._data.savedName)
            newChatItems.forEach(chatItem => {
              let savedName = ''
              if(mobileContacts[chatItem._data.phonenumber]){
                savedName = mobileContacts[chatItem._data.phonenumber].fullname
              }else{
                savedName = chatItem._data.fullname
              }
              firestore().collection("Users").doc(currentUser.phonenumber).collection('chats').doc(chatItem._data.phonenumber).update({ savedName: savedName })
            })
          }

          const chatItemDataTemp = []
          QuerySnapshot.forEach((doc, index) => {
            const itemData = doc.data()
            const phonenumber = itemData.phonenumber
            const chatID = itemData.chatID
            const savedName = itemData.savedName
            const lastTextID = itemData.lastTextID
            firestore().collection("Users").doc(phonenumber).get().then(userData_ => {
              const profilePicture = userData_.data().profilePicture
              firestore().collection("Chats").doc(chatID).collection('_').doc(lastTextID).get().then(messageData => {
                const data = messageData.data()
                const chatItemData = {
                  phonenumber: phonenumber,
                  chatID: chatID,
                  savedName: savedName,
                  profilePicture: profilePicture,
                  lastMessage: data.text,
                  sentAt: data.sentAt,
                  receivedAt: data.receivedAt,
                  isRead: data.isRead,
                  ...data
                }
                chatItemDataTemp.push(chatItemData)
                if(index == QuerySnapshot.size - 1){
                  setChatItems(chatItemDataTemp)
                }
              })
            })
          })

      
      }
      
      const onError = error => {
        console.log(error)
      }
      
      let subscriber = firestore().collection("Users").doc(currentUser.phonenumber).collection('chats').onSnapshot(onResult, onError)
      return () => subscriber()
    }
  }, [])


  useEffect(() => {
    console.log("chatItems -> ", chatItems)
  }, [chatItems])


  return (
    <>
      <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
      <View style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }}>
        <Header colors={ colors } dpOnClick={ dpOnClick } data={{ fullname: currentUser.fullname, about: currentUser.about, profilePictureUrl: currentUser.profilePicture }} />
        <ScrollView style={{ ...styles.scrollView }} showsVerticalScrollIndicator={false} >
          <Search colors={ colors }/>
          <Story  colors={ colors }/>
          <Chat colors={ colors } chatOnClick={ chatOnClick } loggedInUser={ currentUser } chatItems={ chatItems } addIconClickListner={showModal} dpOnClick={ setShowDPURLFunction } />
        </ScrollView>
      </View>
      { showDPURL && <ShowDPModal unSetShowDPURL={ unSetShowDPURLFunction } colors={ colors } /> }
      { showNewPopupScreen && <NewPopupScreen chatIndividualyFunction={chatIndividualyFunction} hideModal={hideModal} createNewGroupFunction={createNewGroupFunction} /> }
    </>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    scrollView: {
      flexGrow: 1
    }
})
