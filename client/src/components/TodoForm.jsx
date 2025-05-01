import { useFormik } from "formik";
import * as yup from "yup";
import api, { addAuthHeader } from "./Api";
import { addTodo } from "../redux/TodoSlice";
import { useDispatch } from "react-redux";
import { setAccessTokenExpiry } from '../redux/UserSlice';
import { setErrorModelOpen } from '../redux/loaderAndErrorSlice';

const TodoForm = ({ handleModal, editMode = false, todoData = null }) => {

    const dispatch = useDispatch();
    const validationSchema = yup.object().shape({
        title: yup.string().max(20, 'Title should be less than 20 letters').required("Title is required"),
        description: yup
            .string()
            .max(1000, 'Description should be less than 1000 letters')
            .required("Description is required"),
        dueDate: yup
            .date()
            .required("Due date is required")
            .when('$editMode', {
                is: false,
                then: (schema) => schema.min(new Date(), "Due date cannot be in the past")
            }),
    });

    const formik = useFormik({
        initialValues: {
            title: todoData?.title || "",
            description: todoData?.description || "",
            status: todoData?.status || "pending",
            dueDate: todoData?.dueDate ? new Date(todoData.dueDate).toISOString().substr(0, 10) : "",
        },
        validationSchema,
        validateOnMount: editMode,
        enableReinitialize: true,
        validationContext: { editMode },
        onSubmit: async (values, { setSubmitting }) => {
            const accessToken = localStorage.getItem("accessToken");

            try {
                let response;

                if (editMode && todoData?._id) {
                    // Update existing todo
                    response = await api.put(
                        `/todos/${todoData._id}`,
                        values,
                        addAuthHeader(accessToken)
                    );
                } else {
                    // Create new todo
                    response = await api.post(
                        '/todos',
                        values,
                        addAuthHeader(accessToken)
                    );
                }

                const todosData = response.data.data;

                if (editMode) {

                    handleModal(todosData);
                } else {
                    dispatch(addTodo(todosData));
                    handleModal();
                }
            } catch (error) {

                dispatch(setAccessTokenExpiry());
                dispatch(setErrorModelOpen(true));

            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-200 text-gray-700 rounded-2xl p-8 backdrop-blur-md border-b-8 border-l-4 border-l-indigo-600 border-b-indigo-600 shadow-xl shadow-indigo-500/50">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {editMode ? "Update Todo" : "Add Todo"}
                </h1>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Title
                        </label>
                        <div className="relative">
                            <input
                                name="title"
                                type="text"
                                className="w-full pl-3 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                placeholder="title"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.title}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.title}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-2 space-y-6 sm:space-y-0">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-4 py-3 font-medium bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                    id="status"
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                >
                                    <option value='pending'>pending</option>
                                    <option value='completed'>complete</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                dueDate
                            </label>
                            <div className="relative">
                                <input
                                    name="dueDate"
                                    type="date"
                                    className="custom-date w-full pl-3 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                    placeholder="dueDate"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dueDate}
                                />
                                {formik.touched.dueDate &&
                                    formik.errors.dueDate && (
                                        <p className="absolute text-red-500 text-sm mt-1">
                                            {formik.errors.dueDate}
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <div className="relative">
                            <textarea
                                name="description"
                                className="w-full max-h-[20vh] min-h-[5vh]  pl-3 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                placeholder="Enter your description"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                            ></textarea>

                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            {formik.isSubmitting
                                ? (editMode ? "Updating..." : "Adding...")
                                : (editMode ? "Update Todo" : "Add Entry")
                            }
                        </button>

                        <button
                            type="button"
                            onClick={handleModal}
                            className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TodoForm;