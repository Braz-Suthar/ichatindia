import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './../Slices/CurrentUserSlice'

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer
  },
})

export default store