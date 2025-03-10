import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import showAlert from "../Alert";
import { ArrowLongLeftIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Function to check current selection styles
  const updateActiveStyles = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setActiveStyles({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
      });
    }
  };

  // Functions to save and restore cursor position
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range) => {
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Handle mouse up and key up events to update active styles
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveStyles();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Handle formatting button clicks
  const handleFormatClick = (command) => (event) => {
    event.preventDefault();
    editorRef.current.focus();
    document.execCommand(command);
    // Update active style states
    setActiveStyles(prev => ({
      ...prev,
      [command]: !prev[command]
    }));
  };

  const handleInput = () => {
    setBody(editorRef.current.innerHTML);
  };

  // Initialize editor content on first load or when post is fetched
  useEffect(() => {
    if (editorRef.current && body && !isInitialized) {
      editorRef.current.innerHTML = body;
      setIsInitialized(true);
    }
  }, [body, isInitialized]);

  // Fetch post details if editing
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setTitle(response.data.post.title);
        setBody(response.data.post.body);
        setDescription(response.data.post.description);
        console.log(response.data);
  
        if (response.data.post.coverimg_url) {
          setPreview(response.data.post.coverimg_url);
        }
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
    
    // use FormData for multipart and object data (file)
    const formData = new FormData();
    formData.append("post[title]", title);
    formData.append("post[body]", body);
    formData.append("post[description]", description);

    if (file) { 
      formData.append("post[coverimg]", file); 
    } 
    
    // If the user removes the image, send a flag
    if (preview === null && id) { 
      formData.append("post[remove_coverimg]", "true"); 
    }
    
    try {
      if (id) {
        await axios.put(`/posts/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("Saved!", "Post updated successfully", "success");
      } else {
        await axios.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("Saved!", "Post created successfully", "success");
      }
      navigate("/post"); 
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
  
  const changeFile = (event) => {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"];
      const maxSize = 20 * 1024 * 1024;
      if (!allowedTypes.includes(selectedFile.type)) {
        showAlert("Invalid File!", "Only JPG, JPEG, PNG, GIF, SVG, and WEBP files are allowed.", "error", "error");
        return;
      }
      if (selectedFile.size > maxSize) {
        showAlert("Invalid File!", "File size must be less than 20MB.", "error", "error");
        return;
      }
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const removeFile = () => {
    showAlert("Remove Photo?", "This photo will be removed and this can't be undone.", "question", "remove").then((result) => {
      if (result.isConfirmed) {
        setFile(null);
        setPreview(null);
  
        // Only reset file input if removal is confirmed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } 
    });
  };
  
  const handleDiscard = (e, title, body) => {
    e.preventDefault();
  
    if (!title && !body) {
      window.location.href = "/post";
      return;
    }
    showAlert("Discard post?", "This can't be undone and you'll lose your draft.", "question", "discard").then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/post";
      }
    });
  };

  return (
    <div className="py-10 px-6 sm:px-10 md:px-20 mt-3">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        {id ? "Edit Article" : "Create New Article"}
      </h1>
      <br />

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-7xl mx-auto">
     
        <div className="flex items-center justify-between w-full mb-4">
          <Link to="/post" onClick={(e) => handleDiscard(e, title, body)} className="flex items-center gap-2 text-black px-3 py-2 rounded-md font-semibold transition">
            <ArrowLongLeftIcon className="h-6 w-6" />
            <span>Back</span>
          </Link>

          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
            {id ? "Update" : "Create"}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
          </div>
        )}
        
        <label className="font-semibold p-2">Cover Image</label>
        <div className="flex flex-col items-center justify-center w-full mb-5 mt-1">
          <label htmlFor="coverimg"
            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={preview} alt="Preview Image" className="w-full h-full object-contain rounded-lg"/>
                <button type="button" className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600" onClick={removeFile}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full max-w-[90%] sm:max-w-md p-4 sm:p-6 rounded-lg">
                <CloudArrowUpIcon className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  SVG, PNG, JPG or GIF (MAX. 20 MB)
                </p>
              </div>
            )}
            <input id="coverimg" type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={changeFile}/>
          </label>
        </div>

        <label className="font-semibold">Title</label>
        <input type="text" placeholder="Title" value={title} className="mb-5 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setTitle(e.target.value)} />

        <label className="font-semibold">Short description</label>
        <input type="text" placeholder="Short description" value={description} className="mb-5 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setDescription(e.target.value)} />

        <div className="flex flex-col gap-4">
          <label className="font-semibold">Body</label>
          <div className="flex gap-3">
            <button className={`px-2 py-1 font-bold ${activeStyles.bold ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={handleFormatClick('bold')} >
              B
            </button>
            <button className={`px-3 py-1 italic ${activeStyles.italic ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}  onClick={handleFormatClick('italic')} >
              I
            </button>
            <button className={`px-2 py-1 underline ${activeStyles.underline ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={handleFormatClick('underline')}  >
              U
            </button>
          </div>
          <div ref={editorRef} contentEditable onInput={handleInput} onKeyUp={updateActiveStyles} onMouseUp={updateActiveStyles}
            className="border border-gray-300 rounded-md p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ minHeight: "300px", maxHeight: "700px", overflowY: "auto", cursor: "text", whiteSpace: "pre-line" }} 
          />
        </div>
      </form>
    </div>
  );
};

export default Form;