import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "./sidebar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";
import { useAnimeContext } from "../AnimeContext"; // Import the context
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const { setTriggerFetch } = useAnimeContext(); // Use the context

  const getAccessTokenFromHash = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get("access_token");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("fetch user data is called");
      var accessToken = getAccessTokenFromHash();
      let username: string | undefined;

      const user = localStorage.getItem("user");
      if (user) {
        const userobj = JSON.parse(user);
        username = userobj.username;
        if (!accessToken) {
          accessToken = userobj.access_token;
        }
      } else {
        console.log("No user found in localstorage");
        return;
      }

      if (accessToken) {
        console.log("Access Token:", accessToken);
        const query = `
          query ($name: String) {
            User(name: $name) {
              id
              name
              avatar {
                large
              }
            }
          }
        `;

        const variables = {
          name: username as string,
        };

        try {
          const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
            },
            body: JSON.stringify({
              query,
              variables,
            }),
          });

          const { data } = await response.json();
          console.log(data);

          if (data && data.User && data.User.avatar) {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user["avatar"] = data.User.avatar.large;
            localStorage.setItem("user", JSON.stringify(user));
            setProfilePic(data.User.avatar.large);

            // Update anime data in the context
            setTriggerFetch(true);
          }
        } catch (error) {
          console.error("Error fetching AniList profile:", error);
        }
      }
    };

    fetchUserData();
  }, []); // Run only once after the initial render

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
    navigate(`/search/${searchTerm}`);
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
      <div></div>
      <div className="flex gap-4 items-center">
        <SignedIn>
          <div>
            {profilePic ? (
              <img
                src={profilePic || ""}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <DefaultProfileIcon />
            )}
          </div>
          <div className="bg-pink-300 text-white border-2 border-black rounded-lg p-2.5 font-anime font-bold cursor-pointer shadow-md inline-block hover:bg-pink-400 hover:scale-105 transform transition duration-150 ease-in-out">
            <SignOutButton />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="bg-pink-300 text-white border-2 border-black rounded-lg p-2.5 font-anime font-bold cursor-pointer shadow-md inline-block hover:bg-pink-400 hover:scale-105 transform transition duration-150 ease-in-out">
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    </div>
  );
};
