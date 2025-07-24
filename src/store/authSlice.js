import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
    token: token || null,
    user: user ? JSON.parse(user) : null
}

const authSlice = createSlice({
    name: 'auth', initialState, 
    reducers:{
        loginSucess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user))
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

});


export const { loginSucess , logout } = authSlice.actions;

export default authSlice.reducer;