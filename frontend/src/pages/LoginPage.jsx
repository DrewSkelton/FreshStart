import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from "react-cookie";
import '../styles/LoginStyle.css';
import FreshStartLogo from '../styles/Images/FreshStart.png';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submit clicked", { email, password });
        
        // Only navigate if both fields are filled
        if (email.trim() !== "" && password.trim() !== "") {
            console.log("Fields are filled, navigating...");
            navigate("/layout-dashboard");
            
            // Optional: You can still try the API call after navigation
            try {
                const result = await axios.post("http://localhost:3001/login", {email, password});
                setCookies("access_token", result.data.token);
                window.localStorage.setItem("userID", result.data.userID);
            } catch (error) {
                console.error("Login API error:", error);
            }
        } else {
            console.log("Fields are empty");
        }
    };

    return (
        <div className="auth-page">
            <div className="logo-section">
                <img src={FreshStartLogo} alt="FreshStart Logo" className="login-logo" />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to FarmStart</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="button-group">
                        <button type="submit">Sign In</button>
                    </div>

                    <div className="auth-footer">
                        <p>Don't have an account?</p>
                        <button 
                            type="button"
                            onClick={() => navigate('/register')}
                        >
                            Create an Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;