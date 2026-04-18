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

    // runs when login button is clicked
    async function handleLogin() {
        try {
            const response = await axios.post("http://localhost:8000/login", {
                username: username,
                password: password
            });

            if (response.data.success) {
                // save user info so it stays after refresh
                localStorage.setItem("userId", response.data.user_id);
                localStorage.setItem("username", response.data.username);

                // go to home page
                navigate("/home");
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-overlay">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome back</h1>
                        <p>Log in to continue to your study space</p>
                    </div>

                    <div className="auth-form">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-btn" onClick={handleLogin}>
                            Log In
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>
                            Don’t have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;