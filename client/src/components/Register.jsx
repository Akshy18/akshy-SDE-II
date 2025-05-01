import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";
import api from "./Api";

// User registration component with form validation
const Register = () => {
    const navigate = useNavigate();
    
    // Password validation regex pattern
    const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

    // Form validation schema using Yup
    const validationSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup
            .string()
            .email("Please enter a valid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .matches(
                passwordRules,
                "Password must contain at least one uppercase, lowercase, and number"
            )
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    // Formik form configuration
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Submit registration data to API
                const response = await api.post("/users/register", {
                    name: values.name,
                    email: values.email,
                    password: values.password
                });
                
                // Redirect to login on successful registration
                navigate("/");
            } catch (err) {
                // Handle registration errors
                if (err.status === 400) {
                    formik.setFieldError("email", "User already exists");
                } else {
                    toast.error(err.response?.data?.error || "Registration failed");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Toast notification container */}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="dark"
            />
            
            {/* Registration form container */}
            <div className="w-full max-w-md bg-gray-200 text-gray-700 rounded-2xl p-8 backdrop-blur-md border-b-8 border-l-4 border-l-indigo-600 border-b-indigo-600 shadow-xl shadow-indigo-500/50">
                <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Name input field */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <div className="relative">
                            <FiUser className="w-5 h-5 absolute top-3 left-3" />
                            <input
                                name="name"
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                placeholder="name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email input field */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <FiMail className="w-5 h-5 absolute top-3 left-3" />
                            <input
                                name="email"
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                placeholder="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password input field */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <FiLock className="w-5 h-5 absolute top-3 left-3" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                placeholder="••••••••"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Confirm Password input field */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <div className="relative">
                            <FiCheck className="w-5 h-5 absolute top-3 left-3" />
                            <input
                                name="confirmPassword"
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-b-2 border-b-indigo-600 rounded-lg text-gray-600 focus:outline-none"
                                placeholder="••••••••"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {formik.isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* Login link */}
                <p className="mt-6 text-center">
                    Already have an account?
                    <Link
                        to="/"
                        className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors pl-2"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;