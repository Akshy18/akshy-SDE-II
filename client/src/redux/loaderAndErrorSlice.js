import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isErrorModelOpen: false,
  confirmationOpen: false,
  confirmation: {
    for: '',
    id: '',
  },
}

const LoaderAndError = createSlice({
    name: 'loaderAndError',
    initialState,
    reducers: {
        // Toggle application loading state
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        // Control error modal visibility
        setErrorModelOpen: (state, action) => {
            state.isErrorModelOpen = action.payload;
        },
        // Set confirmation dialog data with action type and ID
        setConfirmation: (state, action) => {
            state.confirmation = action.payload;
        },
        // Toggle confirmation dialog visibility
        setConfirmationOpen: (state, action) => {
            state.confirmationOpen = action.payload;
        },
    },
});

export const { setLoading, setErrorModelOpen, setConfirmation, setConfirmationOpen } = LoaderAndError.actions;
export default LoaderAndError.reducer;