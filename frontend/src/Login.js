import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
    // stores username input
    const [username, setUsername] = useState("");

    // stores password input
    const [password, setPassword] = useState("");

    // used to show error messages
    const [error, setError] = useState("");

    // used to move user to another page after login
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
 

    // runs when login button is clicked
    async function handleLogin() {
        if (!username.trim() || !password.trim()) {
            setError("Please enter your username and password");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:8000/login", {
                username,
                password
            });

            console.log("Login response:", response.data); 
            // Store JWT token and user info
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("userId", response.data.user_id);
            localStorage.setItem("username", response.data.username);
            navigate("/home");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid username or password");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }
 
    function handleKeyDown(e) {
        if (e.key === "Enter") handleLogin();
    }
 
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">stoodie.io</div>
                    <h1>Welcome back</h1>
                    <p>Log in to your study space</p>
                </div>
 
                <div className="auth-form">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
 
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
 
                    {error && <p className="auth-error">{error}</p>}
 
                    <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </div>
 
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    );
}
 
export default Login;