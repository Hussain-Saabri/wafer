import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark, faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Home() {
  const [token, setToken] = useState(false);
  const [task, setTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks for logged-in user...");
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        console.error("No user_id found in localStorage. Please log in again.");
        return;
      }

      const response = await axios.get(`${API_BASE}/all-task/${user_id}`);
      console.log("Fetched tasks:", response.data);
      setTask(response.data.tasks || []);
    } catch (error) {
      console.error("Error getting the data:", error);
    }
  };

  // View popup
  const handleView = (ele) => {
    setSelectedTask(ele);
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  // Update task status
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API_BASE}/update-task/${selectedTask.id}`);
      toast.success("Task Updated Successfully!", {
  style: {
    // 🌿 Fresh green gradient with soft glow
    background:
      window.innerWidth < 500
        ? "linear-gradient(160deg, #22c55e, #16a34a)"
        : "linear-gradient(145deg, #16a34a, #15803d)",

    color: "#f0fff4", // soft white-green text
    fontWeight: "600",
    borderRadius: "16px",
    padding: window.innerWidth < 500 ? "10px 16px" : "12px 28px",
    fontSize: window.innerWidth < 500 ? "14px" : "17px",
    letterSpacing: "0.5px",
    fontFamily: "'Poppins', sans-serif",
    textTransform: "capitalize",

    // 🧊 Glass effect and soft depth
    backdropFilter: "blur(8px) saturate(180%)",
    boxShadow:
      "0 6px 20px rgba(34, 197, 94, 0.45), 0 0 12px rgba(74, 222, 128, 0.35)",
    border: "1px solid rgba(255, 255, 255, 0.15)",

    // ⚙️ Layout and responsiveness
    width: window.innerWidth < 500 ? "85%" : "auto",
    maxWidth: "90vw",
    margin: "0 auto",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

    transition: "all 0.3s ease-in-out",
  },
  iconTheme: {
    primary: "#bbf7d0", // pastel green icon
    secondary: "#14532d", // dark green accent
  },
  duration: 2000,
});


      setLoading(true);
      setTimeout(() => {
        setSelectedTask(null);
        fetchTasks();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  // Delete a task
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/del-task/${selectedTask.id}`);
      toast.success("Task Deleted Successfully!", {
        style: {
          background: "linear-gradient(145deg, #ef4444, #b91c1c)",
          color: "#ffe4e6",
          fontWeight: "700",
          borderRadius: "16px",
          padding: "10px 24px",
          boxShadow:
            "0 6px 20px rgba(239, 68, 68, 0.5), 0 0 10px rgba(255, 182, 193, 0.3)",
          fontSize: "18px",
          letterSpacing: "0.7px",
          textTransform: "capitalize",
          fontFamily: "'Poppins', sans-serif",
          backdropFilter: "blur(8px)",
        },
        duration: 4000,
      });

      setLoading(true);
      setTimeout(() => {
        setSelectedTask(null);
        fetchTasks();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // useEffect for loading and fetching
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setToken(token);
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    fetchTasks();
  }, []);

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    localStorage.removeItem("token");
  toast("Logout Successfully!", {
  icon: "👋",
  position: window.innerWidth < 500 ? "top-center" : "top-right", // ✅ mobile → top-center, desktop → top-right
  style: {
    // 🌇 Warm gradient with subtle glow
    background:
      window.innerWidth < 500
        ? "linear-gradient(155deg, rgba(249,115,22,0.95), rgba(220,38,38,0.9))"
        : "linear-gradient(135deg, rgba(234,88,12,0.9), rgba(185,28,28,0.85))",

    color: "#fff7ed", // soft white-orange text
    fontWeight: "600",
    borderRadius: "16px",
    padding: window.innerWidth < 500 ? "10px 18px" : "14px 26px",
    fontSize: window.innerWidth < 500 ? "14px" : "17px",
    letterSpacing: "0.4px",
    fontFamily: "'Poppins', sans-serif",
    textTransform: "capitalize",

    // 🧊 Glassy blur + depth
    backdropFilter: "blur(10px) saturate(180%)",
    boxShadow:
      "0 6px 24px rgba(234, 88, 12, 0.4), 0 0 12px rgba(249, 115, 22, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.15)",

    // 📱 Responsive width + alignment
    width: window.innerWidth < 500 ? "90%" : "auto",
    maxWidth: "92vw",
    margin: "0 auto",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

    // ✨ Smooth slide-in animation
    transform: "translateY(-10px)",
    animation: "toastSlideIn 0.4s ease-out",
    transition: "all 0.3s ease-in-out",
  },
  iconTheme: {
    primary: "#fed7aa", 
    secondary: "#7f1d1d", 
  },
  duration: 2500,
});
    setToken(null);
    navigate("/login");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* 🖥️ Desktop View */}
      <div className="hidden md:block">
        <div className="min-h-screen bg-black bg-opacity-50 text-white py-10 px-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-extrabold text-center">
              <span className="text-gray-200">TODO</span>{" "}
              <span className="text-blue-500">LIST</span>
            </h1>

            {/* Login / Logout */}
            <button
              className="bg-amber-500 px-5 py-3 rounded-md font-semibold text-white hover:bg-amber-600 transition"
              onClick={token ? handleLogout : handleLogin}
            >
              {token ? "Logout" : "Login"}
            </button>
          </div>

          {/* Add Task */}
          <div className="hidden sm:flex justify-center mb-10">
            <Link to="/add-task">
              <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm font-medium shadow-md cursor-pointer">
                Add Todo <FontAwesomeIcon icon={faPen} />
              </button>
            </Link>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 sm:px-0">
            {task.map((ele, index) => (
              <div
                key={index}
                className="bg-white text-gray-800 rounded-xl p-4 sm:p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full max-w-xs sm:max-w-sm mx-auto"
              >
                <div className="flex justify-start">
                  <span
                    className={`text-xl sm:text-2xl ${
                      ele.status === "completed"
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                </div>

                <div className="flex flex-col items-center text-center h-full">
                  <h2 className="text-base sm:text-xl uppercase font-bold mt-2 mb-1 sm:mb-2">
                    {ele.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 text-justify leading-relaxed px-1 sm:px-2">
                    {ele.description}
                  </p>
                </div>

                <button
                  onClick={() => handleView(ele)}
                  className="bg-blue-500 text-white cursor-pointer text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition mt-2"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📱 Mobile View */}
      <div className="block md:hidden">
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1f1f1f] px-4 py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
            <span className="text-gray-100">TODO</span>{" "}
            <span className="text-blue-500">LIST</span>
          </h1>

          {/* ✅ Login / Logout */}
          <button
            onClick={token ? handleLogout : handleLogin}
            className="bg-amber-500 text-white font-semibold px-6 py-2 rounded-lg mb-6 hover:bg-amber-600 transition"
          >
            {token ? "Logout" : "Login"}
          </button>

          {/* Task Cards */}
          <div className="w-full max-w-md flex flex-col gap-4">
            {(showAll ? task : task.slice(0, 4)).map((ele, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-full px-5 py-4 shadow-md hover:shadow-lg transition-all relative"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl ${
                      ele.status === "completed"
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold uppercase text-gray-800">
                      {ele.title && ele.title.length > 15
                        ? ele.title.slice(0, 15) + "..."
                        : ele.title}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {ele.description.length > 10
                        ? ele.description.slice(0, 20) + "..."
                        : ele.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleView(ele)}
                  className="absolute top-5 right-3 bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
                >
                  VIEW
                </button>
              </div>
            ))}
          </div>

          {/* View All / Add Task */}
          <div className="flex flex-col items-center gap-4 mt-10">
            {!showAll && task.length > 4 && (
              <button
                onClick={() => setShowAll(true)}
                className="text-gray-200 underline hover:text-white"
              >
                View All
              </button>
            )}
            {showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="text-gray-200 underline hover:text-white"
              >
                Show Less
              </button>
            )}
            <Link to="/add-task">
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-medium">
                Add Todo <FontAwesomeIcon icon={faPen} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 🪟 Popup */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="relative bg-white text-gray-800 rounded-xl w-full max-w-md max-h-[90vh] shadow-2xl overflow-hidden">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-50 cursor-pointer text-red-500 text-xl hover:text-red-700 transition"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="overflow-y-auto max-h-[80vh] p-6">
              {selectedTask.status === "completed" ? (
                <span className="text-green-500 text-2xl flex items-center gap-2">
                  FINISH <FontAwesomeIcon icon={faCircleCheck} />
                </span>
              ) : (
                <span className="text-black text-2xl">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </span>
              )}

              <h2 className="text-2xl font-bold text-center mb-3 uppercase">
                {selectedTask.title}
              </h2>
              <p className="text-gray-600 text-justify mb-6">
                {selectedTask.description ||
                  "No description provided for this task."}
              </p>

              <div className="flex flex-col justify-center items-center gap-3">
                <button
                  onClick={handleUpdate}
                  className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-auto"
                >
                  UPDATE
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-auto"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
