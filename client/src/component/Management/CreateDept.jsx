import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { host } from '../../App'


const CreateDept = () => {
    const [name, setName] = useState('')
    const [schoolId, setSchoolId] = useState('')
    const [dept, setdept] = useState([])
    const [schools, setSchools] = useState([])
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchSchools()
    }, [])

    const fetchSchools = async () => {
        try {
            const res = await axios.get(`${host}/getAllSchool`) // This should call your getAlldept (which returns schools)
            setSchools(res.data)
        } catch (err) {
            console.error('Error fetching schools', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage(null)

        try {
            const res = await axios.post(`${host}/createDept`, { name }) // Assuming your backend accepts schoolId too
            setMessage({ type: 'success', text: res.data })
            setName('')
            setSchoolId('')
        } catch (err) {
            const errorText = err.response?.data || 'Something went wrong'
            setMessage({ type: 'error', text: errorText })
        }
    }

    const fetchDept = async () => {
        try {
            const akash = await axios.get(`${host}/getAllDept`)
            console.log(akash.data)
            setdept(akash.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDept()
    }, [])

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Department</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Department Name */}
                <input
                    type="text"
                    placeholder="Department Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                />

                {/* School Selector */}
                <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Select School</option>
                    {schools.map((school) => (
                        <option key={school._id} value={school._id}>
                            {school.name}
                        </option>
                    ))}
                </select>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Create Department
                </button>

                {/* Message */}
                {message && (
                    <div
                        className={`text-sm mt-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {message.text}
                    </div>
                )}
            </form>

            <div className='border-2 mt-10 border-black shadow-2xl py-5 px-3'>
                <h1 className='text-2xl'>Department Name:- </h1>
                {
                    dept.map(ele => {
                        return (
                            <div key={ele._id} className='border-b-2'>
                                {ele.name}
                            </div>

                        )
                    })
                }
            </div>

        </div>
    )
}

export default CreateDept

