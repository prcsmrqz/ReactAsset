import axios from "axios";

const currentUser = async () => {
  try {
    const response = await axios.get("/home/show", {
      headers: { "Accept": "application/json" }
    });
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return error;
  }
};

export default currentUser;
