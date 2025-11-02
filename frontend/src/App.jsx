import { useState, useEffect } from "react";
import "./App.css";
import Add from "./AddTask";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Home() {
  const [task, setTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); //for showing popup
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  // fetching the task
  const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE}/all-task`);
        setTask(response.data.reqData || []);
      } catch (error) {
        console.log("Error getting the data", error);
      }
    };
  const handleView = (ele) => {
    setSelectedTask(ele); // store clicked task
  };

  const handleClose = () => {
    setSelectedTask(null); // close popup
  };

 const handleUpdate = async () => {

     try {
      console.log(selectedTask.id);
       const response = await axios.put(`${API_BASE}/update-task/${selectedTask.id}`);
       console.log(response);
       setSelectedTask(null);
       fetchTasks();// calling the fetchTasks function again to reder the update
        
     } catch (error) {
       console.log("Update error:", error);
     }
   };

  // deleting the task
  const handleDelete = async () => {

     try {
      console.log("Deleting the task");
      console.log(selectedTask.id);
       const response = await axios.delete(`${API_BASE}/del-task/${selectedTask.id}`);
       console.log("Deleted the task",response);
       setSelectedTask(null);
       fetchTasks();// calling the fetchTasks function again to render the update
        
     } catch (error) {
       console.log("Update error:", error);
     }
   };

  useEffect(() => { 
    fetchTasks();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-400 text-white py-10 px-6">
        <h1 className="text-4xl font-extrabold text-center mb-12">
          <span className="text-gray-200">TODO</span>{" "}
          <span className="text-blue-500">LIST</span>
          <div className="hidden sm:flex justify-center mt-10">
            <Link to="/add-task">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-medium shadow-md">
                Add Todo ✏️
              </button>
            </Link>
          </div>
        </h1>

        {/* Desktop Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 sm:px-0">
  {task.map((ele, index) => (
    <div
      key={index}
      className="bg-white text-gray-800 rounded-xl p-4 sm:p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full max-w-xs sm:max-w-sm mx-auto"
    >
      {/* Status Icon */}
      <div className="flex justify-start">
        {ele.status === "completed" ? (
          <span className="text-green-500 text-xl sm:text-2xl">
            <FontAwesomeIcon icon={faCircleCheck} />
          </span>
        ) : (
          <span className="text-black text-xl sm:text-2xl">
            <FontAwesomeIcon icon={faCircleCheck} />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center h-full">
        <h2 className="text-base sm:text-xl uppercase font-bold mt-2 mb-1 sm:mb-2">
          {ele.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 text-justify leading-relaxed px-1 sm:px-2">
          {ele.description}
        </p>
      </div>

      {/* View Button */}
      <button
        onClick={() => handleView(ele)}
        className="bg-blue-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition mt-2"
      >
        View
      </button>
    </div>
  ))}
</div>



        {/* ✅ Popup (appears when user clicks View) */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-gray-800 rounded-xl w-[90%] sm:w-[400px] p-6 shadow-2xl relative">
              
              {selectedTask.status === "completed" ? (
                  <span className="text-green-500 text-2xl">
                    FINISH<FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                ) : (
                  <span className="text-black text-2xl">
                   <FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                )}
              
              
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-red-500 text-xl"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold text-center mb-3 uppercase">
                {selectedTask.title}
              </h2>
              <p className="text-gray-600 text-justify">
                {selectedTask.description ||
                  "No description provided for this task."}
              </p>

              <div className="mt-6 flex flex-col justify-center items-center gap-3">
                <button onClick={handleUpdate}
                  className=" cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-auto"
                >
                  UPDATE
                </button>
                <button onClick={handleDelete}
                  className="cursor-pointer bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-auto"
                >
                  DELETE
                </button>
              </div>

            </div>
          </div>
        )}

        
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-task" element={<Add />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
