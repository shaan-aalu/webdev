import React, { useEffect, useState } from 'react';
import axios from 'axios';

const host = "http://localhost:8000";

const AddTeacher = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [addedTeachers, setAddedTeachers] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedDept && allTeachers.length > 0) {
      const addedIds = selectedDept.Teachers?.map(t => t.toString()) || [];
      const added = allTeachers.filter(t => addedIds.includes(t._id));
      const available = allTeachers.filter(t => !addedIds.includes(t._id));
      setAddedTeachers(added);
      setAvailableTeachers(available);
    } else {
      setAddedTeachers([]);
      setAvailableTeachers([]);
    }
  }, [selectedDept, allTeachers]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${host}/getAlldept`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error loading departments", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${host}/getAllteacher`);
      setAllTeachers(res.data);
    } catch (err) {
      console.error("Error loading teachers", err);
    }
  };

  const refreshDept = async () => {
    const refreshed = await axios.get(`${host}/getAlldept`);
    const updated = refreshed.data.find(d => d._id === selectedDept._id);
    setSelectedDept(updated);
  };

  const handleAddTeacher = async () => {
    if (!selectedDept || selectedTeachers.length === 0) return;

    try {
      await axios.post(`${host}/addteacher/${selectedDept._id}`, {
        Teachers: selectedTeachers,
      });
      setSelectedTeachers([]);
      await refreshDept();
    } catch (err) {
      console.error("Error adding teacher", err);
    }
  };

  const handleBulkRemove = async () => {
    if (!selectedDept || selectedToRemove.length === 0) return;

    try {
      await axios.put(`${host}/deleteTeacherFromDept/${selectedDept._id}`, {
        Teachers: selectedToRemove,
      });
      setSelectedToRemove([]);
      await refreshDept();
    } catch (err) {
      console.error("Error removing teachers", err);
    }
  };

  const toggleSelect = id => {
    setSelectedTeachers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleRemoveSelect = id => {
    setSelectedToRemove(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const renderSubjects = subjectArr => {
    if (!Array.isArray(subjectArr) || subjectArr.length === 0) return "No subjects assigned";
    return subjectArr.map((s, i) => (
      <span key={i}>
        {s.subjectName || s.name} (Sem {s.semester})
        {i < subjectArr.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Teacher to Department</h1>

      {!selectedDept ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Department</h2>
          <div className="grid gap-3">
            {departments.map(dept => (
              <button
                key={dept._id}
                onClick={() => {
                  setSelectedDept(dept);
                  setSelectedTeachers([]);
                  setSelectedToRemove([]);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Selected Department: {selectedDept.name}</h2>
            <button
              onClick={() => {
                setSelectedDept(null);
                setSelectedTeachers([]);
                setSelectedToRemove([]);
              }}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Change
            </button>
          </div>

          {/* ✅ Available Teachers Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Available Teachers</h3>
            {availableTeachers.length === 0 ? (
              <p className="text-gray-600">All teachers already added.</p>
            ) : (
              <ul className="grid gap-3">
                {availableTeachers.map(teacher => (
                  <li
                    key={teacher._id}
                    className={`flex justify-between items-center border p-3 rounded ${
                      selectedTeachers.includes(teacher._id) ? 'bg-green-100' : ''
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{teacher.name}</p>
                      <p className="text-sm text-gray-600">
                        {renderSubjects(teacher.subject)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSelect(teacher._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      {selectedTeachers.includes(teacher._id) ? 'Remove' : 'Select'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedTeachers.length > 0 && (
              <button
                onClick={handleAddTeacher}
                className="mt-3 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Add Selected Teachers
              </button>
            )}
          </div>

          {/* 🧾 Added Teachers Section */}
          <div>
            <h3 className="text-lg font-medium mt-6 mb-2">Added Teachers</h3>
            {addedTeachers.length === 0 ? (
              <p className="text-gray-600">No teachers added yet.</p>
            ) : (
              <ul className="grid gap-3">
                {addedTeachers.map(teacher => (
                  <li
                    key={teacher._id}
                    className={`flex justify-between items-center border p-3 rounded ${
                      selectedToRemove.includes(teacher._id) ? 'bg-red-100' : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{teacher.name}</p>
                      <p className="text-sm text-gray-600">
                        {renderSubjects(teacher.subject)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleRemoveSelect(teacher._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      {selectedToRemove.includes(teacher._id) ? 'Cancel' : 'Select to Remove'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedToRemove.length > 0 && (
              <button
                onClick={handleBulkRemove}
                className="mt-3 bg-red-700 text-white px-5 py-2 rounded hover:bg-red-800"
              >
                Remove Selected Teachers
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTeacher;
