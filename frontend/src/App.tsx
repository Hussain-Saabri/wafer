import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";


import Add from "./pages/AddTask";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyOtp from "./pages/Verify-otp";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* 🔔 Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 500,
          style: {
            backgroundColor: "#ADD8E6",
            color: "#fff",
          },
        }}
      />

      {/* ✅ App Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-task" element={<Add />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
