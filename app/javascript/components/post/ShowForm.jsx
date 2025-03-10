import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import showAlert from "../Alert";
import CurrentUser from "../devise/CurrentUser";
import CommentsSection from "./Comment";
import { CalendarDaysIcon, HandThumbUpIcon, ChatBubbleLeftRightIcon, BookmarkIcon } from "@heroicons/react/24/outline";

const ShowForm = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);

  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState([]);
  const [author, setAuthor] = useState([]);
  const [coverimg, setCoverimg] = useState("");

  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");

  const contentRef = useRef(null);
  const commentsRef = useRef(null);
  //get the title, body, and comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        console.log(response.data);
        setPosts(response.data.post);
        setTitle(response.data.post.title);
        setPostBody(response.data.post.body);
        setDescription(response.data.post.description);
        setComments(response.data.post.comments);
        setUser(response.data.current_user);
        setCoverimg(response.data.post.coverimg_url);
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
  
  //set the body along with styles
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = postBody;
    }
  }, [postBody]);

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
    <div className="px-4 sm:px-5 md:px-20 py-6 md:py-10">
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl mb-3" style={{ fontFamily: '"Helvetica", sans-serif', fontWeight: '800'}}>
          {title}
        </h1>
        <p className=" sm:text-xl md:text-2xl lg:text-md text-gray-500 mb-1" style={{ fontFamily: '"Helvetica", sans-serif', fontWeight: '300'}}>
          {description}
        </p>
        {/* Profile */}
        <div className="flex items-center gap-2 p-5">
          <Link to="/profile" className="w-12 h-12 flex-shrink-0">
            <img className="rounded-full w-full h-full object-cover" src={author.image || "/assets/img/image.png"} alt="Profile" />
          </Link>

          <div className="flex flex-col justify-center leading-relaxed">
            <div className="flex items-center gap-2">
              <Link to="/profile" className="text-md text-gray-900 dark:text-white hover:underline">
                {author.first_name} {author.last_name}
              </Link>
              •
              <button className="text-md text-blue-500 hover:underline">Follow</button>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>
                {new Date(posts.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-b border-gray-100 p-3 mb-5 flex items-center justify-between text-gray-400 mt-auto dark:text-gray-400">
          <div className="flex items-center space-x-4 ">
            <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => console.log("like click")}>
              <HandThumbUpIcon className="h-5 w-5" />
              <span>10</span>
            </button>
            {/* use ref for scrolling to comment when comment button is clicked */}
            <button to="/post" className="flex items-center space-x-1 hover:text-blue-500" onClick={() => commentsRef.current?.scrollIntoView({ behavior: "smooth" })}>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>{comments.length}</span>
            </button>
          </div>
          <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => console.log("bookmark click")}>
            <BookmarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="content-container mb-8">
          <div ref={contentRef} className="text-justify text-base sm:text-lg md:text-xl leading-loose post-content"
            style={{  minHeight: "200px", fontFamily: "Georgia, serif", whiteSpace: "pre-line", pointerEvents: "none" }} />
        </div>
        
        <hr className="my-6" />

        <div className="my-6" ref={commentsRef} >
          <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
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
              
              <textarea placeholder="Write your comment here..." value={commentBody} className="border border-gray-300 rounded-md p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setCommentBody(e.target.value)} />

              <div className="flex items-end justify-between gap-5">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                  Comment
                </button>
                <Link to="/home"className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold transition text-center">
                  Back
                </Link>
              </div>
            </div>
          </form>
        </div>
        
        {/* Show comments */}
        <CommentsSection comments={comments} user={user} deleteComment={(cid) => deleteComment(id, cid)} />

      </div>
    </div>
  );
};

export default ShowForm;