import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: '',
    name: '',
    email: '',
    accessToken: '',
    accessTokenExpiry: 0,  // Counter to trigger token refresh
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        // Set user profile information
        setUser: (state, action) => {
            state.userId = action.payload._id;
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        // Store JWT access token
        setToken: (state, action) => {
            state.accessToken = action.payload;
        },
        // Clear access token on logout
        clearToken: (state) => {
            state.accessToken = '';
        },
        // Clear user data on logout
        clearUser: (state) => {
            state.userId = '';
            state.name = '';
            state.email = '';
        },
        // Increment counter to trigger token refresh when expired
        setAccessTokenExpiry: (state, action) => {
            state.accessTokenExpiry += 1;
        },
    },
});

export const { setUser, clearUser, setToken, clearToken, setAccessTokenExpiry } = userSlice.actions;
export default userSlice.reducer;