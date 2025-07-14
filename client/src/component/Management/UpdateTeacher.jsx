import React, { useState, useEffect } from 'react';
import axios from 'axios';

const host = "http://localhost:8000";

const UpdateTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${host}/getAllteacher`);
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Start editing
  const startEditing = (teacher) => {
    setEditingId(teacher._id);
    setNewName(teacher.name);
  };

  // Submit name update
  const handleUpdate = async () => {
    if (!editingId || !newName.trim()) return alert("Name is required");
    try {
      await axios.post(`${host}/updateTeacher/${editingId}`, {
        oldName: teachers.find(t => t._id === editingId)?.name,
        newName,
      });
      alert("Teacher name updated successfully!");
      setEditingId(null);
      setNewName('');
      fetchTeachers();
    } catch (err) {
      alert("Error updating teacher");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Update Teacher</h1>

      {teachers.length === 0 ? (
        <p className="text-gray-500">No teachers found.</p>
      ) : (
        <ul className="space-y-4">
          {teachers.map((teacher) => (
            <li
              key={teacher._id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              {editingId === teacher._id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New Name"
                    className="border p-2 rounded w-full"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-gray-600 text-sm">
                      {teacher.subject.length} subject(s)
                    </p>
                  </div>
                  <button
                    onClick={() => startEditing(teacher)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpdateTeacher;
