import React, { useEffect, useState } from "react";
import axios from "axios";

const host = "http://localhost:8000";

const StudentManager = () => {
  const [view, setView] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "",
    school: "",
    semester: ""
  });

  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Fetch all schools and students on initial load
  useEffect(() => {
    axios.get(`${host}/getAllSchool`).then(res => setSchools(res.data));
    axios.get(`${host}/getAllStudents`).then(res => setStudents(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: "", rollNo: "", department: "", school: "", semester: "" });
    setSelectedStudentId("");
    setDepartments([]);
  };

  // When a school is selected, get its departments directly
  const handleSchoolChange = (schoolId) => {
    const selectedSchool = schools.find(s => s._id === schoolId);
    setDepartments(selectedSchool?.department || []);
    setFormData(prev => ({ ...prev, school: schoolId, department: "" }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${host}/createStudent`, formData);
      alert("Student created!");
      resetForm();
      const res = await axios.get(`${host}/getAllStudents`);
      setStudents(res.data);
    } catch (err) {
      alert(err.response?.data || "Error creating student");
    }
  };

  const handleSelectUpdate = (id) => {
    const student = students.find(s => s._id === id);
    if (student) {
      const selectedSchool = schools.find(s => s._id === student.school);
      setDepartments(selectedSchool?.department || []);

      setSelectedStudentId(id);
      setFormData({
        name: student.name,
        rollNo: student.rollNo,
        department: student.department,
        school: student.school,
        semester: student.semester
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${host}/updateStudent/${selectedStudentId}`, formData);
      alert("Student updated!");
      resetForm();
      const res = await axios.get(`${host}/getAllStudents`);
      setStudents(res.data);
    } catch (err) {
      alert(err.response?.data || "Error updating student");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${host}/deleteStudent/${selectedStudentId}`);
      alert("Student deleted!");
      resetForm();
      const res = await axios.get(`${host}/getAllStudents`);
      setStudents(res.data);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setView("create")} className={`px-4 py-2 ${view === "create" ? "bg-blue-700 text-white" : "bg-gray-200"}`}>Create</button>
        <button onClick={() => setView("update")} className={`px-4 py-2 ${view === "update" ? "bg-blue-700 text-white" : "bg-gray-200"}`}>Update</button>
        <button onClick={() => setView("delete")} className={`px-4 py-2 ${view === "delete" ? "bg-blue-700 text-white" : "bg-gray-200"}`}>Delete</button>
      </div>

      {/* Common Select for Update/Delete */}
      {(view === "update" || view === "delete") && (
        <select
          onChange={(e) => handleSelectUpdate(e.target.value)}
          className="p-2 border w-full mb-4"
          value={selectedStudentId}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>{s.name} ({s.rollNo})</option>
          ))}
        </select>
      )}

      {/* Form Fields */}
      {(view === "create" || (view === "update" && selectedStudentId)) && (
        <form onSubmit={view === "create" ? handleCreate : e => e.preventDefault()} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border w-full"
            required
          />
          <input
            name="rollNo"
            placeholder="Roll No"
            value={formData.rollNo}
            onChange={handleChange}
            className="p-2 border w-full"
            required
          />
          <select
            name="school"
            value={formData.school}
            onChange={(e) => handleSchoolChange(e.target.value)}
            className="p-2 border w-full"
            required
          >
            <option value="">Select School</option>
            {schools.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="p-2 border w-full"
            required
            disabled={!departments.length}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          <input
            name="semester"
            placeholder="Semester"
            value={formData.semester}
            onChange={handleChange}
            className="p-2 border w-full"
            required
          />
          {view === "create" && <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>}
          {view === "update" && <button onClick={handleUpdate} className="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>}
        </form>
      )}

      {/* Delete Button */}
      {view === "delete" && selectedStudentId && (
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
      )}
    </div>
  );
};

export default StudentManager;
