import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import PasswordInput from "../components/PasswordInput";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState(""); // Forgot password email
  const [showForgot, setShowForgot] = useState(false); // toggle forgot form
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
 
  const handleLogin = async (e) => {
   
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setIsLoading(false);
      return setError("Email is required");
    }
    if (!password) {
      setIsLoading(false);
      return setError("Password is required");
    }

    try {
      const response = await axiosInstance.post("/login", { email, password });
      console.log("Login succesfull",response);
      if (response.data && response.data.accessToken) {
        console.log("token created");
        localStorage.setItem("token", response.data.accessToken);
        
        localStorage.setItem("user_id", response.data.user.user_id);
        toast.success("Login Successful!", {
  style: {
    background: "linear-gradient(145deg, #60a5fa, #2563eb)", // blue gradient
    color: "#e0f2fe", // light blue text
    fontWeight: "700",
    borderRadius: "16px",
    padding: window.innerWidth < 500 ? "8px 16px" : "10px 24px", // smaller padding on mobile
    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.5), 0 0 10px rgba(96, 165, 250, 0.3)",
    fontSize: window.innerWidth < 500 ? "14px" : "18px", // smaller font on mobile
    letterSpacing: "0.5px",
    textTransform: "capitalize",
    fontFamily: "'Poppins', sans-serif",
    backdropFilter: "blur(8px)",
    width: window.innerWidth < 500 ? "85%" : "auto", // responsive width
    alignSelf: "center",
  },
  iconTheme: {
    primary: "#bfdbfe",
    secondary: "#1e3a8a",
  },
  duration: 4000,
});



        setTimeout(() => {
          setIsLoading(false);
          navigate("/");
        }, 800);
      } else {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Error", err);
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };
//forgot-password function
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error("Email is required");
    setIsLoading(true);
    try {
     const response= await axiosInstance.post("/forgot-password", { email: forgotEmail });
     console.log("Passowrd reset ",response);
     if(response.data.message==='OTP email sent successfully for forgot password')
     {
      console.log("navigating to the otp verifying page")
       navigate("/verify-otp",{state:{email: forgotEmail,message:'resetpass'}});
       toast.success("Password reset link sent to your email!");
      setShowForgot(false);
      setForgotEmail("");
     }
     
    } catch (err) {
      toast.error("Error sending reset link. Try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 sm:p-10 border border-gray-200 transform transition-all hover:scale-[1.01]">
        {/* Logo & Heading */}
        <div className="text-center mb-6">
        {!showForgot ? (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Welcome to{" "}
              <span className="text-transparent block bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-500 to-lime-400 drop-shadow-md">
                TODO
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
          </>
        ) : (
          <>
          
          <h1 className="text-3xl block sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-500 to-lime-400 drop-shadow-md">
            TODO
          </h1>
          <p className="mt-1 font-black">Enter Your Email</p>
          </>
        )}
      </div>

        {/* Login Form */}
        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm transition"
            />

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-semibold rounded-xl shadow-md transition-all duration-200 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={20} color="#ffffff" loading={true} />
                  <span className="ml-2">Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>

            {error && <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>}

            {/* <p
              onClick={() => setShowForgot(true)}
              className="text-blue-600 hover:underline text-center cursor-pointer mt-2 text-sm"
            >
              Forgot Password?
            </p> */}
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={forgotEmail}
              autoComplete="email"
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-semibold rounded-xl shadow-md transition-all duration-200 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={20} color="#ffffff" loading={true} />
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
            <p
              onClick={() => setShowForgot(false)}
              className="text-gray-600 hover:underline text-center cursor-pointer mt-2 text-sm"
            >
              Back to Login
            </p>
          </form>
        )}

        {/* Sign up link */}
        {!showForgot && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signUp" className="text-blue-600 hover:underline font-medium transition-colors">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;