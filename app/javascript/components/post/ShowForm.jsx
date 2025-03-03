import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import showAlert from "../Alert";
import CurrentUser from "../devise/CurrentUser";

const ShowForm = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);

  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [errors, setErrors] = useState([]);
  const [author, setAuthor] = useState([]);

  const [comments, setComments] = useState([]);
  const [commenter, setCommenter] = useState("");
  const [commentBody, setCommentBody] = useState("");

  //get the title, body, and comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setTitle(response.data.post.title);
        setPostBody(response.data.post.body);
        setComments(response.data.post.comments);
        setUser(response.data.current_user);
        setAuthor(response.data.post.user);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
      const fetchUser = async () => {
        const userData = await CurrentUser(); 
        setUser(userData);
      };
  
      fetchUser();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      // save comment
      const response = await axios.post(`/posts/${id}/comments`, {
        comment: { body: commentBody },
      });
      //set the comments to append then null the commenter and comment body
      setComments([...comments, response.data]);
      setCommenter("");
      setCommentBody("");
      showAlert("Saved!", "Comment created successfully", "success", "save");
    } catch (error) {
      showAlert("Error Creating Comments!", "Please check all the information", "error");
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting comment:", error);
      }
    }
  };

  //delete post getting the id
  const deleteComment = async (id, cid) => {
  
    // Wait for the confirmation of sweet alert to resolve
    const result = await showAlert("Are you sure?", "You won't be able to revert this comment!", "warning", "delete");
  
    
    if (!result.isConfirmed) return;
  
    try {
      // API request to delete comment, we use id for posts and cid for comment_id to delete
      await axios.delete(`/posts/${id}/comments/${cid}`); 
      setComments(comments.filter((c) => c.id !== cid)); // Remove deleted comment from state, creates new array that exclude the deleted comment
  
      // Show success alert after deletion
      showAlert("Deleted!", "Comment deleted successfully", "success");
    } catch (error) {
      setError("Error deleting comment:", error);
    }
  };


  return (
    <div className="py-10 px-20">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto">
        <h1 className="text-md md:text-lg lg:text-xl ">{author.first_name} {author.last_name}</h1>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">{title}</h1>
        <p className="text-center">{postBody}</p>
        <br />
        <hr />
        <br />

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                <ul>
                  {errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* 
            <input type="text" placeholder="Commenter" value={commenter} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setCommenter(e.target.value)} />
            */}
            <textarea placeholder="Body" value={commentBody} className="border border-gray-300 rounded-md p-2 h-15 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setCommentBody(e.target.value)} />

            <div className="flex items-end justify-between gap-5">
              <button type="submit"className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                Comment
              </button>
              <Link to="/post" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold transition text-center" >
                Back
              </Link>
            </div>
          </div>
        </form>

        <br />

        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id}>
              <hr className="mt-2 mb-2" />
              <p>Commenter: {c.commenter}</p>
              <p>Body: {c.body}</p>
              {c.user_id == user.id &&
              <button className="bg-red-400 hover:bg-red-500 text-black py-1 px-2 rounded" onClick={() => deleteComment(id, c.id)}>
                Delete
              </button>
              }
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
};

export default ShowForm;
