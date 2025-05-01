import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import TodoSlice from "./TodoSlice";
import LoaderAndError from "./loaderAndErrorSlice";

const store = configureStore({

    reducer: {
        User: UserSlice,
        Todo: TodoSlice,
        loaderAndError: LoaderAndError
    },
    devTools:false

})

export default store; 