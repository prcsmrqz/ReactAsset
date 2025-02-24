import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
  });

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await axios.get(`/posts?page=${page}`);
      setPosts(response.data.data);
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.pages,
        nextPage: response.data.next,
        prevPage: response.data.prev,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const deletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your post?");
    if (!confirmDelete) return; // Exit if user cancels
  
    try {
      await axios.delete(`/posts/${id}`); // API request to delete post
      setPosts(posts.filter((p) => p.id !== id)); // Remove deleted post from state
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="py-10 px-20">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        CRUD App with React-Rails
      </h1>
      <Link
        to="/form"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Create Post
      </Link>
      <br />
      <br />

      <table className="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Body</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((p) => (
              <tr key={p.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>{p.title}</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2">{p.body}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-4 justify-center">
                  <Link
                    to={`/edit/${p.id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-2 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-400 hover:bg-red-500 text-black py-1 px-2 rounded"
                    onClick={() => deletePost(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No posts available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          className={`px-4 py-2 rounded ${
            pagination.prevPage ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-200 cursor-not-allowed"
          }`}
          onClick={() => fetchPosts(pagination.prevPage)}
          disabled={!pagination.prevPage}
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          className={`px-4 py-2 rounded ${
            pagination.nextPage ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-200 cursor-not-allowed"
          }`}
          onClick={() => fetchPosts(pagination.nextPage)}
          disabled={!pagination.nextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Post;
