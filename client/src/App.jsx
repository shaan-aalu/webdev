import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Createschool from './component/Management/createschool';
import Updateschool from './component/Management/Updateschool';
import ManageSchoolDepartments from './component/Management/ManageSchoolDepartments';
import CreateDept from './component/Management/CreateDept';
import UpdateDept from './component/Management/Updatedept';

import CreateTeacher from './component/Management/CreateTeacher';
import UpdateTeacher from './component/Management/UpdateTeacher';
import DeleteTeacher from './component/Management/DeleteTeacher';
import AddTeacher from './component/Management/Add&deleteTeacher';
import TeacherSubjectManager from './component/Management/TeacherSubjectManager';

import Teacher from './component/Teacher/Teacherpage';
import Student from './component/Student/Student';
import Home from './component/Home';
export const host = "http://localhost:8000"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from './component/Navbar';
import Signup from './component/Student/signup';
import Login from './component/Login';
import VerifyOtp from './component/Student/VerifyOtp';
import PrivateRoute from './component/PrivateRoute';

const SchoolManagement = () => {
  const [schools, setSchools] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState('createSchool');
  const itemsPerPage = 10;

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${host}/getAllSchool`);
      setSchools(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      if (!name || !address) return alert('Fields required');
      await axios.post(`${host}/createSchool`, { name, address });
      setName('');
      setAddress('');
      fetchSchools();
    } catch (err) {
      alert(err.response.data);
    }
  };

  const handleDelete = async (schoolId) => {
    try {
      console.log(schoolId)
      await axios.delete(`${host}/deleteSchool/${schoolId}`);
      fetchSchools();
    } catch (err) {
      alert(err.response.data);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderContent = () => {
    switch (activeView) {
      case 'createSchool':
        return <Createschool />
      case 'updateSchool':
        return <Updateschool />
      case 'ManageSchoolDepartments':
        return <ManageSchoolDepartments />
      case 'createDept':
        return <CreateDept />
      case 'updateDept':
        return <UpdateDept />
      case 'AddTeacher':
        return <AddTeacher />
      case 'deleteTeacherFromDept':
        return <DeleteTeacherFromDept />
      case 'createTeacher':
        return <CreateTeacher />
      case 'updateTeacher':
        return <UpdateTeacher />
      case 'deleteTeacher':
        return <DeleteTeacher />
      case 'TeacherSubjectManager':
        return <TeacherSubjectManager />
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-2">Dashboard</h2>
        <div>
          <h3 className="font-semibold">School</h3>
          <ul className="ml-4 space-y-1">
            <li onClick={() => setActiveView('createSchool')} className="cursor-pointer hover:underline">Create School</li>
            <li onClick={() => setActiveView('updateSchool')} className="cursor-pointer hover:underline">Update School</li>
            <li onClick={() => setActiveView('ManageSchoolDepartments')} className="cursor-pointer hover:underline">Add & delete Department</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Department</h3>
          <ul className="ml-4 space-y-1">
            <li onClick={() => setActiveView('createDept')} className="cursor-pointer hover:underline">Create Department</li>
            <li onClick={() => setActiveView('updateDept')} className="cursor-pointer hover:underline">Update Department</li>
            <li onClick={() => setActiveView('AddTeacher')} className="cursor-pointer hover:underline">Add & Delete Teacher</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Teacher</h3>
          <ul className="ml-4 space-y-1">
            <li onClick={() => setActiveView('createTeacher')} className="cursor-pointer hover:underline">Create Teacher</li>
            <li onClick={() => setActiveView('updateTeacher')} className="cursor-pointer hover:underline">Update Teacher</li>
            <li onClick={() => setActiveView('deleteTeacher')} className="cursor-pointer hover:underline">Delete Teacher</li>
            <li onClick={() => setActiveView('TeacherSubjectManager')} className="cursor-pointer hover:underline">add & delete subject</li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <input
          type="text"
          placeholder="Search schools..."
          className="border p-2 rounded w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {renderContent()}

      </div>
    </div>
  );
}

const App = () => {
  return (
<Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/school" element={<SchoolManagement />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
        
        {/* ✅ Protect Home route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}


export default App

