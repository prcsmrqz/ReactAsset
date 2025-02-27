import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// get the isAuthenticated, onLogout, refreshCsrfToken from app.jsx
const Navbar = ({ isAuthenticated, onLogout, refreshCsrfToken }) => {
  const navigate = useNavigate();

  //logout function, send cookies, remove the old csrf token, get the new token
  const handleLogout = async () => {
    try {
      await axios.delete("/users/sign_out");
  
      delete axios.defaults.headers.common["X-CSRF-Token"]; // Remove old token
      await refreshCsrfToken(); // Get new CSRF token
  
      onLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };
  
  return (
    <nav className="bg-[#f691ad] text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">Article App</Link>
        </h1>
        <ul className="flex space-x-6">
          {/* show navbar link if user is login or not */}
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-black transition">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-black transition">Sign Up </Link>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-black transition">Dashboard</Link></li>
              <li><Link to="/post" className="text-gray-600 hover:text-black transition">Post</Link></li>
              <li>
                <button onClick={handleLogout} className="text-gray-600 hover:text-black transition">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;