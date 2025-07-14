import React, { useEffect, useState } from 'react';
import axios from 'axios';

const host = "http://localhost:8000";

const DeleteTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${host}/getAllteacher`);
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers", error);
    }
  };

  const handleDelete = async (teacherID) => {
    try {
      await axios.put(`${host}/deleteTeacher/${teacherID}`);
      setTeachers(prev => prev.filter(t => t._id !== teacherID));
    } catch (error) {
      console.error("Error deleting teacher", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delete Teacher</h1>
      {teachers.length === 0 ? (
        <p className="text-gray-600">No teachers found.</p>
      ) : (
        <ul className="space-y-4">
          {teachers.map((teacher) => (
            <li
              key={teacher._id}
              className="flex justify-between items-center border p-4 rounded shadow"
            >
              <div>
                <p className="font-semibold text-lg">{teacher.name}</p>
                <p className="text-sm text-gray-500">
                  {teacher.subject.length} subject(s)
                </p>
              </div>
              <button
                onClick={() => handleDelete(teacher._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteTeacher;
