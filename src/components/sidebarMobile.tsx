import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    IconButton,
    Tooltip,
    Stack,
} from "@mui/material";
import {
    AddLink as LinkIcon,
    Home as HomeIcon,
    // CollectionsBookmark as MangaIcon,
    Schedule as ScheduleIcon,
    Search as SearchIcon,
    ContentPasteSearch as TraceIcon,
    Feed as FeedIcon,
} from "@mui/icons-material";
// import styled from "@mui/material/styles/styled";
// import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import TraceAnimeModal from "./TraceAnimeModal";
import { useAnilistContext } from "../AnilistContext";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const { isSignedIn } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const modalRef = useRef(null);
    const modalRefPhone = useRef(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [isModalDisplayedPhone, setIsModalDisplayedPhone] = useState(false);
    const traceRef = useRef<HTMLDialogElement>(null);
    const traceRefPhone = useRef<HTMLDialogElement>(null);
    const { authenticate } = useAnilistContext();

    const handleModalDisplay = () => {
        setIsModalDisplayed(true);
        if (traceRef.current) {
            (traceRef.current as HTMLDialogElement).showModal();
        }
    };

    const handleNewsClick = () => {
        navigate('/news');
        setIsOpen(false);
    };

    const handleModalDisplayPhone = () => {
        setIsModalDisplayedPhone(true);
        if (traceRefPhone.current) {
            (traceRefPhone.current as HTMLDialogElement).showModal();
        }
    };

    const handleModalClose = () => {
        setIsModalDisplayed(false);
        if (traceRef.current) {
            (traceRef.current as HTMLDialogElement).close();
        }
    }

    const handleModalClosePhone = () => {
        setIsModalDisplayedPhone(false);
        if (traceRefPhone.current) {
            (traceRefPhone.current as HTMLDialogElement).close();
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();

    const handleTitleClick = (animeId: any) => {
        closeModal();
        closeModalPhone();
        navigate(`/anime/${animeId}`);
    };

    const handleSubmit = () => {
        authenticate();
    };

    const handleHomeClick = () => {
        console.log("Home IconButton clicked");
        navigate("/home");
        setIsOpen(false);
    };

    const handleSearchClick = () => {
        console.log("Search IconButton clicked");
        navigate("/search");
        setIsOpen(false);
    };

    const fetchAnimeSchedule = () => {
        const currentDay = new Date()
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
        fetch(`https://api.jikan.moe/v4/schedules?kids=false&filter=${currentDay}`)
            .then((response) => response.json())
            .then((result) => {
                setSchedule(result.data);
            })
            .catch((error) => console.error(error));
    };

    const openModal = () => {
        setIsModalOpen(true);
        if (modalRef.current) {
            (modalRef.current as HTMLDialogElement).showModal();
        }
        fetchAnimeSchedule();

    };

    const openModalPhone = () => {
        setIsModalOpen(true);
        if (modalRefPhone.current) {
            (modalRefPhone.current as HTMLDialogElement).showModal();
        }
        fetchAnimeSchedule();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        if (modalRef.current) {
            (modalRef.current as HTMLDialogElement).close();
        }

    };

    const closeModalPhone = () => {
        setIsModalOpen(false);
        if (modalRefPhone.current) {
            (modalRefPhone.current as HTMLDialogElement).close();
        }
        setIsOpen(false);
    };

    const convertToUserTime = (broadcastTime: string) => {
        try {
            //console.log("Broadcast Time:", broadcastTime);

            // Append a default date to the time string
            const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
            const dateTimeString = `${currentDate}T${broadcastTime}:00`; // Combine date and time

            // Parse the combined date-time string
            const jstTime = new Date(dateTimeString);
            if (isNaN(jstTime.getTime())) {
                throw new Error("Invalid date format");
            }

            //console.log("JST Time:", jstTime);
            return jstTime.toLocaleString();
        } catch (error) {
            console.error("Error converting broadcast time:", error);
            return "Invalid date";
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="">
                <dialog
                    id="my_modal_5"
                    className="modal modal-bottom sm:modal-middle"
                    ref={modalRefPhone}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModalPhone();
                        }
                    }}
                >
                    <div className="modal-box bg-doki-dark-grey backdrop-blur-lg rounded-[22px]">
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-5 text-doki-purple hover:text-doki-white text-2xl font-bold"
                            onClick={closeModalPhone}
                        >
                            &times;
                        </button>
                        <h3 className="font-lato text-lg text-doki-purple">
                            Anime Schedule
                        </h3>
                        <hr className="bg-doki-purple rounded-md h-[2px] border-0 mt-2" />
                        <div className="py-4">
                            <div>
                                <p className="py-2 text-doki-purple font-lato">
                                    <strong>Current Date and Time:</strong>{" "}
                                    {`${new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "2-digit",
                                        weekday: "long",
                                    }).format(currentDate)} - ${new Intl.DateTimeFormat(
                                        "en-US",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        }
                                    ).format(currentDate)}`}
                                </p>
                            </div>
                            {schedule.map((anime: any) => (
                                <div
                                    id={anime.mal_id}
                                    key={anime.mal_id}
                                    className="relative text-doki-white p-4 rounded-[12px] 
                      border-[3px] border-doki-purple shadow-lg hover:shadow-xl 
                      transition-shadow duration-300 bg-cover bg-center 
                      bg-no-repeat mb-4 hover:animate-scroll"
                                    style={{
                                        backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black opacity-75 rounded-lg"></div>
                                    <p className="relative">
                                        <strong className="cursor-default font-lato">
                                            Title:
                                        </strong>{" "}
                                        <span
                                            onClick={() => handleTitleClick(anime.mal_id)}
                                            // style={{ cursor: "pointer", color: "#04d9ff" }}
                                            className="cursor-pointer text-doki-light-grey font-lato"
                                        >
                                            {anime.title_english || anime.title}
                                        </span>
                                    </p>
                                    <p
                                        className="relative cursor-default font-lato
                       text-doki-white opacity-80"
                                    >
                                        <strong></strong>{" "}
                                        {convertToUserTime(anime.broadcast.time)}
                                    </p>
                                    {/* <hr className="relative" /> */}
                                </div>
                            ))}
                        </div>
                        <div
                            className="modal-action bg-transparent 
                bg-opacity-50 text-doki-purple border border-doki-purple 
                rounded-[12px] p-2.5 font-anime font-bold cursor-pointer 
                shadow-md hover:bg-doki-purple hover:scale-105 transform 
                hover:text-doki-white transition duration-150 ease-in-out"
                        >
                            <form method="dialog" onClick={closeModalPhone} className="w-full">
                                <button className="w-full rounded-lg">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <TraceAnimeModal traceRef={traceRefPhone} isModalDisplayed={isModalDisplayedPhone} closeModal={handleModalClosePhone} toggleSidebar={toggleSidebar} />
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40 backdrop-blur-md"></div>
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: isOpen ? 0 : -250 }}
                            exit={{ x: "-100%" }}
                            // transition={{ type: "spring", stiffness: 300 }}
                            className="fixed top-0 left-0 h-full w-1/4 min-w-[300px] z-50 
                         backdrop-blur-sm bg-doki-dark-grey/80 pt-16 pb-4"
                        >
                            <Stack direction="column" className="flex p-4 ml-4 space-y-4 sm:space-y-5">
                                {/* {isSignedIn && ( */}
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={handleSubmit}>
                                        <LinkIcon className="text-doki-purple" sx={{ fontSize: 32 }} />
                                    </IconButton>
                                    <span className="text-doki-white font-lato text-md mt-1" onClick={handleSubmit}>Anilist Connect</span>
                                </div>
                                {/* )} */}

                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={handleHomeClick}>
                                        <HomeIcon className="text-doki-purple" sx={{ fontSize: 32 }} />
                                    </IconButton>
                                    <span className="text-doki-white font-lato text-md mt-1" onClick={handleHomeClick}>Home</span>
                                </div>

                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={handleSearchClick}>
                                        <SearchIcon className="text-doki-purple" sx={{ fontSize: 32 }} />
                                    </IconButton>
                                    <span className="text-doki-white font-lato text-md mt-1" onClick={handleSearchClick}>Browse</span>
                                </div>

                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={openModalPhone}>
                                        <ScheduleIcon className="text-doki-purple" sx={{ fontSize: 32 }} id="schedule" />
                                    </IconButton>
                                    <span className="text-doki-white font-lato text-md mt-1" onClick={openModalPhone}>Schedule</span>
                                </div>

                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={handleModalDisplayPhone}>
                                        <TraceIcon className="text-doki-purple" sx={{ fontSize: 32 }} />
                                    </IconButton>
                                    <span className="text-doki-white font-lato text-md mt-1" onClick={handleModalDisplayPhone}>Anime Scene Trace</span>
                                </div>

                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={handleNewsClick}>
                                        <FeedIcon className="text-doki-purple" sx={{ fontSize: 32 }} />
                                    </IconButton>
                                    <span className="text-doki-white font-lato text-md mt-1" onClick={handleNewsClick}>Anime News</span>
                                </div>
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconButton onClick={() => {
                                        navigate('/user');
                                        setIsOpen(false);
                                    }}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            className="text-doki-purple"
                                            style={{ width: 32, height: 32 }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                            />
                                        </svg>
                                    </IconButton>
                                    <span
                                        className="text-doki-white font-lato text-md mt-1"
                                        onClick={() => {
                                            navigate('/user');
                                            setIsOpen(false);
                                        }}
                                    >
                                        Profile
                                    </span>
                                </div>
                                <div className="cursor-pointer">
                                    <img
                                        src="/Navbar_logo.png"
                                        alt="Doki Watch"
                                        className="w-full h-full sm:w-2/3 sm:h-auto cursor-pointer mt-10 sm:mt-12 mx-auto my-auto p-2"
                                        draggable="true"

                                    />
                                </div>
                            </Stack>

                            <button className="fixed top-0 left-4 z-50 font-lato text-doki-white ml-4 mt-4" onClick={toggleSidebar}>&lt; Close Menu</button>
                            <hr className="fixed top-16 left-0 w-full border-doki-purple border-1" />
                        </motion.div>
                    </>
                )}

                {/* Toggle Button for Mobile */}

                <div className="fixed top-[85vh] left-0 z-0 -translate-y-1/2 sm:ml-[25px] ml-[5px] hover:scale-105 duration-300">
                    <IconButton
                        onClick={toggleSidebar}
                        style={{ backgroundColor: "#6E78CB" }}
                        sx={{
                            backgroundColor: "#6E78CB",
                            width: 56,
                            height: 56,
                            borderRadius: "20px",
                            padding: "8px",
                        }}
                    >
                        {isOpen ? (
                            <div className="hidden"></div>
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 46 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 5H41"
                                    stroke="#2F3672"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M5 23H41"
                                    stroke="#2F3672"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M5 41H41"
                                    stroke="#2F3672"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </IconButton>
                </div>

            </div >


        </>
    );
};

export default Sidebar;
