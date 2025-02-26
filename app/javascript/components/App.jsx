import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Post from "./Post";
import Form from "./post/Form";
import ShowForm from "./post/ShowForm";
import Login from "./devise/Login";

//it protects from cross site request forgery, rails protect csrf attack by requiring a token for a non-GET requests
// it retrieves token from meta tag in application.html.erb
// axios headers must add token in every request in order for rails to accepts them
// without this when we request using post / put / delete will cause a 403 forbidden error to prevent unauthorized form submission
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
};

axios.defaults.headers.common["X-CSRF-Token"] = getCsrfToken();
axios.defaults.withCredentials = true;

const App = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    axios.get("/users/check_auth", { withCredentials: true })
      .then(response => {
        if (response.data.logged_in) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Function to refresh CSRF token
  const refreshCsrfToken = async () => {
    try {
      const response = await axios.get("/users/check_auth", { withCredentials: true });
  
      // Extract CSRF token from response headers
      const newCsrfToken = response.headers["x-csrf-token"];
      
      if (newCsrfToken) {
        // Update the meta tag dynamically
        const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
        if (csrfMetaTag) {
          csrfMetaTag.setAttribute("content", newCsrfToken);
        }
  
        // Set the new token in axios
        axios.defaults.headers.common["X-CSRF-Token"] = newCsrfToken;
        console.log("Updated CSRF Token:", newCsrfToken);
      }
    } catch (error) {
      console.error("Failed to refresh CSRF token:", error);
    }
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    refreshCsrfToken(); // Refresh token after login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    refreshCsrfToken(); // Refresh token after logout
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} refreshCsrfToken={refreshCsrfToken} />
      <Routes>
        <Route path="/" element={<Home greeting={props.greeting} />} />
        <Route path="/home" element={<Home greeting={props.greeting} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} refreshCsrfToken={refreshCsrfToken} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post" element={<Post />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/show/:id" element={<ShowForm />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  );
};

export default App;
