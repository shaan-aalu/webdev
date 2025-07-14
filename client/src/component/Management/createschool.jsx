import React, { useState, useEffect } from 'react';
import axios from 'axios';

const host = "http://localhost:8000"

const Createschool = () => {
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
  return (
          <div>
            <h1 className="text-2xl font-bold mb-6">Create School</h1>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="School Name"
                className="border p-2 rounded w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                className="border p-2 rounded w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            
        <div className="bg-white shadow rounded p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">All Schools</h2>
          {paginatedSchools.length === 0 ? (
            <p className="text-gray-500">No schools available.</p>
          ) : (
            <ul className="space-y-2">
              {paginatedSchools.map((school) => (
                <li key={school._id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-gray-600 text-sm">{school.address}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(school._id)}
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
}

export default Createschool