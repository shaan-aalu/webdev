import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base URL
export const host = "http://localhost:8000";

const Login = () => {
  const [rollNo, setrollNo] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${host}/loginStudent`, {
        rollNo,
        password,
      });

      // ✅ Save token to localStorage
      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      //navigate("/dashboard"); // Or whatever page after login
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 space-y-4">
      <input
        placeholder="Roll Number"
        value={rollNo}
        onChange={(e) => setrollNo(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        Login
      </button>
    </form>
  );
};

export default Login;
