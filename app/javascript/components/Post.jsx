import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; //Navigation between pages using React Router

const Post = () => {

  //Store the list of posts, it uses array since the data can be more than 1
  const [posts, setPosts] = useState([]); 
  
  //set the pagination details, use 1 for currentPage and totalPages to have a default value
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, nextPage: null, prevPage: null, });

  // Fetch the first page of posts from the controller when the component mount
  useEffect(() => {
    fetchPosts(1);
  }, []);

  //fetch post from controller
  //set page to 1 to get the first page
  const fetchPosts = async (page = 1) => {
    try {
      const response = await axios.get(`/posts?page=${page}`);
      //set the fetch post to setPosts
      setPosts(response.data.posts);
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

  //delete post getting the id
  const deletePost = async (id) => {

    //show an alert if yes, then proceed to delete post if not return
    const confirmDelete = window.confirm("Are you sure you want to delete your post?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/posts/${id}`); // API request to delete post
      setPosts(posts.filter((p) => p.id !== id)); // Remove deleted post from state, creates new array that exclude the deleted post
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="py-10 px-20">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        CRUD App with React-Rails
      </h1>
      <Link to="/form" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"> Create Post </Link>
      <br />
      <br />

      <table className="table-fixed border-collapse border border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Body</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          { /* iterate on posts and if the posts has a data / value */ }
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((p) => (
              <tr key={p.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <strong>{p.title}</strong>
                </td>
                <td className="border border-gray-300 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                  {p.body}
                </td>

                { /* pass the post id when edit or delete */ }
                <td className="border border-gray-300 px-4 py-2 flex gap-4 justify-center">
                <Link
                    to={`/show/${p.id}`}
                    className="bg-blue-400 hover:bg-blue-500 text-black py-1 px-2 rounded"
                  >
                    Show
                  </Link>

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
              { /* else if no posts */ }
              <td colSpan="3">No posts available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        {/* Disable if previous page is null, call fetchPosts(pagination.prevPage) to set the page number based on prevPage */}
        <button
          className={`px-4 py-2 rounded ${
            pagination.prevPage ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-200 cursor-not-allowed"
          }`}
          onClick={() => fetchPosts(pagination.prevPage)}
          disabled={!pagination.prevPage}
        >
          Previous
        </button>

        <span className="text-lg font-semibold mt-2">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        {/* Disable if next page is null, call fetchPosts(pagination.nextPage) to set the page number based on nextPage */}
        <button
          className={`px-4 py-2 rounded ${
            pagination.nextPage ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-200 cursor-not-allowed"
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
