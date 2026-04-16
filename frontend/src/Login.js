import axios from "axios";
import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import "./App.css";

function Login(){
    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = () =>{
        axios.post("http://localhost:8000/login",{
            username,
            password
        })
        .then(res=> {
            if(res.data.success){
                navigate("/home");
            } else{
                alert("Invalid login");
            }
        });      
    };

    return(
        <div>
            <h2>Login</h2>
            <input placeholder="Username" onChange={e=> setUsername(e.target.value)}/>

            <input type="password" onChange={e=> setPassword(e.target.value)}/>
            
            <button onClick={login}>Login</button>

            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
