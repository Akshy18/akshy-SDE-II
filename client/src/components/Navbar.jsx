import { useDispatch } from "react-redux";
import { setConfirmation , setConfirmationOpen} from '../redux/loaderAndErrorSlice';


const Navbar = () => {

    const dispatch = useDispatch();
    
    const handleLogutConfirmation = () => {
        dispatch(setConfirmationOpen(true))
        dispatch(setConfirmation({for:"logout", id:''}));
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <nav className="w-full flex items-center justify-between p-5 min-h-[15vh] bg-indigo-600">
                {/* App title */}
                <h1 className="text-xl sm:text-3xl font-bold text-white">myToDo</h1>
                <div
                    onClick={handleLogutConfirmation}
                    className={`text-white hover:text-gray-400 cursor-pointer font-medium sm:text-lg text-md`}
                >
                    Logout
                </div>
            </nav>
        </div>
    );
};

export default Navbar;