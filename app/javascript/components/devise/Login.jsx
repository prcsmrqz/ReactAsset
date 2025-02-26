import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLoginSuccess, refreshCsrfToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    axios.defaults.withCredentials = true;
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get("/users/check_auth", { withCredentials: true });
          if (response.data.logged_in) {
            onLoginSuccess();
            navigate("/post");
          }
        } catch (err) {
          console.log("Not logged in");
        }
      };
      checkAuth();
    }, [onLoginSuccess, navigate]);
  
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
      
        try {
          await refreshCsrfToken(); // ✅ Ensure we use the latest CSRF token
      
          const response = await axios.post(
            "/users/sign_in",
            { user: { email, password } },
            { withCredentials: true }
          );
      
          if (response.status === 200) {
            console.log("Login successful:", response.data);
      
            await refreshCsrfToken(); // ✅ Refresh CSRF token again after login
            onLoginSuccess();
            navigate("/post");
          }
        } catch (err) {
          console.error("Login error:", err.response?.data || err.message);
          setError("Invalid email or password. Please try again.");
        }
      };
      
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="w-80 p-4 border rounded shadow">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  };
  
  export default Login;
  