import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const Form = () => {
  // enable the redirection after form submission
  const navigate = useNavigate();

  const { id } = useParams(); // Get post ID from URL, if id exist edit if not create
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState([]);

  // if theres an id, it fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setTitle(response.data.title);
        setBody(response.data.body);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
  
    if (id) {
      fetchPost();
    }
  }, [id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      // if theres an id update, else create
      if (id) {
        await axios.put(`/posts/${id}`, { post: { title, body } });
      } else {
        await axios.post("/posts", { post: { title, body } });
      }
      //redirect to post.jsx after creating / updating
      navigate("/post");
    } catch (error) {
      // if theres an error it will set the errors and show it after submit
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting post:", error);
      }
    }
  };

  return (
    <div className="py-10 px-20">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        {id ? "Edit Post" : "Create New Post"}
      </h1>
      <br />
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl mx-auto">
        <div className="flex flex-col gap-4">

        { /* if there is an error it iterates over it */ }
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
            </div>
          )}

          { /* (e.target.value), update the title and body state */ }
          <input type="text" placeholder="Title" value={title} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setTitle(e.target.value)} />
            
          <textarea placeholder="Body" value={body} className="border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setBody(e.target.value)} />
          
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
            {id ? "Update" : "Create"}
          </button>
          <Link to="/post" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold transition text-center">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Form;
