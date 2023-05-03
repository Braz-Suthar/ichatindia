import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native'
import { Provider } from 'react-redux'
import store from './src/StateManagement/Store/Store'


messaging().setBackgroundMessageHandler(async message => {
    await firestore().collection("Demo").doc(message.data.savedName).set({text: message.data.text})
    const timeStamp = firestore.FieldValue.serverTimestamp()
    await firestore().collection('Chats').doc(message.data.chatID).collection('_').doc(message.data.textID).update({
        isReceived: true,
        receivedAt: timeStamp
    })
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
        title: message.data.savedName,
        body: message.data.text,
        android: {
            channelId,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
        },
    })
});


const ReduxProvider = () => {
    return(
        <Provider store={store}>
            <App />
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => ReduxProvider);
