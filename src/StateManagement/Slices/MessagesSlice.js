import { createSlice } from '@reduxjs/toolkit'
import produce from "immer"

const initialState = {
    messages: {}
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    update: (state, action) => {
        // const baseState = state.contacts
        // const nextState = produce(baseState, draftState => {
        //     draftState[action.payload.phonenumber] = action.payload
        // })
        // state.contacts = nextState
    },
    set: (state, action) => {
      state.messages[action.payload.chatID] = action.payload.messages 
    },
    add: (state, action) => {
        const textData = {}
        textData[action.payload.textID] = {
            ...action.payload.textData
        }
        state.messages[action.payload.chatID] = { ...textData, ...state.messages[action.payload.chatID] }
    }
  },
})

export const { update, set, add } = messagesSlice.actions

export default messagesSlice.reducer