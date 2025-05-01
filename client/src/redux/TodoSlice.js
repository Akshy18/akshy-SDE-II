import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  allTodos: [],
  currentStatus: "all",
  isOpenModal: false,
  editData: null,
}

const TodoSlice = createSlice({
    name: 'Todo',
    initialState,
    reducers: {
        setTodo: (state, action) => {
            const todos = action.payload;
            const newTodos = todos.map((todo) => {
                return {
                    ...todo,
                    isAccordianOpen: false,
                };
            });
            state.allTodos = newTodos;
        },
        setStatus: (state, action) => {
            state.currentStatus = action.payload;
        },  
        setIsOpenModal: (state, action) => {
            state.isOpenModal = action.payload;
        },
        addTodo: (state, action) => {
            state.allTodos.push({...action.payload, isAccordianOpen: true});
        },
        setIsAccordianOpen: (state, action) => {
            const idx = action.payload;
            state.allTodos[idx].isAccordianOpen = !state.allTodos[idx].isAccordianOpen;

        },
        setEditData: (state, action) => {
            state.editData = action.payload;
        },

        
    },
});

export const { setTodo, setStatus, setIsOpenModal, addTodo, setIsAccordianOpen, setEditData } = TodoSlice.actions;
export default TodoSlice.reducer;