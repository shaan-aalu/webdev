import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <div className='bg-black text-white flex py-4 px-8 justify-center items-center gap-5 text-2xl'>
            <Link className='hover:text-gray-500' to="/">Home</Link>
            <Link className='hover:text-gray-500' to="/teacher">Teacher</Link>
            <Link className='hover:text-gray-500' to="/student">Student</Link>
            <Link className='hover:text-gray-500' to="/school">School</Link>

        </div>
    )
}

export default Navbar