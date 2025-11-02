import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[handlesubmit] function");
    if (!title.trim()) {
        console.log("Title is missing");
      alert("Please enter a title for your task!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/add", {
        title,
        description,
      });
      console.log("Task added successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-10">
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
