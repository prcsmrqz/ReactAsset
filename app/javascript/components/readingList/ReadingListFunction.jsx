import axios from "axios";
import showAlert from "../Alert";

export const fetchReadingList = async (setReadingList, setErrors) => {
    try {
        const response = await axios.get("/reading_lists");
        setReadingList(response.data.reading_list);
    } catch (error) {
        setErrors(["Error fetching reading list:", error]);
    }
};

export const addReadingList = async (postid, setReadingList, readingList, setErrors) => {
    setErrors([]);
    try {
        const response = await axios.post(`/reading_lists`, {
            reading_list: { post_id: postid },
        });
    
        showAlert("Saved!", "Added to reading list", "success", "save");
        setReadingList([...readingList, response.data.reading_list]);
    } catch (error) {
        console.error("Error submitting reading list:", error);
        showAlert("Error Adding Reading List!", error.response?.data?.errors || "Unknown error", "error");
        setErrors(error.response?.data?.errors || ["Unknown error"]);
    }    
};

export const deleteReadingList = async (id, setReadingList, readingList, setErrors) => {
    setErrors([]);
    const result = await showAlert( "Remove from reading list?", "Are you sure you want to remove from reading list?", "warning", "delete" );

    if (!result.isConfirmed) return;

    try {
        await axios.delete(`/reading_lists/${id}`);
        setReadingList(readingList.filter((rl) => rl.id !== id));

        showAlert("Successfully Removed!", "Removed from reading list", "success");
    } catch (error) {
        setErrors("Error deleting post:", error);
    }
};
