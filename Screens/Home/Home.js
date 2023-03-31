import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Appearance, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import Colors from '../../Colors.js';
import Header from './Components/Header.js';
import Story from './Components/Story.js';
import Chat from './Components/Chat.js';
import Search from './Components/Search.js';
import ShowDPModal from './Components/ShowDP.js';
import Contacts from 'react-native-contacts';
import NewPopupScreen from '../ContactScreen/NewPopupScreen.js';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux'



export default function HomeScreen({ route, navigation }) {

  const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
  const currentUser = useSelector((state) => state.currentUser.currentUser)

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
  const [contactList, setContactList] = useState()
  const [addChatItemListenerFlag, setAddChatItemListenerFlag] = useState()
  const [isFirstTime, setIsFirstTime] = useState(true)

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
    navigation.navigate('Chat', { userData: {phonenumber: '+91' + chatItem.phonenumber, savedName: chatItem.savedName} })
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

    async function getContacts() {
      try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const totalContacts = await Contacts.getCount()
            const totalContactsLastCount = await AsyncStorage.getItem('totalContacts')
            if(totalContactsLastCount == null || totalContactsLastCount == undefined){
              await AsyncStorage.setItem('totalContacts', totalContacts + '')
            }else if(totalContactsLastCount == totalContacts){
              setAddChatItemListenerFlag(null)
              const contacts = await Contacts.getAll()
              const _ = {}
              contacts.forEach(contact => {
                if(contact.phoneNumbers[0]){
                  const pn = contact.phoneNumbers[0].number.startsWith("+91") ? contact.phoneNumbers[0].number : "+91" + contact.phoneNumbers[0].number 
                  const contact_ = {
                      fullname: contact.displayName,
                      phonenumber: pn.toString()
                  }
                  _[pn] = contact_
                }
              })
              setContactList(_)
              setIsFirstTime(false)
              setAddChatItemListenerFlag(true)
            }else{
              setIsFirstTime(false)
              setAddChatItemListenerFlag(true)
            }
          } else {
            console.log('Contact permission denied');
          }
        } catch (err) {
          console.log(err);
        }
  }
  getContacts()

  }, [])

  useEffect(() => {
    if(contactList){
      const saveContactList = async () => {
        await AsyncStorage.setItem('Contacts', JSON.stringify(contactList))
      }
      saveContactList()
    }
  }, [contactList])

  useEffect(() => {
    if(addChatItemListenerFlag && !isFirstTime) {
      const onResult = async (QuerySnapshot) => {
          const lastChatCount = await AsyncStorage.getItem('chatCount')
          const chatCount = QuerySnapshot.size
          if(lastChatCount == null || lastChatCount == undefined || lastChatCount == 0) {
            await AsyncStorage.setItem('chatCount', chatCount.toString())
          }else if(lastChatCount < chatCount) {
            await AsyncStorage.setItem('chatCount', chatCount.toString())
            const contactDataString = await AsyncStorage.getItem('Contacts')
            const contactData = JSON.parse(contactDataString)
            const newChatItems = QuerySnapshot._docs.filter(doc => !doc._data.savedName)
            newChatItems.forEach(chatItem => {
              let savedName = ''
              if(contactData["+91" + chatItem._data.phonenumber]){
                savedName = contactData["+91" + chatItem._data.phonenumber].fullname
              }else{
                savedName = "+91" + chatItem._data.phonenumber
              }
              firestore().collection("Users").doc('+91' + currentUser.phonenumber).collection('chats').doc("+91" + chatItem._data.phonenumber).update({ savedName: savedName })
            })
          }

          const chatItemDataTemp = []
          QuerySnapshot.forEach((doc, index) => {
            const itemData = doc.data()
            const phonenumber = itemData.phonenumber
            const chatID = itemData.chatID
            const savedName = itemData.savedName
            const lastTextID = itemData.lastTextID
            firestore().collection("Users").doc("+91" + phonenumber).get().then(userData_ => {
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
      
      let subscriber = firestore().collection("Users").doc('+91' + currentUser.phonenumber).collection('chats').onSnapshot(onResult, onError)
      return () => subscriber()
    }
  }, [addChatItemListenerFlag])


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
