import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import showAlert from "./Alert";
import { ChatBubbleLeftRightIcon, HandThumbUpIcon, BookmarkIcon, MagnifyingGlassIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

function Home() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [posts, setPosts] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentUser, setcurrentUser] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, nextPage: null, prevPage: null });

  useEffect(() => { 
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/posts`);
      setPosts(response.data.posts);
      setcurrentUser(response.data.current_user);
    } catch (error) { console.error("Error fetching posts:", error); }
    }
    fetchPosts(); 
  }, []);

  useEffect(() => {
    const fetchReadingList = async () => {
        const response = await axios.get("/reading_lists");
        
        setReadingList(response.data);
    };

      fetchReadingList();
  }, []);


  const addReadingList = async (postid) => {
    setErrors([]);

    try {
      // save comment
      const response = await axios.post(`/reading_lists`, {
        reading_list: { post_id: postid },
      });
      
      showAlert("Saved!", "Added to reading list", "success", "save");
      setReadingList([...readingList, response.data.reading_list]);
    } catch (error) {
      showAlert("Error Adding Reading List!", error.response.data.errors, "error");
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const deleteReadingList = async (id) => {
    setErrors([]);
    console.log(id);
    // Wait for the confirmation of sweet alert to resolve
    const result = await showAlert("Remove from reading list?", "Are you sure you want to remove from reading list?", "warning", "delete");
  
    // If user cancels, stop the deletion process
    if (!result.isConfirmed) return;
  
    try {
      await axios.delete(`/reading_lists/${id}`); 
      setReadingList(readingList.filter(rl => rl.id !== id));
  
      // Show success alert after deletion
      showAlert("Successfully Removed!", "Removed from reading list", "success");
      console.log("remove" + readingList);
    } catch (error) {
      console.log(error);
            setErrors("Error deleting post:", error);
    }
  };

  return (
    <>
      <form className="max-w-2xl mx-auto mb-5">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input type="search" id="search" placeholder="Search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-3xl focus:ring-gray-300 focus:border-gray-300 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none" required />
        </div>
      </form>

      <nav className="flex justify-center items-center gap-14 px-6 pb-6 mt-0">
        <button className={`mb-1 pb-2 border-b-4 ${activeTab === "forYou" ? "border-blue-500" : "border-transparent"}`} onClick={() => setActiveTab("forYou")}>For You</button>
        <button className={`mb-1 pb-2 border-b-4 ${activeTab === "following" ? "border-blue-500" : "border-transparent"}`} onClick={() => setActiveTab("following")}>Following</button>
      </nav>

      <div className="min-h-screen flex flex-col pb-10 items-center">
        <div className="w-full max-w-4xl">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 flex flex-col-reverse md:flex-row gap-4 transition mb-4">
                <div className="flex flex-col flex-grow">
                  {/* Profile pic, name, and date */}
                  <div className="flex items-center gap-2">
                    <Link to="/profile" className="w-10 h-10 flex-shrink-0">
                      <img className="rounded-full w-full h-full object-cover" src="/assets/img/image.png" alt="Profile" />
                    </Link>
                    <div className="flex flex-col">
                      <Link to="/profile" className="text-sm font-semibold text-gray-900 dark:text-white hover:underline">
                        {p.user ? p.user.first_name + " " + p.user.last_name : "Unknown"}
                      </Link>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(p.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Title and Body */}
                  <Link to={`/show/${p.id}`} className="block mt-2">
                    <h5 className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline text-justify line-clamp-2 break-all">{p.title}</h5>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-400 text-justify line-clamp-2 break-all">{p.description}</p>
                  </Link>
                    {/* Buttons */}
                  <div className="flex items-center justify-between mt-auto pt-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <Link to={`/show/${p.id}`} className="flex items-center space-x-1 hover:text-blue-500 text-gray-500 mr-2">
                        <span>Learn More</span>
                        <ArrowLongRightIcon className="h-5 w-5" />
                      </Link>
                      <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => console.log("like click")}>
                        <HandThumbUpIcon className="h-5 w-5" />
                        <span>{p.likes_count}</span>
                      </button>
                      <Link to={`/show/${p.id}`}  className="flex items-center space-x-1 hover:text-blue-500">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>{p.comments.length}</span>
                      </Link>
                    </div>
                    <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => {const rl = readingList.find(rl => rl.post_id === p.id);
                                                                                                        rl ? deleteReadingList(rl.id) : addReadingList(p.id)}}>
                      {readingList.map(rl => rl.post_id).includes(p.id) ? <BookmarkIconSolid className="h-7 w-7 text-black" /> : <BookmarkIcon className="h-7 w-7" /> }
                    </button>
                  </div>
                </div>
                <Link to={`/show/${p.id}`}  className="w-full  md:w-60 md:h-50 flex-shrink-0 mt-2 md:mt-0">
                  <img className="rounded-lg w-full h-full object-cover" src={p.coverimg_url || "/assets/img/image.png"} alt="Post Image" />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No posts available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;