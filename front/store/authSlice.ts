import { createSlice } from '@reduxjs/toolkit'
import { AppState } from './store'
import { HYDRATE } from 'next-redux-wrapper'
import {  REHYDRATE } from 'redux-persist'
import { userRole } from '../interfaces';
import { setCookies } from 'cookies-next';

// Type for our state
export interface AuthState {
  authState: boolean,
  authToken: string | null,
  authRole: userRole,
  login: string
}

// Initial state
const initialState: AuthState = {
  authState: false,
  authToken: '',
  authRole: userRole.guest,
  login: ''
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // Action to set the authentication status
    setAuthState(state, action) {
        state.authState = action.payload.authState
        state.authToken = action.payload.authToken
        state.authRole = action.payload.authRole
        state.login = action.payload.login
        setCookies('token', action.payload.authToken)
    },

    setInitialState(state){
        state.authState = false
        state.authToken = ''
        state.authRole = userRole.guest,
        state.login = ''
    },

    updateToken(state, action) {
        state.authToken = action.payload
      },

    emptyDispatch(state, action){

    }
  },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
      [HYDRATE]: (state, action) => {
        console.log('hidration state', state, action)
        return {
          ...state,
          ...action.payload.auth,
        }
      },
    },

  }
)

export const { setAuthState, updateToken, setInitialState, emptyDispatch } = authSlice.actions

export const selectAuthState = (state: AppState) => state.auth.authState
export const selectAuthData = (state: AppState) => state.auth

export default authSlice.reducer