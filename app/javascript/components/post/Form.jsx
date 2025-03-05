import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import showAlert from "../Alert";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Check if it's edit mode
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState([]);

  // Fetch post details if editing
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setTitle(response.data.post.title);
        setBody(response.data.post.body);
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
      if (id) {
        await axios.put(`/posts/${id}`, { post: { title, body } });
        showAlert("Saved!", "Post updated successfully", "success");
      } else {
        await axios.post("/posts", { post: { title, body } });
        showAlert("Saved!", "Post created successfully", "success");
      }

      navigate("/post"); // Redirect after success
    } catch (error) {
      const status = id ? "Updating" : "Creating";
      showAlert("Error " + status + " Post!", "Please check all the information", "error");

      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting post:", error);
      }
    }
  };

  const handleDiscard = (e, title, body) => {
    e.preventDefault();
  
    if (!title && !body) {
      window.location.href = "/post";
      return;
    }
  
    showAlert("Discard post?", "This can’t be undone and you’ll lose your draft.", "question", "question").then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/post";
      }
    });
  };

  return (
    <div className="py-10 px-6 sm:px-10 md:px-20">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        {id ? "Edit Post" : "Create New Post"}
      </h1>
      <br />

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-7xl mx-auto">
        {/* Buttons Container */}
        <div className="flex items-center justify-between w-full mb-4">
          {/* Back Button */}
          <Link
            to="/post"
            onClick={(e) => handleDiscard(e, title, body)}
            className="flex items-center gap-2 text-black px-3 py-2 rounded-md font-semibold transition"
          >
            <ArrowLongLeftIcon className="h-6 w-6" />
            <span>Back</span>
          </Link>


          {/* Create/Update Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
          </div>
        )}

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Body Textarea */}
        <textarea
          placeholder="Body"
          value={body}
          className="border border-gray-300 rounded-md p-2 h-32 w-full resize-none mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setBody(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Form;
