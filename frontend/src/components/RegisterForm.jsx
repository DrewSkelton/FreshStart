import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import '../styles/RegisterStyle.css';

const RegisterForm = () => {
    // user credentials required to create user-obj
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [_, setCookies] = useCookies(["access_token"]); // save access token as cookie when registering
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3001/register", {username, email, password}) 
        .then(result => {  
        console.log("register-form-result: "+result);
        console.log("register-response-status: "+result.status)
        if (result.status === 201) { 
            alert("Succesfully registered now login");
            navigate("/login");
        }
        })
        .catch(err => {
        if (err.response) {
            if (err.response.status === 400) {
                setError("an error occured registering with these credentials");
                console.log("register-error");
            }
        } 
        });
    }

    return (
        <div className="background">
            <div className="container">
                
                <form onSubmit={handleSubmit}>
                    <h1>New Account</h1>
                    <label>Email</label>
                    <input type="text" placeholder="enter email" onChange={(e) => setEmail(e.target.value)} />

                    <label>Password</label>
                    <input type="password" placeholder="enter password" onChange={(e) => setPassword(e.target.value)} />
                
                    <button type="create">Create Account & Register!</button>
                    <p className= "text-sm text-center mt-4"> Already have an account? {" "}<Link to = "/login" className=''> Log In  </Link> </p>

                </form>
            </div>

            

        </div>
        
    
    )
}

export default RegisterForm;