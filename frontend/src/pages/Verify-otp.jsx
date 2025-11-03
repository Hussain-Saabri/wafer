import { useLocation } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passReset=location.state?.message;

  const toastStyleMobile = {
    style: {
      maxWidth: "90vw",
      margin: "0 auto",
      fontSize: "14px",
      fontWeight: "600",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      letterSpacing: "0.4px",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const response = await axiosInstance.post("/verify-otp", {
        email,
        otp,
      });

      if (response.data.message === "otp is required") {
        toast.error("Please enter the 6-digit OTP to proceed.", {
          ...toastStyleMobile,
          style: { ...toastStyleMobile.style, background: "#e53e3e", color: "#fff" },
        });
      } else if (response.data.message === "OTP has expired") {
        toast.error("OTP has expired! Please resend OTP.", {
          ...toastStyleMobile,
          style: { ...toastStyleMobile.style, background: "#dc2626", color: "#fff" },
        });
      } else if (response.data.message === "otp verified") {
        console.log("otp verified");
        console.log("navigating");
        navigate("/");
        if(passReset)
        {
          navigate("/reset-password", { state: { email: email } });

          toast.success("OTP verified successfully!", {
          ...toastStyleMobile,
          style: { ...toastStyleMobile.style, background: "#2563eb", color: "#fff" },
        });
        }else
        {
          toast.success("OTP verified successfully!", {
          ...toastStyleMobile,
          style: { ...toastStyleMobile.style, background: "#2563eb", color: "#fff" },
        });
        

        }
        
      } else if (response.data.message === "Otp doesnot match") {
        toast.error("Incorrect OTP. Please try again.", {
          ...toastStyleMobile,
          style: { ...toastStyleMobile.style, background: "rgba(37, 99, 235, 0.8)", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error. Try again.", toastStyleMobile);
      setError(error.response?.data?.message || "An unexpected error occurred.");
    } 
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    
    setOtp("");
    try {
      const response = await axiosInstance.post("/resend-otp", { email });
      if (response.data.error === false) {
        toast.success("OTP sent again!", {
          ...toastStyleMobile,
          style: { ...toastStyleMobile.style, background: "#22c55e", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error. Try again.", toastStyleMobile);
      setError(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      
    }
  };

  return (
    <>
   
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md animate-fadeIn">
         <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-500 to-lime-400 drop-shadow-md">
              TODO
            </span>
          </h1>
         
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 text-center">
          Verify OTP
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-gray-800 break-words">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
         <div className="flex flex-wrap justify-between gap-1 sm:gap-2">
  {[...Array(6)].map((_, i) => (
    <input
      key={i}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={otp[i] || ""}
      maxLength="1"
      className="w-[13%] min-w-[40px] sm:w-12 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      onChange={(e) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        setOtp((prev) => {
          const arr = prev.split("");
          arr[i] = val; 
          return arr.join("");
        });
        if (val && i < 5) {
          // Move to next box automatically
          e.target.nextSibling?.focus();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) {
          
          e.target.previousSibling?.focus();
        }
      }}
    />
  ))}
</div>



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? <Loader /> : "Verify OTP"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-5">
          Didn’t get the code?{" "}
          {loading ? (
            <Loader />
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default VerifyOtp;
