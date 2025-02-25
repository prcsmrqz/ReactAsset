import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Post from "./Post";
import Form from "./post/Form";
import ShowForm from "./post/ShowForm";


//it protects from cross site request forgery, rails protect csrf attack by requiring a token for a non-GET requests
// it retrieves token from meta tag in application.html.erb
// axios headers must add token in every request in order for rails to accepts them
// without this when we request using post / put / delete will cause a 403 forbidden error to prevent unauthorized form submission
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
};

// Set CSRF token for all Axios requests
axios.defaults.headers.common["X-CSRF-Token"] = getCsrfToken();

const App = (props) => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home greeting={props.greeting} />} />
        <Route path="/home" element={<Home greeting={props.greeting} />} />
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
