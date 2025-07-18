import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const host = "http://localhost:8000";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const phone = localStorage.getItem("signup-phone");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${host}/verify`, { phone, otp });
      alert("Phone verified. Please login.");
      localStorage.removeItem("signup-phone");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "OTP verification failed");
    }
  };

  return (
    <form onSubmit={handleVerify} className="p-6 space-y-4">
      <p>Verifying for: {phone}</p>
      <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="border p-2 w-full" required />
      <button type="submit" className="bg-green-600 text-white px-4 py-2">Verify</button>
    </form>
  );
};

export default VerifyOtp;
