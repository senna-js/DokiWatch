import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Mock authentication check (replace with your actual auth logic)
const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user || '{}');
    const username = userObj.username;
    const accessToken = userObj.access_token;
    console.log(username);
    return Boolean(username) && Boolean(accessToken); // Returns true if a username is found, false otherwise
    // return false;
};

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            // Redirect to the App component if the user is authenticated
            navigate("/");
        }
    }, [navigate]);

    return (
        <div>
            <div className="container mx-auto text-center">
                <h1 className="text-4xl font-bold text-white mt-10">Welcome to Doki Watch</h1>
                <p className="text-white mt-4">Explore your favorite anime & manga here.</p>
                {/* Add more content or a sign-in button here */}
            </div>
        </div>
    );
};

export default LandingPage;