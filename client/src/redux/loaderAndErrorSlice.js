import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isErrorModelOpen: false,
  confirmationOpen:false,
  confirmation: {
    for:'',
    id:'',
  },
}

const LoaderAndError = createSlice({
    name: 'loaderAndError',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setErrorModelOpen: (state, action) => {
            state.isErrorModelOpen = action.payload;
        },
        setConfirmation: (state, action) => {
            state.confirmation = action.payload;
        },
        setConfirmationOpen: (state, action) => {
            state.confirmationOpen = action.payload;
        },

        
    },
});

export const { setLoading, setErrorModelOpen, setConfirmation, setConfirmationOpen } = LoaderAndError.actions;
export default LoaderAndError.reducer;