import React, { useEffect, useState } from 'react';
import axios from 'axios';

const host = "http://localhost:8000"; // Update if needed

const ManageSchoolDepartments = () => {
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [addDepartments, setAddedDepartments] = useState([]);
const [availableDepartments, setAvailableDepartments] = useState([]);


  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${host}/getAllSchool`);
      setSchools(res.data);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${host}/getAlldept`);
      setDepartments(res.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  const refreshSelectedSchool = async () => {
    const res = await axios.get(`${host}/getAllSchool`);
    const updated = res.data.find(s => s._id === selectedSchool._id);
    setSelectedSchool(updated);
  };

  const handleAddDepartments = async () => {
    if (!selectedSchool || selectedToAdd.length === 0) return;
    try {
      await axios.post(`${host}/addDept/${selectedSchool._id}`, {
        department: selectedToAdd
      });
      setSelectedToAdd([]);
      await refreshSelectedSchool();
      console.log(first)
    } catch (error) {
      console.error("Error adding departments", error);
    }
  };

  const handleRemoveDepartments = async () => {
    if (!selectedSchool || selectedToRemove.length === 0) return;
    try {
      await axios.put(`${host}/deleteDept/${selectedSchool._id}`, {
        department: selectedToRemove
      });
      setSelectedToRemove([]);
      await refreshSelectedSchool();
    } catch (error) {
      console.error("Error removing departments", error);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchDepartments();
  }, []);

 useEffect(() => {
  if (selectedSchool && departments.length > 0) {
    const added = departments.filter(dep =>
      selectedSchool?.department?.includes(dep._id)
    );
    const available = departments.filter(dep =>
      !selectedSchool?.department?.includes(dep._id)
    );
    setAddedDepartments(added);
    setAvailableDepartments(available);
  } else {
    setAddedDepartments([]);
    setAvailableDepartments([]);
  }
}, [selectedSchool?.department, departments]);


  const toggleSelectToAdd = (id) => {
    setSelectedToAdd(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleSelectToRemove = (id) => {
    setSelectedToRemove(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Departments in School</h1>

      {!selectedSchool ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a School</h2>
          <div className="grid gap-3">
            {schools.map(school => (
              <button
                key={school._id}
                onClick={() => setSelectedSchool(school)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {school.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Selected School: {selectedSchool.name}
            </h2>
            <button
              onClick={() => {
                setSelectedSchool(null);
                setSelectedToAdd([]);
                setSelectedToRemove([]);
              }}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Change
            </button>
          </div>

          {/* ✅ Available Departments Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Available Departments</h3>
            {availableDepartments.length === 0 ? (
              <p className="text-gray-600">All departments already added.</p>
            ) : (
              <ul className="grid gap-3">
                {availableDepartments.map(dep => (
                  <li
                    key={dep._id}
                    className={`flex justify-between items-center border p-3 rounded ${
                      selectedToAdd.includes(dep._id) ? 'bg-green-100' : ''
                    }`}
                  >
                    <span>{dep.name}</span>
                    <button
                      onClick={() => toggleSelectToAdd(dep._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      {selectedToAdd.includes(dep._id) ? 'Cancel' : 'Select'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedToAdd.length > 0 && (
              <button
                onClick={handleAddDepartments}
                className="mt-3 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Add Selected Departments
              </button>
            )}
          </div>

          {/* 🧾 Already Added Departments Section */}
          <div>
            <h3 className="text-lg font-medium mt-6 mb-2">Added Departments</h3>
            {addDepartments.length === 0 ? (
              <p className="text-gray-600">No departments added yet.</p>
            ) : (
              <ul className="grid gap-3">
                {addDepartments.map(dep => (
                  <li
                    key={dep._id}
                    className={`flex justify-between items-center border p-3 rounded ${
                      selectedToRemove.includes(dep._id) ? 'bg-red-100' : ''
                    }`}
                  >
                    <span>{dep.name}</span>
                    <button
                      onClick={() => toggleSelectToRemove(dep._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      {selectedToRemove.includes(dep._id) ? 'Cancel' : 'Remove'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedToRemove.length > 0 && (
              <button
                onClick={handleRemoveDepartments}
                className="mt-3 bg-red-700 text-white px-5 py-2 rounded hover:bg-red-800"
              >
                Remove Selected Departments
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchoolDepartments;
