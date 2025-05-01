import "./App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import TodoComponent from "./components/Main.jsx";
import { Route, Routes } from "react-router-dom";

function App() {


  return (
   
    <div className="w-full h-screen "> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<TodoComponent />} />
      </Routes>
    </div>
  );
}

export default App;
