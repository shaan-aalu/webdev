import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { host } from '../../App'


const Updateschool = () => {
  const [schools, setSchools] = useState([])
  const [editSchool, setEditSchool] = useState(null)
  const [formData, setFormData] = useState({ name: '', address: '' })

  // Fetch all schools on component mount
  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${host}/getAllSchool`) 
      setSchools(res.data)
    } catch (err) {
      console.error("Error fetching schools", err)
    }
  }

  const handleEdit = (school) => {
    setEditSchool(school)
    setFormData({ name: school.name, address: school.address })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    try {
      await axios.post(`${host}/updateschool/${editSchool._id}`, formData)
      setEditSchool(null)
      fetchSchools()
    } catch (err) {
      console.error("Error updating school", err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update School</h1>

      {/* List of schools */}
      <div className="space-y-4">
        {schools.map((school) => (
          <div
            key={school._id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p><span className="font-semibold">Name:</span> {school.name}</p>
              <p><span className="font-semibold">Address:</span> {school.address}</p>
            </div>
            <button
              onClick={() => handleEdit(school)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit School</h2>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="School Name"
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="School Address"
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditSchool(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Updateschool
