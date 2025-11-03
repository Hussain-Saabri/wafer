import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loader";
import toast from "react-hot-toast";
function AddTask() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const[error,setError] =useState([{}]);
  const[loading,setLoading] =useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // Handle form submit
  const handleSubmit = async (e) => {
   
    const user_id = localStorage.getItem("user_id");
console.log(user_id);

    const newErrors = {};
    e.preventDefault();
    console.log("[handlesubmit] function");
    if (!title.trim()) {
      console.log("Title is missing");
      newErrors.title = "Title is Missing!";
      setError(newErrors);
      
    }
    if (!description.trim()) {
      console.log("Title is missing");
      newErrors.description = "Description is missing!";
      setError(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/add`, {
        title,
        description,
        user_id
      });
     
      toast.success("Note Added Successfully!", {
  style: {
    background: "linear-gradient(145deg, #34d399, #059669)",
    color: "#e6fffa",
    fontWeight: "700",
    borderRadius: "16px",
    padding: window.innerWidth < 480 ? "8px 16px" : "10px 24px",
    boxShadow:
      "0 6px 20px rgba(5, 150, 105, 0.5), 0 0 10px rgba(56, 189, 248, 0.3)",
    fontSize: window.innerWidth < 480 ? "15px" : "18px",
    letterSpacing: "0.6px",
    textTransform: "capitalize",
    fontFamily: "'Poppins', sans-serif",
    backdropFilter: "blur(8px)",
    maxWidth: window.innerWidth < 480 ? "90%" : "400px",
    margin: "0 auto",
  },
  iconTheme: {
    primary: "#a7f3d0",
    secondary: "#064e3b",
  },
  duration: 1500,
  position: "top-center",
});


      navigate("/");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Add <span className="text-gray-800">New Task</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error.title &&  (
            <p className="text-red-400 font-bold">{error.title}</p>
          )}
          </div>
            
          {/* Description Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error.description &&  (
            <p className="text-red-400 font-bold">{error.description}</p>
          )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Task
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer text-blue-500 underline hover:text-blue-700 text-sm mt-2"
          >
            ← Back to To-Do List
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
