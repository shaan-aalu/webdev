

// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";
// export const host = "http://localhost:8000"; // or wherever host is exported

// const PrivateRoute = ({ children }) => {
//   const [auth, setAuth] = useState(null); // null = loading, true = ok, false = reject


//   if (auth === null) return <div>Loading...</div>; // show spinner or loading screen

//   return auth ? children : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;


import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const host = "http://localhost:8000";

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = loading

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuth(false);
        return;
      }

      try {
        // 👇 simulate auto-login by hitting your /login endpoint with token in header
        const res = await axios.post(
          `${host}/loginStudent`,
          {}, // no body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 202) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error("Auto-login failed", error);
        setAuth(false);
      }
    };

    checkLogin();
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return auth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;


