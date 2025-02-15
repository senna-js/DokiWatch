/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Content from "../components/ReadMore";
// import { useAnimeList } from "../AnimeListContext";
import { Tooltip, Zoom } from "@mui/material";
import CharacterCard from "../components/CharacterCard";
import { useAnilistContext, MediaListStatus, anilistQuery } from "../AnilistContext";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [charAndStaffData, setCharAndStaffData] = useState<CharacterData[]>([]);
  const { addToList, authState, authenticate } = useAnilistContext();
  const [anilistId, setAnilistId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAddToList = (status: MediaListStatus) => {
    if (anilistId) {
      addToList(anilistId, status);
      setDialogOpen(false);
      console.log("Added to list", anilistId, status);
    }
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
    setLoading(true);
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
        setLoading(false);
      });
    const query = `query($id:Int){
        Media(idMal: $id,type:ANIME) {
                        id
    }}`;
    const variables = { id: parseInt(params.id || "0") };
    anilistQuery(query, variables, undefined, [variables.id]).then((response) => {
      const data = response.data.Media;
      setAnilistId(data.id);
      // data.alID = data.id;
      const query = `
            query($id: Int) {
              Media(id: $id) {
                id
                characters(page: 1, sort: [ROLE, RELEVANCE, ID]) {
                  edges {
                    id
                    role
                    voiceActorRoles(sort: [RELEVANCE, ID], language: JAPANESE) {
                      voiceActor {
                        id
                        name {
                          userPreferred
                        }
                        image {
                          large
                        }
                        siteUrl
                      }
                    }
                    node {
                      id
                      name {
                        userPreferred
                      }
                      image {
                        large
                      }
                      siteUrl
                    }
                  }
                }
              }
            }
        `;

      // Define query variables
      const variables = { id: parseInt(data.id) };

      // Make the API request using axios
      anilistQuery(query, variables,undefined,[variables.id]).then((response) => {
        console.log(response.data);
        const charactersData = response.data.Media.characters.edges.map(
          (characterData: {
            node: any;
            voiceActorRoles: string | any[];
            role: any;
          }) => {
            const character = characterData.node;
            const voiceActor =
              characterData.voiceActorRoles.length > 0
                ? characterData.voiceActorRoles[0].voiceActor
                : null;

            return {
              characterName: character.name.userPreferred,
              mal_id: character.id,
              role: characterData.role,
              characterImage: character.image.large,
              characterUrl: character.siteUrl,
              staffName: voiceActor
                ? voiceActor.name.userPreferred
                : null,
              staffImage: voiceActor ? voiceActor.image.large : null,
              staffUrl: voiceActor ? voiceActor.siteUrl : null,
            };
          }
        );
        console.log(charactersData);
        // Set the formatted data (assuming setCharAndStaffData is a function that saves it)
        setCharAndStaffData(charactersData);
      }).catch((error) => {
        console.error("Error fetching data:", error);
      });
    });

    // axios
    //   .get(`https://api.jikan.moe/v4/anime/${params.id}/characters`)
    //   .then((res) => {
    //     console.log(res.data.data);
    //     const charactersData = res.data.data.map(
    //       (characterData: {
    //         character: any;
    //         voice_actors: any[];
    //         role: any;
    //       }) => {
    //         const character = characterData.character;
    //         const voiceActor = characterData.voice_actors[0]; // Get the JP voice actor

    //         return {
    //           characterName: character.name,
    //           mal_id: character.mal_id,
    //           role: characterData.role,
    //           characterImage: character.images.webp.image_url,
    //           characterUrl: character.url, // Added character URL
    //           staffName: voiceActor ? voiceActor.person.name : null,
    //           staffImage: voiceActor
    //             ? voiceActor.person.images.jpg.image_url
    //             : null,
    //           staffUrl: voiceActor ? voiceActor.person.url : null, // Added staff URL
    //         };
    //       }
    //     );
    //     setCharAndStaffData(charactersData);
    //     // console.log(JSON.stringify(charactersData, null, 2));
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching characters:", error);
    //   });
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
    <div className="relative flex flex-col gap-4 lg:gap-6 mx-4 lg:mx-[150px] my-4 lg:my-6">
      {loading ? (
        // Loading skeletons using Daisy UI
        <div className="animate-pulse flex flex-col gap-4">
          {/* Skeleton for Title */}
          <div className="h-10 bg-doki-light-grey rounded-[12px] w-3/4"></div>

          {/* Skeleton for Image and Details */}
          <div className="flex flex-col md:flex-row gap-4 bg-doki-light-grey p-3 rounded-[22px]">
            {/* Image Skeleton */}
            <div className="w-full md:w-1/3 h-64 bg-doki-dark-grey rounded-[22px]"></div>

            {/* Details Skeleton */}
            <div className="flex flex-col w-full gap-2">
              {/* Line skeletons */}
              <div className="h-6 bg-doki-dark-grey rounded w-1/2"></div>
              <div className="h-4 bg-doki-dark-grey rounded w-3/4"></div>
              <div className="h-4 bg-doki-dark-grey rounded w-full"></div>
              <div className="h-4 bg-doki-dark-grey rounded w-2/3"></div>
            </div>
          </div>
          {/* Skeleton for Trailer and Characters Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-5">
            {/* Trailer Skeleton */}
            <div className="bg-doki-light-grey p-3 lg:p-8 lg:pt-5 rounded-[22px] lg:col-span-2 h-64"></div>

            {/* Characters Skeleton */}
            <div className="bg-doki-light-grey pt-3 lg:pb-0 lg:pt-5 rounded-[22px] h-64"></div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="relative flex flex-col lg:flex-row lg:items-center items-start 
	  justify-between gap-2"
          >
            <div>
              <h1 className="text-5xl lg:text-7xl font-hpSimplifiedbold flex">
                {animeData?.title_english ||
                  animeData?.title ||
                  "Title Not Available"}
              </h1>
              <h2 className="mt-1 lg:mt-2 lg:text-[27px] font-hpSimplifiedbold text-doki-light-grey">
                {animeData?.title}
              </h2>
            </div>
            {/*Commented out rating*/
        /* <div className="flex-none w-auto bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 lg:p-4 rounded-lg text-white">
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
                className="rounded-[22px] shadow-xl mx-auto lg:h-full lg:w-full 
			object-cover border-doki-purple border-[4px] md:h-4/5 md:mt-10 lg:mt-0"
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
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 
              -translate-y-1/2 opacity-0 group-hover:opacity-100"
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
		  lg:p-4 text-sm lg:text-lg text-justify text-doki-purple"
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
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div
                    className="flex border-doki-purple lg:border-4 lg:border-l-0 lg:border-b-0 lg:border-t-0  flex-col 
			items-start font-lato p-3 lg:p-4 font-semibold text-sm lg:text-md "
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
                              /^(R - 17\+|PG-13|R\+|Rx - Hentai|PG - Children|G - All Ages)/
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
                      className="relative mt-4 flex gap-4 text-center text-doki-white
				 bg-doki-dark-grey px-4 pr-1 py-1 rounded-full hover:bg-doki-white 
				 hover:text-doki-purple"
                      ref={dropdownRef}
                    >
                      <button
                        className="text-doki-purple text[13px] lg:text[21px] xl:text-[30px] 2xl:text-34px
				  flex items-center"
                        onClick={handleWatch}
                      >
                        WATCH NOW
                      </button>
                      <div>
                        <Tooltip
                          TransitionComponent={Zoom}
                          placement="bottom"
                          arrow
                          title={
                            <>
                              <h3>Add to Anilist</h3>
                            </>
                          }
                        >
                          <button
                            onClick={() => setDialogOpen(!dialogOpen)}
                            className="inline-flex justify-center w-full rounded-full
					  bg-doki-light-grey 
					  shadow-sm px-2 py-2 hover:rotate-90  duration-300"
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

                      {dialogOpen && (
                        <div className="z-10 origin-top-right absolute 
                        ml-[50px] md:ml-[170px] xl:ml-[275px]
                       bottom-0 mb-14 md:mb-2 xl:mb-2 w-38 lg:w-56 bg-doki-dark-grey rounded-[12px]">
                          {authState === 'loading' && (
                            <p className="px-2 py-2 font-lato text-sm cursor-pointer">Loading...</p>
                          )}
                          {authState === 'unauthenticated' && (
                            <button className="block px-2 py-2 font-lato text-sm text-doki-white 
                        hover:text-doki-dark-grey hover:bg-doki-white hover:rounded-[12px] w-full text-center 
                        cursor-pointer" onClick={authenticate}>Connect to AniList</button>
                          )}
                          {authState === 'authenticated' && (
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <div
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => handleAddToList('CURRENT')}
                                className="block px-4 py-2 font-lato text-sm text-doki-white 
						hover:text-doki-dark-grey hover:bg-doki-white w-full text-left 
						cursor-pointer hover:rounded-t-[12px]"
                              >
                                Add to Watching
                              </div>
                              <div
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => handleAddToList('COMPLETED')}
                                className="block px-4 py-2 text-sm
						 text-doki-white hover:text-doki-dark-grey hover:bg-doki-white 
						 w-full text-left font-lato cursor-pointer"
                              >
                                Add to Completed
                              </div>
                              <div
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => handleAddToList('PLANNING')}
                                className="block px-4 py-2 text-sm
						 text-doki-white hover:text-doki-dark-grey hover:bg-doki-white 
						 w-full text-left cursor-pointer whitespace-nowrap font-lato"
                              >
                                Add to Plan to Watch
                              </div>
                              <div
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => handleAddToList('DROPPED')}
                                className="block px-4 py-2 text-sm
						 text-doki-white hover:text-doki-dark-grey hover:bg-doki-white 
						 w-full text-left font-lato cursor-pointer hover:rounded-b-[12px]"
                              >
                                Add to Dropped
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center 
			font-lato p-4 text-md text-doki-purple text-[30px]"
                  >
                    {relationData.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-5"
          >
            <div
              id="this-div-is-for-trailer"
              className="bg-doki-light-grey p-3 lg:p-8 lg:pt-5 rounded-[22px] lg:col-span-2"
            >
              <h1 className="text-doki-purple font-lato text-4xl">Watch Trailer</h1>
              <hr className="bg-doki-purple rounded-md h-[3px] border-0 mb-3 mt-2 lg:mb-7" />
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
                <div className="flex justify-center items-center lg:h-full">
                  <p className="text-4xl text-center font-lato text-doki-white">
                    No Trailer Available
                  </p>
                </div>
              )}
            </div>
            <div
              id="this-div-is-for-VA&staff"
              className="bg-doki-light-grey pt-3 lg:pb-0 lg:pt-5 rounded-[22px]"
            >
              <h1 className="text-doki-purple font-lato text-4xl mx-3 lg:mx-8">
                Characters
              </h1>
              <hr
                className="bg-doki-purple rounded-md h-[3px] border-0 mb-3 mt-2
           lg:mb-5 mx-3 lg:mx-8"
              />
              <div className="flex flex-col items-center">
                {/* Scrollable card list */}
                <div
                  className="w-full max-h-[550px]
              relative overflow-y-auto overflow-x-hidden p-4 pt-0
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
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
