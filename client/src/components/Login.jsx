import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/UserSlice";
import * as yup from "yup";
import { useFormik } from "formik";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./Api";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post(
          "/users/login",
          values,
          {
            withCredentials: true
          }
        );
   
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        dispatch(setToken(accessToken));
        navigate("/main");
      } catch (err) {
        console.log(err.response?.data?.error)
        toast.error(err.response?.data?.error || "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      <div className="w-full max-w-md bg-gray-200 text-gray-700 rounded-2xl p-8 backdrop-blur-md border-b-8 border-l-4 border-l-indigo-600 border-b-indigo-600 shadow-xl shadow-indigo-500/50">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative ">
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="w-5 h-5 absolute top-3 left-3 " />
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

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiLogIn className="w-5 h-5" />
            {formik.isSubmitting ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          New user?
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors pl-2"
          >
            Register here
          </Link>
          {/* {formik.isSubmitting && <p className="text-red-500">free instance naps for 50s before waking up</p>} */}
        </p>
      </div>

    </div>
  );
};

export default Login;
