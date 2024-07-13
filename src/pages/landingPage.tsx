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
            navigate("/home");
        }
    }, [navigate]);

    const handleExploreClick = () => {
        navigate("/home");
    };

    return (
        <div>
            <div className="container mx-auto text-center items-center justify-center">
                <h1 className="text-4xl font-bold text-white mt-10">Welcome to Doki Watch</h1>
                <p className="text-white mt-4">Explore your favorite anime & manga here.</p>
                <div className="flex justify-center items-center">
                    <button onClick={handleExploreClick} className="text-center mt-6 bg-transparent backdrop-blur-lg text-white border border-gray-700 rounded-lg p-3 font-anime cursor-pointer shadow-md flex hover:bg-blue-600 hover:scale-105 transform transition duration-150 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                        <span>Explore</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;