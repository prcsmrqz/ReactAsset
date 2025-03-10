import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../utils/DateFormat";

const CommentsSection = ({ comments, user, deleteComment }) => {
    // set initial count value of the comment that will be shown
    const [visibleCount, setVisibleCount] = useState(2);

    // add comments that will be shown after click show more
    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 2);
    };

    //reverse the comment to get newest first then get only on how many will be shown
    const visibleComments = [...comments].reverse().slice(0, visibleCount);
    

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            {Array.isArray(comments) && comments.length > 0 ? (
                <>
                    {visibleComments.map((c) => (
                        <div key={c.id} className="border-t py-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    {/* Profile Picture */}
                                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300">
                                        <img className="rounded-full w-full h-full object-cover" src={c.image || "/assets/img/image.png"} alt={`${c.commenter || "Anonymous"}'s profile`} />
                                    </div>

                                    {/* Comment Details */}
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {c.commenter || "Anonymous"} 
                                            <span className="text-gray-500 text-sm font-normal ml-1">
                                                 • {getTimeAgo(c.created_at)}
                                            </span>
                                        </p>
                                        <p className="text-gray-700">{c.body}</p>
                                    </div>
                                </div>

                                {c.user_id === user.id && (
                                    <button className="bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded text-sm" onClick={() => deleteComment(c.id)} >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {comments.length > visibleCount && (
                        <button className="mt-4 text-blue-500 hover:underline" onClick={handleShowMore} >
                            Show more comments...
                        </button>
                    )}
                </>
            ) : (
                <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
};

export default CommentsSection;
