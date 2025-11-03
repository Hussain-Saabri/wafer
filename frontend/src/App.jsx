import "./App.css";
import Add from "./pages/AddTask"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {BrowserRouter,Routes,Route,} from "react-router-dom";
import VerifyOtp from "./pages/Verify-otp";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
    <Toaster
        position="top-right"
        duration="500"
        toastOptions={{
          style: {
            backgroundColor: "#ADD8E6",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-task" element={<Add />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
