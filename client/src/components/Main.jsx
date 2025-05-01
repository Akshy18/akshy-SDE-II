import Navbar from "./Navbar";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setUser, clearToken } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import api, { addAuthHeader, refreshAccessToken } from "./Api";
import TodoComponent from "./TodoComponent";
import { setLoading,  setErrorModelOpen } from "../redux/loaderAndErrorSlice";
import { setTodo} from '../redux/TodoSlice';
import ErrorComponent from "./Error";
import { setAccessTokenExpiry } from '../redux/UserSlice';
import ConfirmationComp from "./Confirmation";


const Main = () => {

  const dispatch = useDispatch();
  const token = useSelector((store) => store.User.accessToken);
  const accessTokenExpiry = useSelector((store) => store.User.accessTokenExpiry);
  const isLoading = useSelector((store) => store.loaderAndError.isLoading);
  const isConfirmOpen = useSelector((store) => store.loaderAndError.confirmationOpen);
  const isError = useSelector((store) => store.loaderAndError.isErrorModelOpen);
  const todos = useSelector((store) => store.Todo.allTodos);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(true));
    const initAuth = async () => {
      try {
        // Get token from localStorage
        let accessToken = localStorage.getItem("accessToken");

        // If no token, redirect to login
        if (!accessToken) {
          navigate('/');
          return;
        }

        // Update Redux if needed
        if (token !== accessToken) {
          dispatch(setToken(accessToken));
        }

        // Try to access protected route
        try {
          const response = await api.get(
            "/users/protected",
            addAuthHeader(accessToken)
          );
          dispatch(setUser(response.data.user));
        } catch (error) {
          // If unauthorized, try to refresh token
          console.log(error)
          if (error.response?.status === 401) {
            try {
              // Get new token
              accessToken = await refreshAccessToken();
              dispatch(setToken(accessToken));

              // Retry with new token
              const retryResponse = await api.get(
                "/users/protected",
                addAuthHeader(accessToken)
              );
              console.log('success in retry')
              dispatch(setUser(retryResponse.data.user));
            } catch (refreshError) {
              // If refresh fails, redirect to login
              console.error("Token refresh failed:", refreshError);
              localStorage.removeItem("accessToken");
              dispatch(clearToken());
              navigate('/');
            }
          } else {
            // Handle other errors
            console.error("Error accessing protected route:", error);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("accessToken");
        dispatch(clearToken());
        navigate('/');
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();

  }, [accessTokenExpiry])

  const handleLogout = async () => {
    try {
      const response = await api.post("/users/logout")
      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        dispatch(clearToken());
        navigate("/");
      }
    } catch (error) {
      dispatch(setAccessTokenExpiry());
      dispatch(setErrorModelOpen(true));
    }
  }


  const handleDelete = async (id) => {

    dispatch(setLoading(true));
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await api.delete(`/todos/${id}`,
        addAuthHeader(accessToken)
      );
      const updatedTodos = todos.filter(todo => todo._id !== id);
      dispatch(setTodo(updatedTodos));
    } catch (error) {
      dispatch(setAccessTokenExpiry());
      dispatch(setErrorModelOpen(true));
      console.log(error)
    } finally {
      dispatch(setLoading(false));
    }
  }


  return (
    <div>
      {isError && <ErrorComponent />}
      {isLoading && (
        <div className="loader-overlay w-full">
          <div className="loader"></div>
        </div>
      )}
      {token &&
        <div>
          <Navbar />
          <TodoComponent />
        </div>
      }
      {isConfirmOpen && <ConfirmationComp handleDelete={handleDelete} handleLogout={handleLogout}/>}
    </div>
  )

}

export default Main;