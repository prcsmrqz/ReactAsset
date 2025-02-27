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
import Registration from "./devise/Registration";

//it protects from cross site request forgery, rails protect csrf attack by requiring a token for a non-GET requests
// it retrieves token from meta tag in application.html.erb
// axios headers must add token in every request in order for rails to accepts them
// without this when we request using post / put / delete will cause a 403 forbidden error to prevent unauthorized form submission
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
};

axios.defaults.headers.common["X-CSRF-Token"] = getCsrfToken();
axios.defaults.withCredentials = true; // allow sending cookies for authentication

const App = (props) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in and set the state to true if yes
  useEffect(() => {
    axios.get("/users/check_auth")
      .then(response => {
        if (response.data.logged_in) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Refresh CSRF token after login / logout, it must be 1 session for 1 token
  // the csrf token will be different in login/logout since its a different session
  // if this is not set, when we login/logout the old csrf token will be used
  const refreshCsrfToken = async () => {
    try {
      const response = await axios.get("/users/check_auth");
  
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
      }
    } catch (error) {
      console.error("Failed to refresh CSRF token:", error);
    }
  };

  // Refresh token after login, then set current user is login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    refreshCsrfToken(); 
  };
  // Refresh token after logout, then set the user is logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    refreshCsrfToken(); 
  };

  //check if the user is login before returning the elementw
  const pageCheck = (isAuthenticated, element) => {
    if (!isAuthenticated) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          <h2>Access Denied</h2>
          <p>You must be logged in to view this page.</p>
        </div>
      );
    }
    return element;
  };

  return (
    <Router>
      {/* Show navbar even if the user is login or logout */}
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} refreshCsrfToken={refreshCsrfToken} />
      <Routes>
        {/* check if the user is login, if yes then it return the element if not the authentication error */}
        <Route path="/dashboard" element={pageCheck(isAuthenticated, <Dashboard />)} />
        <Route path="/post" element={pageCheck(isAuthenticated, <Post />)} />
        <Route path="/edit/:id" element={pageCheck(isAuthenticated, <Form />)} />
        <Route path="/show/:id" element={pageCheck(isAuthenticated, <ShowForm />)} />
        <Route path="/create" element={pageCheck(isAuthenticated, <Form />)} />


        {/* Used when user is not login */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} refreshCsrfToken={refreshCsrfToken} />} />
      </Routes>
    </Router>
  );
};

export default App;