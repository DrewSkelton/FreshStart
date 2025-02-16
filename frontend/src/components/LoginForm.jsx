import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useCookies } from "react-cookie";
import '../styles/LoginStyle.css'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/login", {email, password});
      console.log("login-form result data: " + result.data.message);
      // save the return access-token from request in cookies
      setCookies("access_token", result.data.token);
      // user user-id that logged inside local-storage, the current-user
      window.localStorage.setItem("userID", result.data.userID); 
      navigate("/");
    } catch (error) {
      console.error(error.response.data.message);  // either emial/passwor dincorrect will be the message.
    }
  };

  return (
    <div className="background">
      <div className="container">
        <form onSubmit={handleSubmit}>

          <h1>Log In</h1>
          
          <label >Email</label>
          <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)}/>
          
          
          <label >Password</label>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          
          
          <button type="submit">Log In</button>
          <p className= "text-sm text-center mt-4"> Don't have an account?{" "}<Link to = "/register" className=''> Create an Account </Link> </p>



          
        </form>
          
      </div>
    </div>
  )
}

export default LoginForm;