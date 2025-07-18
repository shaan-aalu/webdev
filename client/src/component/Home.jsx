import React, { useState } from "react";
import axios from "axios";
import AnimatedPlane from "./animatedplane";

const host = "http://localhost:8000";

const Home = () => {
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");

  const fetchStudentMarks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${host}/getStudentMarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMarks(res.data);
      setError("");
    } catch (err) {
      setError("Student not found or error fetching marks");
      setMarks([]);
    }
  };
 
  return (
 <div className="relative flex flex-col items-center gap-4 mt-10 overflow-hidden">
  <AnimatedPlane />

      <h2 className="text-xl font-bold mt-12">Get Student Marks</h2>

      <button
        onClick={fetchStudentMarks}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Get Marks
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {marks.length > 0 && (
        <div className="mt-6 w-[80%]">
          <h3 className="text-lg font-semibold mb-2">Marks:</h3>
          <table className="w-full table-auto border border-collapse border-gray-400">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr key={index}>
                  <td className="border px-4 py-1">{mark.subjectname}</td>
                  <td className="border px-4 py-1">{mark.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
