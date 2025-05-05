import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allTodos: [],
  currentStatus: "all",  // Filter status (all, pending, completed)
  isOpenModal: false,    // Controls todo form modal visibility
  editData: null,        // Holds data for todo being edited
}

const TodoSlice = createSlice({
    name: 'Todo',
    initialState,
    reducers: {
        // Set all todos and initialize accordion state
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
        // Update current filter status
        setStatus: (state, action) => {
            state.currentStatus = action.payload;
        },  
        // Toggle todo form modal visibility
        setIsOpenModal: (state, action) => {
            state.isOpenModal = action.payload;
        },
        // Add new todo to the list with expanded accordion
        addTodo: (state, action) => {
            state.allTodos.push({...action.payload, isAccordianOpen: true});
        },
        // Toggle accordion state for specific todo
        setIsAccordianOpen: (state, action) => {
            const id = action.payload;
            state.allTodos.map((item) => {
                if(item._id === id){
                    item.isAccordianOpen = !item.isAccordianOpen
                    return
                }
            } )
        },
        // Set current todo data for editing
        setEditData: (state, action) => {
            state.editData = action.payload;
        },
    },
});

export const { setTodo, setStatus, setIsOpenModal, addTodo, setIsAccordianOpen, setEditData } = TodoSlice.actions;
export default TodoSlice.reducer;