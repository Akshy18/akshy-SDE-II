import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmation , setConfirmationOpen} from "../redux/loaderAndErrorSlice";

const ConfirmationComp = ({handleDelete, handleLogout}) => {
    console.log('inside confirm')
    const dispatch = useDispatch();
    const isConfirm = useSelector((store) => store.loaderAndError.confirmation);
    const onCancel = () => {
        dispatch(setConfirmationOpen(false))
        dispatch(setConfirmation({for: '', id: ''}));
    }
    const onConfirm = () => {

        if(isConfirm.for === 'delete') {  
            handleDelete(isConfirm.id);
         } else{
            handleLogout();
         }
        dispatch(setConfirmationOpen(false))
        dispatch(setConfirmation({for: '', id: ''}));
    }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm border border-red-600 max-w-md w-full mx-4`}>
        <h2 className={`text-2xl font-bold text-gray-600 mb-4 text-center`}>
          Are you Sure ?
        </h2>
        <p className="text-gray-700 text-center font-bold mb-4">
            Want to {isConfirm.for}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={()=>onConfirm()}
            className={`bg-red-700 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-200 font-medium flex-1 sm:flex-none`}
          >
           {isConfirm.for}
          </button>
          <button
            onClick={()=>onCancel()}
            className={`bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-all duration-200 font-medium flex-1 sm:flex-none`}
          >
           cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationComp;