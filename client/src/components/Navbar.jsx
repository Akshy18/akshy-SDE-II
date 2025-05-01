import { useDispatch } from "react-redux";
import { setConfirmation, setConfirmationOpen } from '../redux/loaderAndErrorSlice';

// Navbar component with logout functionality
const Navbar = () => {
    const dispatch = useDispatch();
    
    // Trigger logout confirmation dialog
    const handleLogoutConfirmation = () => {
        dispatch(setConfirmationOpen(true));
        dispatch(setConfirmation({ for: "logout", id: '' }));
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* Navigation bar with app title and logout button */}
            <nav className="w-full flex items-center justify-between p-5 min-h-[15vh] bg-indigo-600">
                <h1 className="text-xl sm:text-3xl font-bold text-white">myToDo</h1>
                
                {/* Logout button */}
                <div
                    onClick={handleLogoutConfirmation}
                    className={`text-white hover:text-gray-400 cursor-pointer font-medium sm:text-lg text-md`}
                >
                    Logout
                </div>
            </nav>
        </div>
    );
};

export default Navbar;