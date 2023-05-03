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
import { horizontalScalePercent, verticalScalePercent, horizontalScale, verticalScale, moderateScale } from './../../src/Metrics'



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
  const [chatItemsTemp, setChatItemsTemp] = useState({})

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
      const chatItemDataTemp = []
      const onResult = async (QuerySnapshot) => {
          const lastChatCount = await AsyncStorage.getItem('chatCount')
          const chatCount = QuerySnapshot.size
          if(lastChatCount == null || lastChatCount == undefined || lastChatCount == 0) {
            await AsyncStorage.setItem('chatCount', chatCount.toString())
          }else if(lastChatCount < chatCount) {
            await AsyncStorage.setItem('chatCount', chatCount.toString())
            const newChatItems = QuerySnapshot._docs.filter(doc => !doc._data.savedName)
            console.log(newChatItems)
            const chatItemsCallback = async (data) => {
              let savedName = ''
              if(mobileContacts[data.phonenumber]){
                savedName = mobileContacts[data.phonenumber].fullname
              }else{
                savedName = data.fullname
              }
              await firestore().collection("Users").doc(currentUser.phonenumber).collection('chats').doc(data.phonenumber).update({ savedName: savedName })
            }

            newChatItems.forEach(data => chatItemsCallback(data.data()))

            // newChatItems.forEach(chatItem => {
            //   let savedName = ''
            //   if(mobileContacts[chatItem._data.phonenumber]){
            //     savedName = mobileContacts[chatItem._data.phonenumber].fullname
            //   }else{
            //     savedName = chatItem._data.fullname
            //   }
            //   firestore().collection("Users").doc(currentUser.phonenumber).collection('chats').doc(chatItem._data.phonenumber).update({ savedName: savedName })
            // })
          }

          // for await (let snapshot of QuerySnapshot){
          //   console.log(snapshot)
          // }
          // console.log(typeof QuerySnapshot)
          

          const callback = async (data) => {
            const phonenumber = data.phonenumber
            const chatID = data.chatID
            const savedName = data.savedName
            const lastTextID = data.lastTextID
            const userDataDetails = await firestore().collection("Users").doc(phonenumber).get()
            const profilePicture = userDataDetails.data().profilePicture
            const lastTextResult = await firestore().collection("Chats").doc(chatID).collection('_').doc(lastTextID).get()
            const newTextsResult = await firestore().collection("Chats").doc(chatID).collection('_').where('sender', '==', phonenumber).where('isRead', '!=', true).get()
            const newTextsCount = newTextsResult.size
            const lastTextData = lastTextResult.data()
            const chatItemData = {}
            chatItemData[phonenumber] = {
              phonenumber: phonenumber,
              chatID: chatID,
              savedName: savedName,
              profilePicture: profilePicture,
              lastMessage: lastTextData.text,
              sentAt: lastTextData.sentAt,
              receivedAt: lastTextData.receivedAt,
              newTextsCount: newTextsCount,
              ...lastTextData
            }
            setChatItemsTemp({ ...chatItemsTemp, ...chatItemData })
          }
          QuerySnapshot.forEach(data => callback(data.data()))
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
          <Chat colors={ colors } chatOnClick={ chatOnClick } loggedInUser={ currentUser } chatItems={ Object.values(chatItemsTemp) } addIconClickListner={showModal} dpOnClick={ setShowDPURLFunction } />
        </ScrollView>
      </View>
      { showDPURL && <ShowDPModal unSetShowDPURL={ unSetShowDPURLFunction } colors={ colors } /> }
      { showNewPopupScreen && <NewPopupScreen chatIndividualyFunction={chatIndividualyFunction} hideModal={hideModal} createNewGroupFunction={createNewGroupFunction} /> }
    </>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        height: verticalScalePercent(100),
        width: horizontalScalePercent(100),
        display: 'flex',
        flexDirection: 'column',
    },
    scrollView: {
      flexGrow: 1
    }
})
