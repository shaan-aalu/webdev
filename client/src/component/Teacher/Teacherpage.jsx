import React, { useEffect, useState } from "react";
import axios from "axios";

const host = "http://localhost:8000";

const TeacherPage = () => {
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [marksData, setMarksData] = useState({}); // studentId -> mark

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get(`${host}/getAllSchool`);
        setSchools(res.data);
      } catch (err) {
        console.error("Failed to fetch schools", err);
      }
    };

    const fetchAllStudents = async () => {
      try {
        const res = await axios.get(`${host}/getAllStudents`);
        setAllStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };

    fetchSchools();
    fetchAllStudents();
  }, []);

  // School
  const handleSchoolChange = (schoolId) => {
    setSelectedSchool(schoolId);
    setSelectedDept("");
    setSelectedTeacher("");
    setSelectedSemester("");
    setSelectedSubject("");
    setFilteredStudents([]);

    const selected = schools.find((s) => s._id === schoolId);
    setDepartments(selected?.department || []);
  };

  // Department
  const handleDeptChange = (deptId) => {
    setSelectedDept(deptId);
    setSelectedTeacher("");
    setSelectedSemester("");
    setSelectedSubject("");
    setFilteredStudents([]);

    const selectedDept = departments.find((d) => d._id === deptId);
    setTeachers(selectedDept?.Teachers || []);
  };

  // Teacher
  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
    setSelectedSemester("");
    setSelectedSubject("");
    setFilteredStudents([]);

    const teacher = teachers.find((t) => t._id === teacherId);
    setSubjects(teacher?.subject || []);
  };

  // Unique semesters
  const uniqueSemesters = [...new Set(subjects.map((s) => s.semester))];

  // Filtered subjects
  const filteredSubjects = subjects.filter(
    (s) => s.semester.toString() === selectedSemester
  );

  // Fetch and show students on subject selection
  useEffect(() => {
    if (selectedSchool && selectedDept && selectedSemester && selectedSubject) {
      const filtered = allStudents.filter(
        (stu) =>
          stu.school === selectedSchool &&
          stu.department === selectedDept &&
          stu.semester.toString() === selectedSemester
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedSchool, selectedDept, selectedSemester, selectedSubject, allStudents]);

  // Handle mark input
  const handleMarkChange = (studentId, score) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: score,
    }));
  };

  // Upload mark to backend
  const uploadMark = async (studentId) => {
    const score = marksData[studentId];
    if (!score) {
      alert("Please enter a score");
      return;
    }

    console.log({
      studentId,
      SubjectName: selectedSubject,
      Marks: parseFloat(score),
    })

    try {
      await axios.post(`${host}/uploadMarks`, {
        studentId,
        SubjectName: selectedSubject,
        Marks: parseFloat(score),
      });
      alert("Mark uploaded successfully");
    } catch (err) {
      console.error("Failed to upload mark", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center mt-6">
      {/* Dropdowns */}
      <select className="border-2 rounded-md w-80" value={selectedSchool} onChange={(e) => handleSchoolChange(e.target.value)}>
        <option value="">Select School</option>
        {schools.map((s) => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      <select className="border-2 rounded-md w-80" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)} disabled={!departments.length}>
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d._id} value={d._id}>{d.name}</option>
        ))}
      </select>

      <select className="border-2 rounded-md w-80" value={selectedTeacher} onChange={(e) => handleTeacherChange(e.target.value)} disabled={!teachers.length}>
        <option value="">Select Teacher</option>
        {teachers.map((t) => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>

      <select className="border-2 rounded-md w-80" value={selectedSemester} onChange={(e) => {
        setSelectedSemester(e.target.value);
        setSelectedSubject("");
      }} disabled={!uniqueSemesters.length}>
        <option value="">Select Semester</option>
        {uniqueSemesters.map((sem, idx) => (
          <option key={idx} value={sem}>Semester {sem}</option>
        ))}
      </select>

      <select className="border-2 rounded-md w-80" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!filteredSubjects.length}>
        <option value="">Select Subject</option>
        {filteredSubjects.map((s, index) => (
          <option key={index} value={s.subjectName}>{s.subjectName}</option>
        ))}
      </select>

      {/* Student Marks Entry */}
      {filteredStudents.length > 0 && (
        <div className="mt-6 w-[80%]">
          <h2 className="text-xl font-bold mb-2">Enter Marks for "{selectedSubject}"</h2>
          <table className="w-full table-auto border border-collapse border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Roll No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Marks</th>
                <th className="border px-4 py-2">Upload</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => (
                <tr key={stu._id}>
                  <td className="border px-4 py-1">{stu.rollNo}</td>
                  <td className="border px-4 py-1">{stu.name}</td>
                  <td className="border px-4 py-1">
                    <input
                      type="number"
                      value={marksData[stu._id] || ""}
                      onChange={(e) => handleMarkChange(stu._id, e.target.value)}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </td>
                  <td className="border px-4 py-1">
                    <button
                      onClick={() => uploadMark(stu._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Upload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherPage;
