import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Tooltip,
  Stack,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  // Button,
  // TextField,
} from "@mui/material";
import {
  AddLink as LinkIcon,
  Link as ConnectIcon,
  Home as HomeIcon,
  CollectionsBookmark as MangaIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
// import styled from "@mui/material/styles/styled";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

// const AnimeDialog = styled(Dialog)({
//   "& .MuiDialog-paper": {
//     backgroundColor: "transparent", // Making background semi-transparent
//     backdropFilter: "blur(50px)", // Applying backdrop blur
//     borderRadius: "10px",
//     border: "2px solid white",
//   },
// });

// const AnimeDialogTitle = styled(DialogTitle)({
//   fontFamily: "Poppins, sans-serif",
//   backgroundColor: "rgba(238, 130, 238, 0)", // Making background fully transparent
//   backdropFilter: "blur(10px)", // Applying backdrop blur
//   color: "#FFFFFF", // Setting text color to white
// });

// const AnimeDialogContent = styled(DialogContent)({
//   backgroundColor: "#9FADBD",
//   color: "white",
// });

// const AnimeButton = styled(Button)({
//   color: "white",
//   cursor: "pointer",
//   marginLeft: "auto",
//   border: "1px solid #4B5563", // border-gray-700
//   borderRadius: "0.5rem", // rounded-lg
//   padding: "0.5rem 1rem", // px-2 py-2
//   transition: "transform 150ms ease-in-out, background-color 150ms ease-in-out", // transition duration-150 ease-in-out
//   "&:hover": {
//     backgroundColor: "#374151", // hover:bg-slate-700
//     transform: "scale(1.05)", // hover:scale-105
//   },
//   display: "flex",
//   justifyContent: "space-between",
// });

// const AnimeTextField = styled(TextField)({
//   "& label.Mui-focused": {
//     color: "#3A0CA3",
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: "lightgrey",
//     },
//     "&:hover fieldset": {
//       borderColor: "#4CC9F0",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#4CC9F0",
//     },
//   },
// });

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const modalRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const handleTitleClick = (animeId: any) => {
    closeModal();
    navigate(`/anime/${animeId}`);
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
    const user = { username: event.target.value };
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = () => {
    console.log("Username submitted:", username);
    window.open(
      "https://anilist.co/api/v2/oauth/authorize?client_id=21555&response_type=token",
      "_blank"
    );
    setOpen(false);
  };

  const handleHomeClick = () => {
    console.log("Home IconButton clicked");
    navigate("/home");
  };

  const handleMangaClick = () => {
    console.log("Manga IconButton clicked");
    navigate("/manga");
  };

  const handleSearchClick = () => {
    console.log("Search IconButton clicked");
    navigate("/search");
  };

  const openModal = () => {
    setIsModalOpen(true);
    if (modalRef.current) {
      (modalRef.current as HTMLDialogElement).showModal();
    }
    fetchAnimeSchedule();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalRef.current) {
      (modalRef.current as HTMLDialogElement).close();
    }
  };

  const fetchAnimeSchedule = () => {
    const currentDay = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    fetch(`https://api.jikan.moe/v4/schedules?kids=false&filter=${currentDay}`)
      .then((response) => response.json())
      .then((result) => setSchedule(result.data))
      .catch((error) => console.error(error));
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
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={isOpen ? { x: "0%" } : { x: "-100%" }}
          transition={
            isOpen
              ? { type: "spring", stiffness: 300 }
              : { duration: 0.5, ease: "easeInOut" }
          }
          className="fixed top-1/3 left-0 -translate-y-1/2 z-50
           mx-[25px] bg-doki-dark-grey rounded-[22px] pt-2 pb-2"
        >
          <Stack direction="column" gap={1.5}>
            {isSignedIn && (
              <Tooltip
                title="Connect to Anilist"
                placement="right"
                sx={{ width: 56, height: 56 }}
              >
                <IconButton onClick={handleSubmit}>
                  <LinkIcon
                    className="text-doki-purple rounded-full"
                    sx={{ fontSize: 32 }}
                  />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Home" placement="right">
              <IconButton onClick={handleHomeClick}>
                <HomeIcon
                  className="text-doki-purple rounded-full"
                  sx={{ fontSize: 32 }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Browse" placement="right">
              <IconButton onClick={handleSearchClick}>
                <SearchIcon
                  className="text-doki-purple rounded-full"
                  sx={{ fontSize: 32 }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manga Coming Soon" placement="right">
              <IconButton>
                <MangaIcon
                  className="text-doki-light-grey cursor-not-allowed"
                  sx={{ fontSize: 32 }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Anime Schedule" placement="right">
              <IconButton onClick={openModal}>
                <ScheduleIcon
                  className="text-doki-purple rounded-full"
                  sx={{ fontSize: 32 }}
                  id="schedule"
                />
              </IconButton>
            </Tooltip>
            <dialog
              id="my_modal_5"
              className="modal modal-bottom sm:modal-middle"
              ref={modalRef}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div className="modal-box bg-transparent backdrop-blur-lg">
                <h3 className="font-bold text-lg">Anime Schedule</h3>
                <hr className="mt-2" />
                <div className="py-4">
                  <div>
                    <p className="py-2">
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
                      className="relative text-white p-4 rounded-lg border border-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-cover bg-center bg-no-repeat mb-4 hover:animate-scroll"
                      style={{
                        backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                      <p className="relative">
                        <strong className="cursor-default">Title:</strong>{" "}
                        <span
                          onClick={() => handleTitleClick(anime.mal_id)}
                          style={{ cursor: "pointer", color: "#04d9ff" }}
                        >
                          {anime.title_english || anime.title}
                        </span>
                      </p>
                      <p className="relative cursor-default">
                        <strong></strong>{" "}
                        {convertToUserTime(anime.broadcast.time)}
                      </p>
                      {/* <hr className="relative" /> */}
                    </div>
                  ))}
                </div>
                <div className="modal-action bg-transparent bg-opacity-50 text-white border border-gray-700 rounded-lg p-2.5 font-anime font-bold cursor-pointer shadow-md hover:bg-red-500 hover:scale-105 transform transition duration-150 ease-in-out">
                  <form method="dialog" onClick={closeModal} className="w-full">
                    <button className="w-full rounded-lg">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </Stack>
        </motion.div>
      )}
      <Tooltip title="Toggle Sidebar" placement="right">
        <div className="fixed top-[85vh] left-0 z-50 -translate-y-1/2 mx-[25px]">
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
              <svg
                width="30"
                height="29"
                viewBox="0 0 30 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-doki-purple w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
              >
                <path
                  d="M3 3L27 26"
                  stroke="#2F3672"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M27 3L3 26"
                  stroke="#2F3672"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-doki-purple w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
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
      </Tooltip>
    </>
  );
};

export default Sidebar;
