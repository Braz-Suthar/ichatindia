import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload
    },
    logout: (state, action) => {
      state.currentUser = action.payload
    },
    update: (state, action) => {
        state.currentUser = action.payload
    }
  },
})

export const { login, logout, update } = currentUserSlice.actions

export default currentUserSlice.reducer