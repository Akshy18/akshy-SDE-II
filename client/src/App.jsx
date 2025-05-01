import "./App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import TodoComponent from "./components/Main.jsx";
import { Route, Routes } from "react-router-dom";

// Main application component that defines routing structure
function App() {
 return (
   <div className="w-full h-screen"> 
     <Routes>
       {/* Public routes for authentication */}
       <Route path="/" element={<Login />} />
       <Route path="/register" element={<Register />} />
       {/* Protected route for authenticated users */}
       <Route path="/main" element={<TodoComponent />} />
     </Routes>
   </div>
 );
}

export default App;
