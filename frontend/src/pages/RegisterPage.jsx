import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from "react-cookie";
import '../styles/LoginStyle.css';

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check if all fields are filled
        if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
            alert("Please fill in all fields");
            return;
        }

        try {
            // Attempt to register
            const result = await axios.post("http://localhost:3001/register", {
                username,
                email,
                password
            });

            // If registration is successful
            if (result.data) {
                setCookies("access_token", result.data.token);
                window.localStorage.setItem("userID", result.data.userID);
                // Navigate to dashboard after successful registration
                navigate("/layout-dashboard");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join FarmStart and start planning your farm</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            placeholder="Choose a username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Create a password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    
                    <div className="button-group">
                        <button type="submit">Create Account</button>
                    </div>

                    <div className="auth-footer">
                        <p>Already have an account?</p>
                        <button 
                            type="button"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;