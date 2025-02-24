import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Post from "./Post";
import Form from "./post/Form";

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
        <Route path="/form" element={<Form />} />

      </Routes>
    </Router>
  );
};

export default App;
