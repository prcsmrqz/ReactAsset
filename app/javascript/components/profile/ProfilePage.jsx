import React, {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { fetchReadingList, addReadingList, deleteReadingList } from "../readingList/ReadingListFunction.jsx"
import { ChatBubbleLeftRightIcon, HandThumbUpIcon, BookmarkIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

const ProfilePage = () => {

    const { id } = useParams();
    const [user, setUser] = useState([]);
    const [posts, setPosts] = useState([]);
    const [readingList, setReadingList] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await axios.get(`/userPost/${id}`);
            setUser(response.data.user);
            setPosts(response.data.posts);
            console.log(response.data.posts); 
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        fetchReadingList(setReadingList, setErrors);
    }, []);

    const handleReadingList = (postId) => {
        const existingItem = readingList.find(rl => rl.post_id === postId);
          existingItem ? 
            deleteReadingList(existingItem.id, setReadingList, readingList, setErrors)
          : addReadingList(postId, setReadingList, readingList, setErrors);
    };

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 text-center">
                <img className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover" src={user.coverimg_url || "/assets/img/image.png"} alt="Profile Picture" />
                <div className="flex flex-col items-center mt-2">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-black uppercase mb-2 font-sans">
                        {user.first_name + " " + user.last_name}
                    </h1>
                    <h2 className="text-md text-gray-500">{user.bio}</h2>
                    <button className="mt-4 w-40 md:w-32 px-2 py-1 text-sm bg-white text-black border border-black rounded-full hover:bg-black hover:text-white transition">
                        EDIT PROFILE
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-10 md:gap-40 text-center mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold font-sans">123</h1>
                    <h2 className="text-xs md:text-sm text-gray-500">FOLLOWERS</h2>
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold font-sans">12345</h1>
                    <h2 className="text-xs md:text-sm text-gray-500">FOLLOWING</h2>
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold font-sans">123</h1>
                    <h2 className="text-xs md:text-sm text-gray-500">LIKES</h2>
                </div>
            </div>
            <div className="min-h-screen flex flex-col pb-10 items-center">
                <div className="w-full max-w-4xl">
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 flex flex-col-reverse md:flex-row gap-4 transition mb-4">
                        <div className="flex flex-col flex-grow">
                        {/* Profile pic, name, and date */}
                        <div className="flex items-center gap-2">
                            <Link to={`/profile/${p.user.id}`} className="w-10 h-10 flex-shrink-0">
                            <img className="rounded-full w-full h-full object-cover" src="/assets/img/image.png" alt="Profile" />
                            </Link>
                            <div className="flex flex-col">
                            <Link to={`/profile/${p.user.id}`}  className="text-sm font-semibold text-gray-900 dark:text-white hover:underline">
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
                            <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => handleReadingList(p.id)}                            >
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
           
        </div>

    )
}

export default ProfilePage;