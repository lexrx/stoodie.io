import axios from "axios";
import {useNavigate} from "react-router-dom";
import{useState} from "react";

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
        <div>
            <h2>Register</h2>
            <input
                placeholder = "Username"
                onChange={e=>setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
            />
            <br />
            <button onClick={register}>Register</button>
        </div>
    );
};

export default Register;