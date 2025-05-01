import React from "react";
import { useDispatch } from "react-redux";
import { setErrorModelOpen } from "../redux/loaderAndErrorSlice";

const ErrorComponent = () => {
    const dispatch = useDispatch();
    const onCancel = () => {
        dispatch(setErrorModelOpen(false));
    }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 " style={{zIndex:100}}>
      <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm border border-red-600 max-w-md w-full mx-4`}>
        <h2 className={`text-2xl font-bold text-red-600 mb-4 text-center`}>
          Token Expired
        </h2>
        <p className="text-gray-700 text-center font-bold mb-4">
            Try Again
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={()=>onCancel()}
            className={`bg-red-700 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-200 font-medium flex-1 sm:flex-none`}
          >
           Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;