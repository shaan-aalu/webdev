import React, { useState, useEffect } from 'react';
import axios from 'axios';

const host = "http://localhost:8000";

const UpdateDept = () => {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [deptName, setDeptName] = useState('');

  // 1. Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${host}/getAlldept`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  // 2. Load on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // 3. Start editing
  const startEditing = (dept) => {
    setEditingId(dept._id);
    setDeptName(dept.name);
  };

  // 4. Submit update
  const handleUpdate = async () => {
    if (!editingId || !deptName) return;

    try {
      await axios.post(`${host}/updatedept/${editingId}`, { deptName });
      setEditingId(null);
      setDeptName('');
      fetchDepartments();
    } catch (err) {
      console.error("Error updating department", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Update Department</h1>

      {departments.length === 0 ? (
        <p className="text-gray-500">No departments found.</p>
      ) : (
        <ul className="space-y-4">
          {departments.map((dept) => (
            <li
              key={dept._id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              {editingId === dept._id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="Department Name"
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
                    <p className="font-medium">{dept.name}</p>
                  </div>
                  <button
                    onClick={() => startEditing(dept)}
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

export default UpdateDept;
