import { createSlice } from '@reduxjs/toolkit'
import produce from "immer"

const initialState = {
    contacts: {}
}

export const mobileContactsSlice = createSlice({
  name: 'mobileContacts',
  initialState,
  reducers: {
    update: (state, action) => {
        const baseState = state.contacts
        const nextState = produce(baseState, draftState => {
            draftState[action.payload.phonenumber] = action.payload
        })
        state.contacts = nextState
    },
    set: (state, action) => {
      state.contacts = action.payload
    },
  },
})

export const { update, set } = mobileContactsSlice.actions

export default mobileContactsSlice.reducer