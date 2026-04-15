import {Link} from "react-router-dom";

function Home(){
    return (
        <div style={{ textAlign: "center", marginTop: "50px"}}>
            <h1>Stoodie.io</h1>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <br /><br />
            <Link to="/register">
                <button>Create Account</button>
            </Link>
        </div>
    );
}
export default Home;