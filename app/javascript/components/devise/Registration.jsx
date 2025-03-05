import React, { useState, useEffect }  from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import showAlert from "../Alert";

const Registration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setconfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [firstNameErrors, setfirstNameErrors] = useState([]);
  const [lastNameErrors, setlastNameErrors] = useState([]);
  const [birthdayErrors, setbirthdayErrors] = useState([]);
  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmationPasswordErrors, setConfirmationPasswordErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setfirstNameErrors([]);
    setlastNameErrors([]);
    setEmailErrors([]);
    setPasswordErrors([]);
    setConfirmationPasswordErrors([]);

    try {
        await axios.post("/users", { user: { first_name, last_name, birthday, email, password, password_confirmation } });
        showAlert("Registered!", "Account created successfully", "success", "save");
        navigate("/login");
    } catch (error) {
      // if theres an error it will set the errors and show it after submit
      if (error.response && error.response.data.errors) {
        showAlert("Error Registration!", "Please check all the information", "error");
        const firstNameErrors = error.response.data.errors.filter(err => err.toLowerCase().includes("first name"));
        setfirstNameErrors(firstNameErrors);

        const lastNameErrors = error.response.data.errors.filter(err => err.toLowerCase().includes("last name"));
        setlastNameErrors(lastNameErrors);

        const birthdayErrors = error.response.data.errors.filter(err => err.toLowerCase().includes("date of birth"));
        setbirthdayErrors(birthdayErrors);

        const emailErrors = error.response.data.errors.filter(err => err.toLowerCase().includes("email"));
        setEmailErrors(emailErrors);

        const passwordErrors = error.response.data.errors.filter( err => err.toLowerCase().includes("password") && !err.toLowerCase().includes("password confirmation"));
        setPasswordErrors(passwordErrors);

        const confirmationPasswordErrors = error.response.data.errors.filter(err => err.toLowerCase().includes("password confirmation"));
        setConfirmationPasswordErrors(confirmationPasswordErrors);
        console.log(error.response.data);
      } else {  
        console.error("Error submitting post:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] ">
     
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create an Account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
        { /* if there is an error it iterates over it */ }
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> First Name </label>
              <input type="text" placeholder="First Name" value={first_name} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setFirstName(e.target.value)}/>
                {firstNameErrors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1"> {firstNameErrors.map((err, index) => ( <p key={index}>{err}</p> ))} </div>
                )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Last Name </label>
              <input type="text" placeholder="Last Name" value={last_name} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setLastName(e.target.value)} />
                {lastNameErrors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1"> {lastNameErrors.map((err, index) => ( <p key={index}>{err}</p> ))} </div>
                )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Date of Birth </label>
            <input type="date" value={birthday} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              onChange={(e) => setBirthday(e.target.value)} />
              {birthdayErrors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1"> {birthdayErrors.map((err, index) => ( <p key={index}>{err}</p> ))} </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Email </label>
            <input type="email" placeholder="Email" value={email} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              onChange={(e) => setEmail(e.target.value)} />
              {emailErrors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1"> {emailErrors.map((err, index) => ( <p key={index}>{err}</p> ))} </div>
              )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Password </label>
              <input type="password" placeholder="Password" value={password} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setPassword(e.target.value)}/>
                {passwordErrors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1"> {passwordErrors.map((err, index) => ( <p key={index}>{err}</p> ))} </div>
                )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-white"> Confirm Password </label>
              <input type="password" placeholder="Confirm Password" value={password_confirmation} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setconfirmPassword(e.target.value)} />
                {confirmationPasswordErrors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1"> {confirmationPasswordErrors.map((err, index) => ( <p key={index}>{err}</p> ))} </div>
                )}
            </div>
          </div>

          <button  type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-900">
            Register Account
          </button>

          
          <p className="text-gray-600 text-sm mt-4 text-center"> Already have an account?{" "}
             <Link to="/login" className="text-blue-500 hover:underline font-medium"> Login </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
