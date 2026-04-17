import axios from "axios";
import {useNavigate} from "react-router-dom";
import{useState} from "react";
import "./Auth.css";

function Register(){
    const [username, setUsername]= useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const register = () => {
        axios.post("http://localhost:8000/register",{
            username,
            password
        })
        .then(() => {
            alert("Account created!");
            navigate("/login");
        })
        .catch(() => alert("Error creating account"))
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <input
                    placeholder = "Username"
                    onChange={e=>setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />

                <button onClick={register}>Register</button>

            </div>
        </div>
    );
};

export default Register;