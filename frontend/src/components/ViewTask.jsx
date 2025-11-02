import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewTask() {
  const { id } = useParams(); // 👈 To get the task ID from the URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/task/${id}`);
        setTask(res.data);
      } catch (error) {
        console.log("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <div className="text-center text-white">Loading...</div>;

  // ✅ Update task status
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/update-task/${id}`, {
        title: task.title,
        description: task.description,
        status: "completed",
      });
      alert("Task updated!");
      navigate("/");
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  // ❌ Delete task
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/delete-task/${id}`);
      alert("Task deleted!");
      navigate("/");
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#2f2f2f] flex flex-col items-center justify-center text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        TODO <span className="text-blue-400">LIST</span>
      </h1>

      <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <span className="uppercase font-semibold">Finish</span>
          <button
            onClick={handleUpdate}
            className="text-3xl text-green-500 border-2 border-green-500 rounded-full px-4 py-2"
          >
            ✔
          </button>
        </div>

        <div className="mb-4">
          <label className="block uppercase text-sm font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full text-black px-4 py-2 rounded-md outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block uppercase text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            rows="5"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full text-black px-4 py-2 rounded-md outline-none"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg mb-3"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ViewTask;
