import { useEffect } from 'react';
import { setTodo, setStatus, setIsOpenModal, setIsAccordianOpen, setEditData } from '../redux/TodoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading , setConfirmation, setConfirmationOpen} from '../redux/loaderAndErrorSlice';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import api , { addAuthHeader } from "./Api";
import TodoForm from './TodoForm';

const TodoComponent = () => {

    const dispatch = useDispatch();
    const todos = useSelector((store) => store.Todo.allTodos);
    const currentStatus = useSelector((store) => store.Todo.currentStatus);
    const isLoading = useSelector((store) => store.loaderAndError.isLoading);
    const isOpenModal = useSelector((store) => store.Todo.isOpenModal);
    const token = useSelector((store) => store.User.accessToken);
    const editTodo = useSelector((store) => store.Todo.editData);

    useEffect(() => {

        const fetchTodos = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await api.get('/todos',
                    addAuthHeader(accessToken)
                );
                const todosData = response.data.data;
                dispatch(setTodo(todosData));
            } catch (error) {
                console.log(error)
            }
        };
        fetchTodos();

    }, [dispatch, token]);

    const handleStatus = (event) => {
        dispatch(setStatus(event.target.value));
    }

    const handleModal = (updatedTodo = null) => {

        // If we received updated todo data, refresh the list
        if (updatedTodo) {

            const updatedTodos = todos.map(todo =>
                todo._id === updatedTodo._id ? updatedTodo : todo
            );
            dispatch(setTodo(updatedTodos));

        }

        // Clear edit state when closing modal
        dispatch(setEditData(null));
        dispatch(setIsOpenModal(!isOpenModal));

    }

    const handleAccordianOpen = (idx) => {
        dispatch(setIsAccordianOpen(idx));
    }

    const handleUpdate = (item) => {
        dispatch(setEditData(item));
        dispatch(setIsOpenModal(true));
    }

    const handleConfimation = (id) => {   
     dispatch(setConfirmationOpen(true))    
        dispatch(setConfirmation({for:'delete', id}));
    }


    return (
        <div>
            {isLoading && (
                <div className="loader-overlay w-full">
                    <div className="loader"></div>
                </div>
            )}
            {isOpenModal && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
                    <TodoForm handleModal={handleModal}
                        editMode={editTodo !== null}
                        todoData={editTodo} />
                </div>
            )}
            <div className="w-full flex items-center justify-center space-x-3 py-8">
                <button
                    onClick={handleModal}
                    className="px-10 py-4 border border-transparent rounded-md shadow-sm text-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add
                </button>
                <select value={currentStatus} onChange={handleStatus} className="pl-3 pr-4 py-3 font-medium bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none">
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <div>
                {todos.length > 0 ? (
                    // First filter the todos based on current status
                    (() => {
                        const filteredTodos = todos.filter((item) => {
                            if (currentStatus === 'all') {
                                return true;
                            } else {
                                return item.status === currentStatus;
                            }
                        });

                        // Check if we have any todos after filtering
                        if (filteredTodos.length === 0) {
                            return (
                                <div className="w-full flex items-center justify-center py-8">
                                    <h1 className="text-2xl font-bold text-gray-700">No {currentStatus !== 'all' ? currentStatus : ''} Todos Found</h1>
                                </div>
                            );
                        }

                        // If we have filtered todos, map over them
                        return filteredTodos.map((item, index) => {
                            // Check if overdue
                            const isOverdue = new Date(item.dueDate).getTime() < Date.now();
                            // Format date
                            const formattedDate = new Date(item.dueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });

                            // Determine border color based on status and due date
                            let borderColor = 'border-indigo-600';
                            if (item.status === 'completed') {
                                borderColor = 'border-green-600';
                            } else if (isOverdue) {
                                borderColor = 'border-red-600';
                            }

                            return (
                                <div key={index} className="w-full md:w-[90%] mx-auto my-3 text-gray-700">
                                    {/* Category header with controls */}
                                    <div className={`w-full border-b-4 ${borderColor} shadow-md rounded-xl p-4 transition-all duration-300 ease-in-out`}>
                                        <div className='w-full flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                                            {/* Category title */}
                                            <div className="text-lg sm:text-xl md:text-2xl font-bold truncate mb-2 sm:mb-0">
                                                {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                                            </div>

                                            {/* Status and expand/collapse button */}
                                            <div className="flex items-center justify-between sm:justify-end">
                                                {/* Status indicator */}
                                                <div className="flex items-center">
                                                    <span className={`text-sm font-medium mr-2 
                                        ${item.status === 'completed' ? 'text-green-600' : 'text-indigo-600'}`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>

                                                    {item.status !== 'completed' && (
                                                        <span className="text-sm">
                                                            (<span className={`${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                                                {isOverdue ? 'Overdue' : 'Due'}
                                                            </span>)
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Expand/collapse button */}
                                                <button
                                                    onClick={() => handleAccordianOpen(index, filteredTodos)}
                                                    className="ml-3 transition-transform duration-300 transform"
                                                    aria-label={item.isAccordianOpen ? "Collapse" : "Expand"}
                                                >
                                                    {item.isAccordianOpen ? (
                                                        <IoIosArrowUp size={28} className="text-indigo-600" />
                                                    ) : (
                                                        <IoIosArrowDown size={28} className="text-indigo-600" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded content */}
                                        {item.isAccordianOpen && (
                                            <div className="mt-4 pt-3 border-t border-gray-200">
                                                <div className='mb-4'>
                                                    <h2 className='font-bold text-gray-800 mb-1'>Description:</h2>
                                                    <p className='text-gray-700 text-sm'>
                                                        {item.description || "No description provided."}
                                                    </p>
                                                </div>

                                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                                                    <div className='flex items-center mb-3 sm:mb-0'>
                                                        <h2 className='font-bold text-gray-800 mr-2'>Due Date:</h2>
                                                        <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                                            {formattedDate}
                                                        </p>
                                                    </div>

                                                    <div className='flex space-x-3'>
                                                        <button onClick={() => handleUpdate(item)} className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                            Update
                                                        </button>
                                                        <button onClick={() => handleConfimation(item._id)} className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        });
                    })()
                ) : (
                    <div className="w-full flex items-center justify-center py-8">
                        <h1 className="text-2xl font-bold text-gray-700">No Todos Found</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoComponent;