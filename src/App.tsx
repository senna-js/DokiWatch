import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "./components/sidebar"; // Import the Sidebar component

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profilePic, setProfilePic] = useState("");
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("access_token")) {
      const accessToken = queryParams.get("access_token");
      console.log("Code:", accessToken);
      // const requestData = {
      //   grant_type: "authorization_code",
      //   client_id: "19753",
      //   client_secret: "iXrwVRzUZ0uO7oDxYudpLLBAlJtXsK7jXEVyhqKH",
      //   redirect_uri: "https://domainofweeb.netlify.app/",
      //   code: codeValue,
      // };
      // console.log("Request Data:", requestData);
      fetch("https://anilist.co/api/v2/oauth/token", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: "query",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Access Token:", data);
          localStorage.setItem(
            "AccessToken",
            JSON.stringify(data.access_token)
          );
        })
        .catch((error) => {
          console.error("Error fetching access token:", error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchAniListProfile = async () => {
      const query = `
        query {
          User(name: "YOUR_ANILIST_USERNAME")
          {
            avatar {
              large
            }
          }
        }
      `;

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        });

        const { data } = await response.json();
        setProfilePic(data.User.avatar.large);
      } catch (error) {
        console.error("Error fetching AniList profile:", error);
      }
    };

    fetchAniListProfile();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  };

  const executeSearch = () => {
    console.log("Searching for:", searchTerm);
    // Implement your search logic here

    // Clear the search term state after executing the search
    setSearchTerm("");
  };

  // Define the SVG component
  const DefaultProfileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-10 w-10 text-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Sidebar /> {/* Render the Sidebar component */}
      <div className="text-lg font-bold">Doki Watch</div>
      <div className="flex-1 mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md leading-5 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search for anime..."
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>
      <div className="flex items-center">
        {profilePic ? (
          <img
            className="h-10 w-10 rounded-full"
            src={profilePic}
            alt="Profile"
          />
        ) : (
          <DefaultProfileIcon /> // Use the SVG component as fallback
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold">Welcome to Doki Watch</h1>
        <p className="mt-2">Explore your favorite anime & manga here.</p>
      </div>
    </div>
  );
};

export default App;
