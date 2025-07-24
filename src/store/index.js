import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from 'redux-thunk'
import authReducer from './authSlice'

const rootReducer = combineReducers({ auth: authReducer })