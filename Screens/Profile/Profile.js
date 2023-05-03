import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Appearance, StyleSheet, ScrollView, Image, TouchableHighlight } from 'react-native';
import Colors from '../../Colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from './../../src/StateManagement/Slices/CurrentUserSlice'


export default function ProfileScreen({ route, navigation }) {

  const [themeState, setThemeState] = useState(Appearance.getColorScheme() || 'light')
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser.currentUser)

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeState(colorScheme)
    })
    return () => subscription.remove()
  }, [])

  const colors = Colors[themeState] 

  const logout_ = async () => {  
    try {
        await AsyncStorage.removeItem('user')
        dispatch(logout('noUserLoggedIn'))
      } catch(e) {
        console.log(e)
      }
  }

  return (
    <>
      <StatusBar barStyle={ themeState === 'dark' ? 'light-content' : 'dark-content' } backgroundColor={ colors.bgPrimary } />
      <ScrollView style={{ ...styles.mainContainer, backgroundColor: colors.bgPrimary }} showsVerticalScrollIndicator={false}>
        <View style={{ ...styles.coverContainer }}>
          <View style={{ ...styles.coverContainerOverlay, backgroundColor: colors.coverContainerOverlay }}>
            <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <TouchableHighlight onPress={logout_} underlayColor={'rgba(0,0,0,0)'}>
                <Ionicons name={'ios-power-sharp'} size={ 24 } style={{ color: colors.textSecondary, textAlign: 'right', padding: 10 }} />
              </TouchableHighlight>
            </View>
          </View>
          <Image source={{ uri: currentUser.coverPicture }} style={{ width: 'auto', height: 200 }}/>
        </View>
        <View style={{ ...styles.profilePictureContainer }}>
          <View style={{ ...styles.profilePicture}}>
            <Image source={{ uri: currentUser.profilePicture }} style={{ width: 150, height: 150, borderRadius: 75, borderColor: colors.bgPrimary, borderWidth: 5 }} />
          </View>
        </View>
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ ...styles.username, color: colors.textPrimary}}>{ currentUser.fullname }</Text>
            <Icon name={'verified'}  size={ 22 } style={{ color: colors.blue, marginLeft: 5 }}/>
          </View>
          <Text style={{ ...styles.about, color: colors.textSecondary}}>{ currentUser.about }</Text>
        </View>

        <View style={{ ...styles.container, marginTop: 50 }}>
          <Text style={{ ...styles.containerHeading, color: colors.textPrimary }} >General</Text>
          <View style={{ ...styles.containerInner, backgroundColor: colors.bgSecondary }}>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#30E3DF'}}>
                <Ionicons name={'ios-call'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>{ `+91 ${currentUser.phonenumber}` }</Text>
            </View>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#F94A29'}}>
                <Ionicons name={'ios-mail'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>brazsuthar@ichat.in</Text>
            </View>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#FF0032'}}>
                <Ionicons name={'ios-globe-sharp'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>brazsuthar.ichat.in</Text>
            </View>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#03C988'}}>
                <Ionicons name={'ios-location'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>Bikaner, Rajasthan</Text>
            </View>
          </View>
        </View>

        <View style={{ ...styles.container, marginTop: 20}}>
          <View style={{ ...styles.containerInner, backgroundColor: colors.bgSecondary }}>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#FF78F0'}}>
                <Ionicons name={'ios-star'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>Starred Messages</Text>
              <View style={{ ...styles.containerItemRightIcon}}>
                <Text style={{ ...styles.starredMessagesCount, color: colors.blue }} >1128</Text>
                <Ionicons name={'ios-chevron-forward'} size={ 20 } style={{ color: colors.blue, verticalAlign: 'middle', textAlign: 'right' }} />
              </View>
            </View>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#ECA869'}}>
                <Ionicons name={'ios-color-palette'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>Dark Theme</Text>
            </View>
          </View>
        </View>


        <View style={{ ...styles.container, marginTop: 20 }}>
          <Text style={{ ...styles.containerHeading, color: colors.textPrimary }} >Accounts</Text>
          <View style={{ ...styles.containerInner, backgroundColor: colors.bgSecondary }}>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftDP }}>
                <Image source={require('./../../Images/steve.jpg')} style={{ width: 40, height: 40, borderRadius: 20 }} />
              </View>
              <View style={{ ...styles.containerItemMiddle }}>
                <Text style={{ fontSize: 20, color: colors.textPrimary }}>Braz Suthar Official</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Let's connect officially</Text>
              </View>
              <View style={{ ...styles.accountContainerItemRight }}>
              <Text style={{ ...styles.starredMessagesCount, color: colors.blue }} >1128</Text>
                <Ionicons name={'ios-chevron-forward'} size={ 20 } style={{ color: colors.blue, verticalAlign: 'middle', textAlign: 'right' }} />
              </View>
            </View>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon }}>
                <Ionicons name={'ios-person-add'} size={ 24 } style={{ color: colors.blue }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.blue }}>Add New Account</Text>
            </View>
          </View>
        </View>

        <View style={{ ...styles.container, marginTop: 20, marginBottom: 50 }}>
          <Text style={{ ...styles.containerHeading, color: colors.textPrimary }} >Setting</Text>
          <View style={{ ...styles.containerInner, backgroundColor: colors.bgSecondary }}>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#379237'}}>
                <Ionicons name={'ios-notifications'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>Notification</Text>
            </View>
            <View style={{ ...styles.containerItem }}>
              <View style={{ ...styles.containerItemLeftIcon, backgroundColor: '#2A3990'}}>
                <Ionicons name={'ios-lock-closed'} size={ 24 } style={{ color: 'white' }} />
              </View>
              <Text style={{ ...styles.containerItemText, color: colors.textSecondary }}>Privacy</Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 10,
    },
    coverContainer: {
      width: '100%',
      height: 200
    },
    coverContainerOverlay: {
      width: '100%',
      height: 200,
      position: 'absolute',
      zIndex: 1,
    }, 
    profilePictureContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    profilePicture: {
      width: 150,
      height: 150,
      marginTop: -75,
      borderRadius: 75,
    },
    username: {
      fontSize: 45,
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: 15
    },
    about: {
      fontSize: 20,
      textAlign: 'center',
      paddingTop: 10,
      paddingHorizontal: 17
    },
    container: {
      width: '100%',
      paddingHorizontal: 20,
    },
    containerHeading: {
      fontSize: 30,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    containerInner: {
      width: '100%',
      borderRadius: 8,
      paddingHorizontal: 15
    },
    containerItem: {
      display: 'flex',
      flexDirection: 'row',
      paddingVertical: 12
    },
    containerItemLeftIcon: {
      padding: 5,
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerItemText: {
      fontSize: 20,
      verticalAlign: 'middle',
      marginLeft: 20
    },
    containerItemRightIcon: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexGrow: 1
    },
    starredMessagesCount: {
      fontSize: 20,
    },
    containerItemLeftDP: {
      width: 40,
      height: 40,
      borderRadius: 20
    },
    containerItemMiddle: {
      width: '70%',
      paddingLeft: 15
    },
    accountContainerItemRight: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexGrow: 1
    }
})
