import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const host = "http://localhost:8000";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${host}/signup`, { phone, password });
      alert("Signup successful. OTP sent.");
      localStorage.setItem("signup-phone", phone); // Store for OTP verification
      navigate("/verify");
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-6 space-y-4">
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 w-full" required />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Signup</button>
    </form>
  );
};

export default Signup;
