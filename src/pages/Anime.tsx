/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Content from "../components/ReadMore";
import { useAnimeList } from "../AnimeListContext";
import { Tooltip, Zoom } from "@mui/material";
import CharacterCard from "../components/CharacterCard";
interface CharacterData {
  mal_id: number | null | undefined;
  characterName: string;
  role: string;
  characterImage: string;
  characterUrl: string; // Added character URL
  staffName: string | null;
  staffImage: string | null;
  staffUrl: string | null; // Added staff URL
}
export const Anime = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState<any>();
  // const [userRating, setUserRating] = useState(0);
  const [relationData, setRelationData] = useState<any[]>([]);
  const { addToWatching, addToCompleted, addToPlanToWatch } = useAnimeList();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [charAndStaffData, setCharAndStaffData] = useState<CharacterData[]>([]);
  const handleAddToWatching = () => {
    addToWatching({
      id: animeData.mal_id,
      title: animeData.title,
      image: animeData.images.jpg.large_image_url,
      rating: 0,
    });
    console.log(animeData);
    setDropdownOpen(false);
  };

  const handleAddToCompleted = () => {
    addToCompleted({
      id: animeData.mal_id,
      title: animeData.title,
      image: animeData.images.jpg.large_image_url,
      rating: 0,
    });
    console.log(animeData);
    setDropdownOpen(false);
  };

  const handleAddToPlanToWatch = () => {
    addToPlanToWatch({
      id: animeData.mal_id,
      title: animeData.title,
      image: animeData.images.jpg.large_image_url,
      rating: 0,
    });
    console.log(animeData);
    setDropdownOpen(false);
  };

  const handleTitleClick = (animeId: number) => {
    navigate(`/anime/${animeId}`);
  };

  // const handleRating = (ratingValue: number) => {
  //   setUserRating(ratingValue);
  //   // Here you can add a function to update the rating in your database or state management system
  // };
  const listRef = useRef<HTMLDivElement | null>(null); // Reference to the scrollable div
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };
  const handleScrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        top: -listRef.current.clientHeight / 2, // Scroll by the height of 1 card
        behavior: "smooth",
      });
    }
  };

  const handleScrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        top: listRef.current.clientHeight / 2, // Scroll by the height of 1 card
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    axios
      .get(`https://api.jikan.moe/v4/anime/${params.id}/full`)
      .then((res) => {
        // console.log(res.data.data.relations);
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
              relation: res.data.data.relations,
            }))
          );

          const relationData = await Promise.all(relationDataPromises);
          setRelationData(relationData);
          console.log(`RELATION DATA:${relationData}`);
        };

        fetchRelationData();
        setAnimeData(res.data.data);
      });
    axios
      .get(`https://api.jikan.moe/v4/anime/${params.id}/characters`)
      .then((res) => {
        console.log(res.data.data);
        const charactersData = res.data.data.map(
          (characterData: {
            character: any;
            voice_actors: any[];
            role: any;
          }) => {
            const character = characterData.character;
            const voiceActor = characterData.voice_actors[0]; // Get the JP voice actor

            return {
              characterName: character.name,
              mal_id: character.mal_id,
              role: characterData.role,
              characterImage: character.images.webp.image_url,
              characterUrl: character.url, // Added character URL
              staffName: voiceActor ? voiceActor.person.name : null,
              staffImage: voiceActor
                ? voiceActor.person.images.jpg.image_url
                : null,
              staffUrl: voiceActor ? voiceActor.person.url : null, // Added staff URL
            };
          }
        );
        setCharAndStaffData(charactersData);
        // console.log(JSON.stringify(charactersData, null, 2));
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
      });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [params.id]);

  const handleWatch = () => {
    let cleanTitle = animeData.title;
    cleanTitle = cleanTitle.replace(/"/g, " ");
    cleanTitle = cleanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleanTitle = cleanTitle.replace(/[^\x00-\x7F]/g, " ");
    const navString = `/watch/${animeData?.mal_id}?id=${cleanTitle}&ep=1`;
    navigate(navString);
  };

  const handleGenreClick = (e: any) => {
    const genreName = e.target.innerText.toLowerCase();
    const navString = `/search?genre=${genreName}`;
    navigate(navString);
  };

  return (
    <div className="relative flex flex-col gap-4 sm:gap-6 mx-4 sm:mx-[150px] my-4 sm:my-6">
      <div
        className="relative flex flex-col sm:flex-row sm:items-center items-start 
	  justify-between gap-2"
      >
        <div>
          <h1 className="text-5xl sm:text-7xl font-hpSimplifiedbold flex">
            {animeData?.title_english ||
              animeData?.title ||
              "Title Not Available"}
          </h1>
          <h2 className="mt-1 sm:mt-2 sm:text-[27px] font-hpSimplifiedbold text-doki-light-grey">
            {animeData?.title}
          </h2>
        </div>
        {/*Commented out rating*/
        /* <div className="flex-none w-auto bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 sm:p-4 rounded-lg text-white">
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
        </div> */}
      </div>
      <hr className="bg-doki-light-grey rounded-md h-[4px] border-0" />
      <div className="flex flex-col md:flex-row gap-4 bg-doki-light-grey rounded-[22px] p-3 pb-0">
        <div className="relative group h-auto mb-3">
          <img
            src={animeData?.images.jpg.large_image_url}
            alt={animeData?.title}
            className="rounded-[22px] shadow-xl mx-auto h-full w-full 
			object-cover border-doki-purple border-[4px]"
          />
          <div
            className="cursor-pointer rounded-lg absolute top-0 left-0 w-full h-full
			 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 
			 ease-in-out"
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
        <div className="flex mt-3 flex-col w-full justify-between">
          <div
            className="flex items-center font-lato p-2 
		  sm:p-4 text-sm sm:text-lg text-justify text-doki-purple"
          >
            <Content
              text={animeData?.synopsis
                ?.replace(/\[Written by MAL Rewrite\]/g, "")
                .trim()}
            />
          </div>
          {/* Ankit ekhane dekhbi */}
          <div className="h-auto">
            <hr className="bg-doki-purple rounded-md h-[4px] border-0" />
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className="flex border-doki-purple sm:border-4 sm:border-l-0 sm:border-b-0 sm:border-t-0  flex-col 
			items-start font-lato p-3 sm:p-4 font-semibold text-sm sm:text-md "
              >
                <div className="pb-4 items-center flex gap-2 flex-wrap">
                  {animeData?.genres.map((genre: any) => (
                    <span
                      onClick={handleGenreClick}
                      key={genre.mal_id}
                      className="cursor-pointer bg-doki-dark-grey font-lato text-doki-white 
					px-2 py-1 rounded-full hover:bg-doki-white hover:text-doki-purple"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <div className="pb-4 flex gap-2 flex-wrap">
                  {animeData?.studios.map((studio: any) => (
                    <span
                      key={studio.mal_id}
                      className="bg-doki-white font-lato text-doki-purple px-2 py-1 rounded-full"
                    >
                      {studio.name}
                    </span>
                  ))}
                  {animeData?.rating && (
                    <span className="bg-doki-white font-lato text-doki-purple px-2 py-1 rounded-full">
                      {
                        animeData.rating.match(
                          /^(R - 17\+|PG-13|R\+|Rx - Hentai|PG - Children)/
                        )?.[0]
                      }
                    </span>
                  )}
                </div>
                <div className="pb-4 flex gap-2 flex-wrap">
                  <span className="font-lato bg-doki-white text-doki-purple px-2 py-1 rounded-full">
                    Episodes: {animeData?.episodes || "To be decided"}
                  </span>
                  {animeData?.year && (
                    <span className="font-lato bg-doki-white  text-doki-purple px-2 py-1 rounded-full">
                      {animeData.year}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-lato text-doki-purple bg-doki-white px-2 py-1 rounded-full">
                    Duration: {animeData?.duration.replace("per ep", "")}
                  </span>
                  <span className="font-lato text-doki-purple bg-doki-white px-2 py-1 rounded-full">
                    {animeData?.status}
                  </span>
                </div>
                <div
                  className="relative mt-4 flex gap-6 text-center text-doki-white
				 bg-doki-dark-grey px-4 py-1 rounded-full hover:bg-doki-white 
				 hover:text-doki-purple"
                  ref={dropdownRef}
                >
                  <button
                    className="text-doki-purple text[13px] sm:text[21px] md:text-[34px] 
				  flex items-center"
                    onClick={handleWatch}
                  >
                    WATCH NOW
                  </button>
                  <div>
                    <Tooltip
                      TransitionComponent={Zoom}
                      placement="right"
                      arrow
                      title={
                        <>
                          <h3>Add to Anilist</h3>
                        </>
                      }
                    >
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="inline-flex justify-center w-full rounded-full
					  bg-doki-light-grey 
					  shadow-sm px-2 py-2"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 3V21"
                            stroke="#2F3672"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M3 12L21 12"
                            stroke="#2F3672"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                  {dropdownOpen && (
                    <div
                      className="origin-top-right absolute ml-40 sm:ml-[295px] bottom-0 
				  mb-2 w-36 sm:w-56 rounded-md shadow-lg border-2 border-doki-purple bg-transparent 
				  bg-opacity-85 backdrop-filter backdrop-blur-3xl ring-1 ring-black 
				  ring-opacity-5 focus:outline-none z-50"
                    >
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div
                          role="menuitem"
                          tabIndex={0}
                          onClick={handleAddToWatching}
                          className="block px-4 py-2 font-lato text-sm text-doki-white 
						hover:text-doki-purple hover:bg-doki-white w-full text-left 
						cursor-pointer"
                        >
                          Add to Watching
                        </div>
                        <div
                          role="menuitem"
                          tabIndex={0}
                          onClick={handleAddToCompleted}
                          className="block px-4 py-2 text-sm
						 text-doki-white hover:text-doki-purple hover:bg-doki-white 
						 w-full text-left font-lato cursor-pointer"
                        >
                          Add to Completed
                        </div>
                        <div
                          role="menuitem"
                          tabIndex={0}
                          onClick={handleAddToPlanToWatch}
                          className="block px-4 py-2 text-sm
						 text-doki-white hover:text-doki-purple hover:bg-doki-white 
						 w-full text-left cursor-pointer"
                        >
                          Add to Plan to Watch
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="flex items-center justify-center 
			font-lato p-4 text-md text-doki-purple text-[30px]"
              >
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
      </div>
      <div
        id="this-div-is-for-lower-section"
        className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5"
      >
        <div
          id="this-div-is-for-trailer"
          className="bg-doki-light-grey p-3 sm:p-8 sm:pt-5 rounded-[22px] sm:col-span-2"
        >
          <h1 className="text-doki-purple font-lato text-4xl">Watch Trailer</h1>
          <hr className="bg-doki-purple rounded-md h-[3px] border-0 mb-3 mt-2 sm:mb-7" />
          {animeData?.trailer && animeData?.trailer.embed_url ? (
            <div className="relative flex justify-center items-center pb-2">
              <iframe
                src={`${animeData?.trailer.embed_url}?autoplay=0`}
                className="rounded-[22px] border-doki-light-grey border-2"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-4xl text-center font-lato text-doki-white">
                No Trailer Available
              </p>
            </div>
          )}
        </div>
        <div
          id="this-div-is-for-VA&staff"
          className="bg-doki-light-grey pt-3 sm:pb-0 sm:pt-5 rounded-[22px]"
        >
          <h1 className="text-doki-purple font-lato text-4xl mx-3 sm:mx-8">
            Characters
          </h1>
          <hr
            className="bg-doki-purple rounded-md h-[3px] border-0 mb-3 mt-2
           sm:mb-5 mx-3 sm:mx-8"
          />
          <div className="flex flex-col items-center">
            {/* Scrollable card list */}
            <div
              className="w-full max-h-[550px]
              relative overflow-y-auto overflow-x-hidden p-8 pt-0
              flex flex-col items-center"
              ref={listRef}
            >
              {charAndStaffData.map((item) => (
                <CharacterCard
                  key={item.mal_id} // Unique key for each card
                  characterName={item.characterName}
                  role={item.role}
                  characterImage={item.characterImage}
                  characterUrl={item.characterUrl}
                  staffName={item.staffName}
                  staffImage={item.staffImage}
                  staffUrl={item.staffUrl}
                  mal_id={0}
                />
              ))}
            </div>
            {/* Navigation buttons */}
            <div className="flex justify-between w-full mt-4 gap-1">
              <button
                className="bg-doki-dark-grey text-doki-purple flex justify-center
                items-center
                p-2 w-1/2 hover:bg-doki-white rounded-bl-[22px]"
                onClick={handleScrollUp}
              >
                <svg
                  width="47"
                  height="27"
                  viewBox="0 0 52 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M45 25L26 7L7 25"
                    stroke="#2F3672"
                    stroke-width="9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                className="bg-doki-dark-grey p-2 w-1/2 flex justify-center items-center
                 text-doki-purple rounded-br-[22px] hover:bg-doki-white"
                onClick={handleScrollDown}
              >
                <svg
                  width="47"
                  height="27"
                  viewBox="0 0 52 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M45 7L26 25L7 7"
                    stroke="#2F3672"
                    stroke-width="9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
