import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId:'',
    name:'',
    email:'',
    accessToken:'',
    accessTokenExpiry: 0,
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload._id;
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        setToken: (state, action) => {
            state.accessToken = action.payload;
        },
        clearToken: (state) => {
            state.accessToken = '';
        },
        clearUser: (state) => {
            state.userId = '';
            state.name = '';
            state.email = '';
        },
        setAccessTokenExpiry: (state, action) => {
            state.accessTokenExpiry+=1;
        },
    },
});

export const { setUser, clearUser, setToken, clearToken, setAccessTokenExpiry } = userSlice.actions;
export default userSlice.reducer;