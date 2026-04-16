import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Notes from "./Notes";
import './App.css';

function App(){
    return(
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register />}/>
                    <Route path="/notes" element={<Notes />}/>
            </Routes>
            </div>
            
        </Router>
    );
}

export default App;