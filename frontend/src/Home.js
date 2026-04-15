import {Link} from "react-router-dom";

function Home(){
    return (
        <div className="home-container">
            <div className="home-card">
                <h1 className="home-title">Stoodie.io</h1>
                <Link to="/login">
                    <button className="home-button login-btn">Login</button>
                </Link>

                <Link to="/register">
                    <button className="home-button register-btn"> Create Account</button>
                </Link>
            </div>
        </div>
    );
}
export default Home;