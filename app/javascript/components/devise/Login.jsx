import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLoginSuccess, refreshCsrfToken }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // check if user is login, if yes then call the onlogin success to create new csrf then go to post
    // this is useful when we accidentally close the page then goes back again to prevent logging in again
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get("/users/check_auth");
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
  
    // when user click the login button it sends a request to validate the email and password
    // if successfully login get another csrf token
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
      
        try {
          await refreshCsrfToken();
      
          const response = await axios.post(
             "/users/sign_in", { user: { email, password } }
          );
      
          if (response.status === 200) {
            console.log("Login successful:", response.data);
      
            await refreshCsrfToken();
            onLoginSuccess();
            navigate("/post");
          }
        } catch (err) {
          setError("Invalid email or password. Please try again.");
        }
      };
  
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          
          {error && 
            <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3"> {error}</p>
          }

          <input type="email"  placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
             className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
             className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </form>
      </div>
    );
  };
  
  export default Login;
  