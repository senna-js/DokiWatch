import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "./components/sidebar"; // Import the Sidebar component

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      // const testac =
      //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJkNDlhNTRiMmE3OTkyNGI5NjA0M2UxN2U1YzA5YTI2ZWYyMGM4MmM5MmU4Y2E1ZmY4MTdkNzMyMTgyNjY0MDYzZjg3YjljOTg5ZTk2YzFiIn0.eyJhdWQiOiIxOTc1MyIsImp0aSI6IjJkNDlhNTRiMmE3OTkyNGI5NjA0M2UxN2U1YzA5YTI2ZWYyMGM4MmM5MmU4Y2E1ZmY4MTdkNzMyMTgyNjY0MDYzZjg3YjljOTg5ZTk2YzFiIiwiaWF0IjoxNzIwMzc0NzEzLCJuYmYiOjE3MjAzNzQ3MTMsImV4cCI6MTc1MTkxMDcxMywic3ViIjoiNjAzMDIyOCIsInNjb3BlcyI6W119.ULB4iev5uk4LWUFZCozkl-x-PzyRYa_l8lb4GlbKaHjDX_wrZNsCf3AcA-UhbaY7ttKmYKGXN8RNI_G6mzvG3p_P-UARnHl5p6l_YCMg63_AFPgw0Dm_JNHzpdeNn_CwraerjWgfKLD1gaq54dssAm3JLRXyQfPDEY07gVKU87gGGK7sUcIS4ScurYVYEDhku-hsqOL3-E-kfcuPubHwBG5Rk-9-ffmSr_EZdlg-IaZ4_vWc-EE3mlMR7c1mQgW7H1CM8MmQpTV4Wc8K91wQFrD2yojbYpkIIFU1ZipYqZA2W1zYc_19S7u82FueYhIv38VBWs3Von8JU3PIxgcU0NROZxGwUIpKGqVyAIZaoTjqZyGux9MnGPLWb5Prw_H8WIADFAUqXybJma5gGhNTd38Nx8DYLQXALGLQOecifkRqO4X5rLZjWyX39JTJKt76--RaQL6-m-rlTtE6qcGVRxOOyXMeudGHiW1BN4qFRP65eA4dW_fAoe3vvFYJrcIRTHbOrgG2YJNH14Ad9tj9dCucuTzEz6gmCOQ74H0UkrmbrhAS4DTVqeW77BCDNXxrnAei4Jn-vYzjz7UAfaYD77-Nc8IgXmcFLaGdq8HknukabzsXIPCBt4Gww5gx09PHns6nzLKrpWPl15at-nGSBGH63B42wLFCsVWukNcJo8s";
      //queryParams.has("access_token")
      if (queryParams.has("access_token")) {
        const accessToken = queryParams.get("access_token");
        console.log("Code:", accessToken);

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
          name: "eshandas",
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
            setProfilePic(data.User.avatar.large);
          }
        } catch (error) {
          console.error("Error fetching AniList profile:", error);
        }
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only on initial load

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
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
