import React, { useEffect, useState } from 'react';
import axios from 'axios';

const host = "http://localhost:8000";

const TeacherSubjectManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [tempSubject, setTempSubject] = useState({ name: '', semester: '' }); // ✅ NEW

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${host}/getAllteacher`);
      setTeachers(res.data);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  const refreshSelectedTeacher = async () => {
    const res = await axios.get(`${host}/getAllteacher`);
    const updated = res.data.find(t => t._id === selectedTeacher._id);
    setSelectedTeacher(updated);
  };

  const handleAddSubjects = async () => {
    if (!selectedTeacher || selectedToAdd.length === 0) return;
    try {
      await axios.post(`${host}/addSubjectsToTeacher`, {
        teacherId: selectedTeacher._id,
        subjects: selectedToAdd
      });
      setSelectedToAdd([]);
      await refreshSelectedTeacher();
    } catch (error) {
      console.error("Error adding subjects", error);
    }
  };

  const handleRemoveSubjects = async () => {
    if (!selectedTeacher || selectedToRemove.length === 0) return;
    try {
      await axios.put(`${host}/deleteSubjectFromTeacher`, {
        teacherId: selectedTeacher._id,
        subjectIds: selectedToRemove
      });
      setSelectedToRemove([]);
      await refreshSelectedTeacher();
    } catch (error) {
      console.error("Error removing subjects", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const toggleSelectToRemove = (id) => {
    setSelectedToRemove(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Subjects for Teachers</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Teacher</label>
        <select
          onChange={(e) => {
            const selected = teachers.find(t => t._id === e.target.value);
            setSelectedTeacher(selected);
            setSelectedToAdd([]);
            setSelectedToRemove([]);
          }}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>Select a teacher</option>
          {teachers.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>

      {selectedTeacher && (
        <div className="space-y-6">
          {/* -------- ADD SUBJECTS -------- */}
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-3">Add Subjects</h2>

            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Subject Name"
                value={tempSubject.name}
                onChange={(e) => setTempSubject(prev => ({ ...prev, name: e.target.value }))}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="number"
                placeholder="Semester"
                value={tempSubject.semester}
                onChange={(e) => setTempSubject(prev => ({ ...prev, semester: Number(e.target.value) }))}
                className="border p-2 rounded w-1/2"
              />
            </div>

            <button
              onClick={() => {
                if (tempSubject.name && tempSubject.semester >= 0 && tempSubject.semester <= 11) {
                  setSelectedToAdd(prev => [...prev, tempSubject]);
                  setTempSubject({ name: '', semester: '' });
                } else {
                  alert("Please enter both name and valid semester (0-11)");
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              ➕ Add Subject to List
            </button>

            {selectedToAdd.length > 0 && (
              <>
                <h3 className="font-medium">Subjects to be added:</h3>
                <ul className="list-disc ml-5 mb-4">
                  {selectedToAdd.map((sub, idx) => (
                    <li key={idx}>{sub.name} (Sem: {sub.semester})</li>
                  ))}
                </ul>

                <button
                  onClick={handleAddSubjects}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Selected Subjects
                </button>
              </>
            )}
          </div>

          {/* -------- REMOVE SUBJECTS -------- */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Assigned Subjects</h2>
            {selectedTeacher.subject.length === 0 ? (
              <p className="text-gray-600">No subjects assigned.</p>
            ) : (
              <ul className="space-y-2">
                {selectedTeacher.subject.map(sub => (
                  <li key={sub._id} className="flex justify-between items-center bg-white p-2 rounded shadow">
                    <span>{sub.subjectName} (Sem: {sub.semester})</span>
                    <input
                      type="checkbox"
                      onChange={() => toggleSelectToRemove(sub._id)}
                      checked={selectedToRemove.includes(sub._id)}
                    />
                  </li>
                ))}
              </ul>
            )}
            {selectedToRemove.length > 0 && (
              <button
                onClick={handleRemoveSubjects}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Remove Selected Subjects
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectManager;

