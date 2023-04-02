import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './../Slices/CurrentUserSlice'
import mobileContactsReducer from '../Slices/MobileContactsSlice'
import messagesSliceReducer from '../Slices/MessagesSlice'

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    mobileContacts: mobileContactsReducer,
    messages: messagesSliceReducer,
  },
})

export default store