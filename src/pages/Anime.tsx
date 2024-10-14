/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Content from "../components/ReadMore";
import { useAnimeList } from "../AnimeListContext";

export const Anime = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState<any>();
  const [userRating, setUserRating] = useState(0);
  const [relationData, setRelationData] = useState<any[]>([]);
  const { addToWatching, addToCompleted, addToPlanToWatch } = useAnimeList();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddToWatching = () => {
    addToWatching({ id: animeData.mal_id, title: animeData.title, image: animeData.images.jpg.large_image_url, rating: 0 });
    console.log(animeData);
    setDropdownOpen(false);
  };

  const handleAddToCompleted = () => {
    addToCompleted({ id: animeData.mal_id, title: animeData.title, image: animeData.images.jpg.large_image_url, rating: 0 });
    console.log(animeData);
    setDropdownOpen(false);
  };

  const handleAddToPlanToWatch = () => {
    addToPlanToWatch({ id: animeData.mal_id, title: animeData.title, image: animeData.images.jpg.large_image_url, rating: 0 });
    console.log(animeData);
    setDropdownOpen(false);
  };

  const handleTitleClick = (animeId: number) => {
    navigate(`/anime/${animeId}`);
  };

  const handleRating = (ratingValue: number) => {
    setUserRating(ratingValue);
    // Here you can add a function to update the rating in your database or state management system
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    axios
      .get(`https://api.jikan.moe/v4/anime/${params.id}/full`)
      .then((res) => {
        console.log(res.data.data.relations);
        const relation = res.data.data.relations;
        const relationIdList: number[] = [];

        for (let i = 0; i < relation.length; i++) {
          if (
            relation[i].relation === "Sequel" ||
            relation[i].relation === "Prequel"
          ) {
            console.log(relation[i].entry[0].mal_id);
            if (!relationIdList.includes(relation[i].entry[0].mal_id)) {
              relationIdList.push(relation[i].entry[0].mal_id);
            }
          } else {
            console.log(relation[i].relation);
          }
        }

        console.log(relationIdList);

        const fetchRelationData = async () => {
          const relationDataPromises = relationIdList.map((id) =>
            axios.get(`https://api.jikan.moe/v4/anime/${id}`).then((res) => ({
              title: res.data.data.title,
              image: res.data.data.images.jpg.large_image_url,
              id: res.data.data.mal_id,
              title_english: res.data.data.title_english,
            }))
          );

          const relationData = await Promise.all(relationDataPromises);
          setRelationData(relationData);
        };

        fetchRelationData();
        setAnimeData(res.data.data);
      });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [params.id]);

  const handleWatch = () => {
    let cleanTitle = animeData.title;
    cleanTitle = cleanTitle.replace(/"/g, ' ');
    cleanTitle = cleanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleanTitle = cleanTitle.replace(/[^\x00-\x7F]/g, ' ')
    const navString = `/watch/${animeData?.mal_id}?id=${cleanTitle}&ep=1`;
    navigate(navString);
  };

  const handleGenreClick = (e: any) => {
    const genreName = e.target.innerText.toLowerCase();
    const navString = `/search?genre=${genreName}`;
    navigate(navString);
  };

  // console.log("animeData:", animeData);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mx-4 sm:mx-24 my-4 sm:my-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold">
            {animeData?.title_english ||
              animeData?.title ||
              "Title Not Available"}
          </h1>
          <h2 className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold text-gray-500">
            {animeData?.title}
          </h2>
        </div>
        <div className="flex-none w-auto bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 sm:p-4 rounded-lg text-white">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              width="24"
              height="24"
              className="text-yellow-400"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.37 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.782-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <span>{animeData?.score}</span>
          </div>
          <div className="flex justify-center mt-2">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  key={ratingValue}
                  className={
                    ratingValue <= userRating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                  onClick={() => handleRating(ratingValue)}
                >
                  <span className="text-lg leading-none">&#9733;</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative group h-auto">
          <img
            src={animeData?.images.jpg.large_image_url}
            alt={animeData?.title}
            className="rounded-lg shadow-xl mx-auto my-2 h-full w-full object-cover"
          />
          <div
            className="cursor-pointer rounded-lg mx-auto my-2 absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out"
            onClick={handleWatch}
          ></div>
          <div className="text-center">
            <button
              onClick={handleWatch}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity 0.2s ease-in-out" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              WATCH NOW
            </button>
          </div>
        </div>
        <div className="flex mt-3 flex-col gap-4 w-full">
          <div className="flex border border-white items-center text-pretty sm:text-pretty font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 sm:p-4 rounded-lg font-semibold text-sm sm:text-md text-white">
            <Content
              text={animeData?.synopsis
                ?.replace(/\[Written by MAL Rewrite\]/g, "")
                .trim()}
            />
          </div>
          {/* <hr /> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex border border-white flex-col items-start font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-3 sm:p-4 rounded-lg font-semibold text-sm sm:text-md text-white">
              <div className="pb-4 items-center flex gap-2 flex-wrap">
                {animeData?.genres.map((genre: any) => (
                  <span
                    onClick={handleGenreClick}
                    key={genre.mal_id}
                    className="cursor-pointer bg-red-500 border border-white font-poppins bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg hover:border-pink-200 hover:text-pink-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="pb-4 flex gap-2 flex-wrap">
                {animeData?.studios.map((studio: any) => (
                  <span
                    key={studio.mal_id}
                    className="bg-transparent border border-white font-poppins bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg"
                  >
                    {studio.name}
                  </span>
                ))}
                {animeData?.rating && (
                  <span
                    className="bg-black border border-white font-poppins bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg"
                  >
                    {animeData.rating.match(/^(R - 17\+|PG-13|R\+|Rx - Hentai)/)?.[0]}
                  </span>
                )}
              </div>
              <div className="pb-4 flex gap-2 flex-wrap">
                <span className="font-poppins border border-white bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg">
                  Episodes: {animeData?.episodes || "To be decided"}
                </span>
                {animeData?.year && (
                  <span className="font-poppins border border-white bg-green-500 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg">
                    {animeData.year}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="font-poppins border border-white bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg">
                  Duration: {animeData?.duration.replace("per ep", "")}
                </span>
                <span className="font-poppins border border-white bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-lg">
                  {animeData?.status}
                </span>
              </div>
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-transparent backdrop-blur-md text-lg font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                  >
                    +
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="origin-top-left absolute ml-16 bottom-0 mb-2 w-56 rounded-md shadow-lg border border-white bg-black bg-opacity-85 backdrop-filter backdrop-blur-3xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <div
                        role="menuitem"
                        tabIndex={0}
                        onClick={handleAddToWatching}
                        className="block px-4 py-2 text-sm text-white hover:text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                      >
                        Add to Watching
                      </div>
                      <div
                        role="menuitem"
                        tabIndex={0}
                        onClick={handleAddToCompleted}
                        className="block px-4 py-2 text-sm text-white hover:text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                      >
                        Add to Completed
                      </div>
                      <div
                        role="menuitem"
                        tabIndex={0}
                        onClick={handleAddToPlanToWatch}
                        className="block px-4 py-2 text-sm text-white hover:text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                      >
                        Add to Plan to Watch
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex border border-white items-center justify-center font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg font-semibold text-md text-white">
              {relationData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {relationData.map((relation) => (
                    <div
                      key={relation.id}
                      className="relative flex flex-col items-center cursor-pointer group"
                      onClick={() => handleTitleClick(relation.id)}
                    >
                      <img
                        src={relation.image}
                        alt={relation.title}
                        className="rounded-lg bottom-0 shadow-xl w-full h-48 object-cover mb-2"
                      />
                      <div
                        className="rounded-lg absolute top-0 left-0 w-full h-48 bg-black bg-opacity-0 group-hover:backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                        style={{ background: "rgba(0, 0, 0, 0.5)" }}
                      ></div>{" "}
                      {/* Overlay */}
                      <div className="absolute bottom-0 w-full h-full flex items-center">
                        <h3 className="text-center font-semibold text-white w-full p-2 text-sm">
                          {relation.title_english || relation.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Related Seasons Found</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {animeData?.trailer && animeData?.trailer.embed_url ? (
        <div
          className="video-container relative w-full overflow-hidden z-20"
          style={{

            paddingBottom: "56.25%",

          }}
        >
          <iframe
            src={animeData?.trailer.embed_url}
            className="mt-2 absolute top-0 left-0 w-full h-[500px] aspect-video rounded-lg z-20"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-4xl text-center font-poppins">
            No Trailer Available
          </p>
        </div>
      )}
    </div>
  );
};
