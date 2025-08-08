import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const host = "http://localhost:8000";

const Login = () => {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("student");
  const navigate = useNavigate();

  // Auto-login on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("type");

    if (token && userType) {
      axios
        .post(
          `${host}/loginUser`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const { type } = res.data;
          if (type === "student") navigate("/home");
          else if (type === "teacher") navigate("/teacher");
          else if (type === "admin") navigate("/school");
        })
        .catch((err) => {
          console.log("Auto-login failed:", err.response?.data || err.message);
          localStorage.removeItem("token");
          localStorage.removeItem("type");
        });
    }
  }, [navigate]);

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { rollNo, password, type };
      const res = await axios.post(`${host}/loginStudent`, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("type", type);

      alert("Login successful");

      if (type === "student") navigate("/home");
      else if (type === "teacher") navigate("/teacher");
      else if (type === "admin") navigate("/school");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 space-y-4 max-w-md mx-auto mt-10 shadow-md border rounded-md">
      <h2 className="text-2xl font-semibold text-center">Login</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 w-full"
        required
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>

      <input
        placeholder={
          type === "student"
            ? "Student Roll Number"
            : type === "teacher"
            ? "Teacher ID"
            : "Admin ID"
        }
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full rounded">
        Login
      </button>
    </form>
  );
};

export default Login;
