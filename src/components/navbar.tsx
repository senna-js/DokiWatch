import React, { useEffect, useState } from "react";
import Sidebar from "./sidebarMobile";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignOutButton,
// } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import kofiImage from "../assests/kofi.png";
import coffeeImage from "../assests/Coffee.png";
// import { motion } from "framer-motion";
import { useAnilistContext } from "../AnilistContext";

export const Navbar = () => {
  // const [hoveredKoFi, setHoveredKoFi] = useState(false);
  // const [hoveredCoffee, setHoveredCoffee] = useState(false);
  // const [hoveredDiscord, setHoveredDiscord] = useState(false);
  const { user, authenticate, unAuthenticate, authState } = useAnilistContext();

  const handleKoFiClick = () => {
    window.open("#", "_blank", "noopener,noreferrer");
  };

  const handleCoffeeClick = () => {
    window.open(
      "#",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDiscordClick = () => {
    window.open(
      "#",
      "_blank",
      "noopener,noreferrer"
    );
  };
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isChatBubbleOpen, setIsChatBubbleOpen] = useState(false);

  useEffect(() => {
    if (authState === 'unauthenticated') {
      const chatBubble = sessionStorage.getItem('chatBubble')
      if (chatBubble && chatBubble === 'true')
        return;
      setIsChatBubbleOpen(true);
      sessionStorage.setItem('chatBubble', 'true');
    }
    if (authState === 'authenticated') {
      sessionStorage.removeItem('chatBubble');
    }
  }, [authState])

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
    navigate(`/search?search=${searchTerm}`);
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
      className="w-10 h-10 text-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>) => {
    event.dataTransfer.setData("text/plain", window.location.origin + "/home");
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.ctrlKey || event.metaKey) {
      window.open(window.location.origin + "/home", "_blank");
    } else {
      navigate("/home");
    }
  };

  const handleGroup = () => {
    setIsGroupOpen((prev) => !prev);
  };

  // const handleUsernameChange = (event: any) => {
  //   setUsername(event.target.value);
  //   const user = { username: event.target.value };
  //   localStorage.setItem("user", JSON.stringify(user));
  // };

  return (
    <div
      className="flex justify-between items-center w-full p-2 gap-1
    sm:p-4 bg-doki-purple text-white fixed z-50 sm:h-[109px] h-[67px] "
    >
      <Sidebar /> {/* Render the Sidebar component */}
      <div className="cursor-pointer" role="button" onClick={handleClick}>
        <img
          src="/Navbar_logo.png"
          alt="Doki Watch"
          className="w-[55px] h-[32px] sm:w-28 sm:h-auto cursor-pointer"
          draggable="true"
          onDragStart={handleDragStart}
          onDragOver={(e) => e.preventDefault()} // Prevent default behavior
          onDrop={(e) => e.preventDefault()}
        />
      </div>
      <div className="flex items-center sm:hidden">
        <button
          onClick={() => navigate("/search")}
          className="bg-doki-light-grey text-doki-purple/[.67] text-[15px] 
          rounded-[12px] p-1 font-lato font-bold cursor-pointer
          inline-flex items-center"
        >
          <span className="mx-2 px-auto whitespace-nowrap font-lato">
            Search here...
          </span>
        </button>
      </div>
      <div className="flex-1 hidden mx-2 sm:mx-4 sm:block">
        <div className="relative">
          <input
            className="block w-full pl-4 pr-3 py-2 bg-doki-light-grey rounded-[16px] h-[48px]
             leading-5 placeholder-doki-purple/[.67] font-lato text-[20px]
            focus:bg-doki-white focus:text-gray-900"
            placeholder="Search here..."
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>
      <div
        id="group-buttons-dropdown"
        className="sm:hidden"
        onClick={handleGroup}
      >
        <details className="dropdown">
          <summary
            className="w-[35px] h-[35px] bg-doki-light-grey rounded-[22px]
          flex items-center justify-center"
          >
            <svg
              width="21"
              height="13"
              viewBox="0 0 21 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${isGroupOpen ? "rotate-180 " : ""}`}
            >
              <path
                d="M18 3L10.5 10L3 3"
                stroke="#2F3672"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <ul className="menu dropdown-content bg-doki-dark-grey rounded-full w-auto mt-2.5">
            <li>
              <button
                onClick={handleCoffeeClick}
                className="relative p-0 mb-4 bg-transparent border-none cursor-pointer"
              >
                <img
                  src={coffeeImage}
                  alt="Buy Me a Coffee"
                  className="w-7 h-7"
                />
              </button>
            </li>
            <li>
              <button
                onClick={handleKoFiClick}
                className="relative p-0 mb-4 bg-transparent border-none cursor-pointer"
              >
                <img
                  src={kofiImage}
                  alt="Support Us on Ko-fi"
                  className="w-7"
                />
              </button>
            </li>
            <li>
              <button
                onClick={handleDiscordClick}
                className="relative p-0 mb-4 border-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  viewBox="0 0 512 365.467"
                  className="w-7"
                >
                  <path
                    fill="#2F3672"
                    d="M378.186 365.028s-15.794-18.865-28.956-35.099c57.473-16.232 79.41-51.77 79.41-51.77-17.989 11.846-35.099 20.182-50.454 25.885-21.938 9.213-42.997 14.917-63.617 18.866-42.118 7.898-80.726 5.703-113.631-.438-25.008-4.827-46.506-11.407-64.494-18.867-10.091-3.947-21.059-8.774-32.027-14.917-1.316-.877-2.633-1.316-3.948-2.193-.877-.438-1.316-.878-1.755-.878-7.898-4.388-12.285-7.458-12.285-7.458s21.06 34.659 76.779 51.331c-13.163 16.673-29.395 35.977-29.395 35.977C36.854 362.395 0 299.218 0 299.218 0 159.263 63.177 45.633 63.177 45.633 126.354-1.311 186.022.005 186.022.005l4.388 5.264C111.439 27.645 75.461 62.305 75.461 62.305s9.653-5.265 25.886-12.285c46.945-20.621 84.236-25.885 99.592-27.64 2.633-.439 4.827-.878 7.458-.878 26.763-3.51 57.036-4.387 88.624-.878 41.68 4.826 86.43 17.111 132.058 41.68 0 0-34.66-32.906-109.244-55.281l6.143-7.019s60.105-1.317 122.844 45.628c0 0 63.178 113.631 63.178 253.585 0-.438-36.854 62.739-133.813 65.81l-.001.001zm-43.874-203.133c-25.006 0-44.75 21.498-44.75 48.262 0 26.763 20.182 48.26 44.75 48.26 25.008 0 44.752-21.497 44.752-48.26 0-26.764-20.182-48.262-44.752-48.262zm-160.135 0c-25.008 0-44.751 21.498-44.751 48.262 0 26.763 20.182 48.26 44.751 48.26 25.007 0 44.75-21.497 44.75-48.26.439-26.763-19.742-48.262-44.75-48.262z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </details>
      </div>
      <div
        className="hidden sm:flex sm:justify-evenly sm:gap-7 sm:items-center sm:bg-doki-dark-grey sm:rounded-full sm:pl-4 sm:pr-4 sm:pt-2 sm:pb-2 sm:mr-3"
      >
        <button onClick={handleKoFiClick}>
          <img src={coffeeImage} alt="Buy Me a Coffee" className="w-6 ml-2" />
        </button>
        <button onClick={handleCoffeeClick}>
          <img src={kofiImage} alt="Ko-fi" className="w-10 pt-1" />
        </button>
        <button onClick={handleDiscordClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 365.467"
            className="w-8 h-8 rounded-full text-doki-purple"
          >
            <path
              fill="#2F3672"
              d="M378.186 365.028s-15.794-18.865-28.956-35.099c57.473-16.232 79.41-51.77 79.41-51.77-17.989 11.846-35.099 20.182-50.454 25.885-21.938 9.213-42.997 14.917-63.617 18.866-42.118 7.898-80.726 5.703-113.631-.438-25.008-4.827-46.506-11.407-64.494-18.867-10.091-3.947-21.059-8.774-32.027-14.917-1.316-.877-2.633-1.316-3.948-2.193-.877-.438-1.316-.878-1.755-.878-7.898-4.388-12.285-7.458-12.285-7.458s21.06 34.659 76.779 51.331c-13.163 16.673-29.395 35.977-29.395 35.977C36.854 362.395 0 299.218 0 299.218 0 159.263 63.177 45.633 63.177 45.633 126.354-1.311 186.022.005 186.022.005l4.388 5.264C111.439 27.645 75.461 62.305 75.461 62.305s9.653-5.265 25.886-12.285c46.945-20.621 84.236-25.885 99.592-27.64 2.633-.439 4.827-.878 7.458-.878 26.763-3.51 57.036-4.387 88.624-.878 41.68 4.826 86.43 17.111 132.058 41.68 0 0-34.66-32.906-109.244-55.281l6.143-7.019s60.105-1.317 122.844 45.628c0 0 63.178 113.631 63.178 253.585 0-.438-36.854 62.739-133.813 65.81l-.001.001zm-43.874-203.133c-25.006 0-44.75 21.498-44.75 48.262 0 26.763 20.182 48.26 44.75 48.26 25.008 0 44.752-21.497 44.752-48.26 0-26.764-20.182-48.262-44.752-48.262zm-160.135 0c-25.008 0-44.751 21.498-44.751 48.262 0 26.763 20.182 48.26 44.751 48.26 25.007 0 44.75-21.497 44.75-48.26.439-26.763-19.742-48.262-44.75-48.262z"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {/* <SignedIn> */}
        <div className="relative">
          <div
            role="button"
            onClick={() => setIsChatBubbleOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            {(authState === 'authenticated' && user?.avatar) ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer sm:h-10 sm:w-10"
              />
            ) : (
              <DefaultProfileIcon />
            )}
          </div>
          {(isChatBubbleOpen && authState !== 'loading') && (
            <div className="absolute mt-4 top-12 right-0 bg-doki-dark-grey text-doki-white border border-gray-700 p-4 shadow-lg w-64 font-lato rounded-[12px]">

              <div className="absolute top-[-8px] right-4">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-transparent border-b-doki-dark-grey"></div>
              </div>

              {(authState === "authenticated") ? (
                <>
                  <p className="mb-2 ml-3 text-sm">
                    Connected to Anilist as {user.name}
                  </p>
                  <a
                    onClick={() => {
                      setIsChatBubbleOpen(false)
                      navigate('/user')
                    }}
                    className="mx-3 mb-2 transition duration-150 ease-in-out cursor-pointer text-doki-purple hover:text-doki-light-grey"
                  >
                    Go to Profile &rarr;
                  </a>

                </>

              ) : (
                <p className="mb-2 text-sm">
                  Connect to Anilist to sync your watchlist.
                </p>
              )}
              {(authState === 'authenticated') ? (
                <button
                  onClick={unAuthenticate}
                  className="px-4 py-2 mt-2 text-white transition duration-150 ease-in-out rounded-full bg-doki-purple hover:bg-doki-light-grey hover:text-doki-purple"
                >
                  Disconnect Anilist
                </button>
              ) : (
                <button
                  onClick={authenticate}
                  className="px-4 py-2 text-white transition duration-150 ease-in-out rounded-full bg-doki-purple hover:bg-doki-light-grey hover:text-doki-purple"
                >
                  Connect to Anilist
                </button>

              )}

              <button
                onClick={() => setIsChatBubbleOpen(false)}
                className="mt-2 ml-4 text-sm transition duration-150 ease-in-out text-doki-purple hover:text-doki-light-grey"
              >
                Close
              </button>
            </div>
          )}
        </div>
        {/* <div
            className="text-sm sm:text-sm
          whitespace-nowrap bg-doki-dark-grey text-doki-white 
          border border-gray-700 rounded-[22px] p-2.5 sm:p-3.5 
          font-lato inline-block 
          hover:bg-doki-light-grey hover:text-doki-purple hover:scale-105 transform transition duration-150 ease-in-out cursor-pointer"
          >
            <SignOutButton />
          </div> */}
        {/* </SignedIn> */}

        {/* <SignedOut>
        <div
          className="bg-doki-dark-grey text-doki-white border border-gray-700 rounded-[22px] p-2.5 
          sm:p-3.5 font-lato inline-block 
          hover:bg-doki-light-grey hover:text-doki-purple hover:scale-105 transform transition duration-150 ease-in-out"
        >
          <SignInButton />
        </div>
        </SignedOut> */}
      </div>
    </div>
  );
};
