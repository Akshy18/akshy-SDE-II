import Navbar from "./Navbar";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setUser, clearToken, clearUser } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import api, { addAuthHeader, refreshAccessToken } from "./Api";
import TodoComponent from "./TodoComponent";
import { setLoading, setErrorModelOpen } from "../redux/loaderAndErrorSlice";
import { setTodo } from '../redux/TodoSlice';
import ErrorComponent from "./Error";
import { setAccessTokenExpiry } from '../redux/UserSlice';
import ConfirmationComp from "./Confirmation";

// Main application component handling authentication state and todo management
const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state selectors
  const token = useSelector((store) => store.User.accessToken);
  const accessTokenExpiry = useSelector((store) => store.User.accessTokenExpiry);
  const isLoading = useSelector((store) => store.loaderAndError.isLoading);
  const isConfirmOpen = useSelector((store) => store.loaderAndError.confirmationOpen);
  const isError = useSelector((store) => store.loaderAndError.isErrorModelOpen);
  const todos = useSelector((store) => store.Todo.allTodos);

  // Effect for initial authentication check and token refresh
  useEffect(() => {
    dispatch(setLoading(true));
    
    const initAuth = async () => {
      try {
        let accessToken = localStorage.getItem("accessToken");

        // Redirect if no token exists
        if (!accessToken) {
          navigate('/');
          return;
        }

        // Sync Redux with localStorage token
        if (token !== accessToken) {
          dispatch(setToken(accessToken));
        }

        // Verify token by accessing protected route
        try {
          const response = await api.get(
            "/users/protected",
            addAuthHeader(accessToken)
          );
          dispatch(setUser(response.data.user));
        } catch (error) {
          // Handle token expiration
          if (error.response?.status === 401) {
            try {
              // Attempt token refresh
              accessToken = await refreshAccessToken();
              dispatch(setToken(accessToken));

              // Retry protected route with new token
              const retryResponse = await api.get(
                "/users/protected",
                addAuthHeader(accessToken)
              );
              dispatch(setUser(retryResponse.data.user));
            } catch (refreshError) {
              // Clear tokens and redirect on refresh failure
              localStorage.removeItem("accessToken");
              dispatch(clearToken());
              dispatch(setTodo([]));
              dispatch(clearUser());
              navigate('/');
            }
          } else {
            console.error("Error accessing protected route:", error);
          }
        }
      } catch (error) {
        // Fallback error handling
        localStorage.removeItem("accessToken");
        dispatch(clearToken());
        dispatch(setTodo([]));
        dispatch(clearUser());
        navigate('/');
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [accessTokenExpiry, dispatch, navigate, token]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      const response = await api.post("/users/logout");
      if (response.status === 200) {
        // Clear user data on successful logout
        localStorage.removeItem("accessToken");
        dispatch(clearToken());
        dispatch(setTodo([]));
        dispatch(clearUser());
        navigate("/");
      }
    } catch (error) {
      // Trigger token refresh if logout fails
      dispatch(setAccessTokenExpiry());
      dispatch(setErrorModelOpen(true));
    }
  };

  // Handle todo deletion
  const handleDelete = async (id) => {
    dispatch(setLoading(true));
    const accessToken = localStorage.getItem("accessToken");
    
    try {
      await api.delete(`/todos/${id}`, addAuthHeader(accessToken));
      const updatedTodos = todos.filter(todo => todo._id !== id);
      dispatch(setTodo(updatedTodos));
    } catch (error) {
      // Trigger token refresh if deletion fails
      dispatch(setAccessTokenExpiry());
      dispatch(setErrorModelOpen(true));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      {/* Error modal */}
      {isError && <ErrorComponent />}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loader-overlay w-full">
          <div className="loader"></div>
        </div>
      )}
      
      {/* Main content when authenticated */}
      {token && (
        <div>
          <Navbar />
          <TodoComponent />
        </div>
      )}
      
      {/* Confirmation dialog */}
      {isConfirmOpen && (
        <ConfirmationComp 
          handleDelete={handleDelete} 
          handleLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default Main;