import axios from "axios";
import {useNavigate, Link} from "react-router-dom";
import{useState} from "react";
import "./Auth.css";

function Register(){
    const [username, setUsername]= useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState (false);
    const navigate = useNavigate();

    async function handleRegister() {
        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await axios.post("https://stoodie-backend.onrender.com/register", { username, password });
            navigate("/login");
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data.detail || "Username already exists");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }
 
    function handleKeyDown(e) {
        if (e.key === "Enter") handleRegister();
    }
 
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">stoodie.io</div>
                    <h1>Create account</h1>
                    <p>Join your study space today</p>
                </div>
 
                <div className="auth-form">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
 
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
 
                    <label>Confirm password</label>
                    <input
                        type="password"
                        placeholder="Repeat your password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
 
                    {error && <p className="auth-error">{error}</p>}
 
                    <button className="auth-btn" onClick={handleRegister} disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </div>
 
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
}
 
export default Register;
