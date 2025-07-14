import React, { useState, useEffect } from 'react';
import axios from 'axios';

const host = "http://localhost:8000";

const CreateTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${host}/getAllteacher`);
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      if (!name) return alert("Fields required");
      await axios.post(`${host}/createTeacher`, { name });
      setName('');
      fetchTeachers();
    } catch (err) {
      alert(err.response.data);
    }
  };

  const handleDelete = async (teacherId) => {
    try {
      console.log(teacherId)
      await axios.put(`${host}/deleteTeacher/${teacherId}`);
      console.log("akash")
      fetchTeachers();
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Teacher</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Teacher Name"
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* <input
          type="text"
          placeholder="Subject"
          className="border p-2 rounded w-full"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        /> */}
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="bg-white shadow rounded p-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">All Teachers</h2>
        {paginatedTeachers.length === 0 ? (
          <p className="text-gray-500">No teachers available.</p>
        ) : (
          <ul className="space-y-2">
            {paginatedTeachers.map((teacher) => (
              <li
                key={teacher._id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-medium">{teacher.name}</p>
                  {/* <p className="text-gray-600 text-sm">{teacher.subject}</p> */}
                </div>
                <button
                  onClick={() => handleDelete(teacher._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default CreateTeacher;
