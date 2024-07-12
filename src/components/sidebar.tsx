import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import {
  Link as ConnectIcon,
  Home as HomeIcon,
  CollectionsBookmark as MangaIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import styled from "@mui/material/styles/styled";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useUser } from "@clerk/clerk-react";


const AnimeDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    backgroundColor: "#fafafa",
  },
});

const AnimeDialogTitle = styled(DialogTitle)({
  backgroundColor: "#151F2E",
  color: "#3DB4F2",
});

const AnimeDialogContent = styled(DialogContent)({
  backgroundColor: "#9FADBD",
  color: "white",
});

const AnimeButton = styled(Button)({
  backgroundColor: "#4CC9F0",
  color: "white",
  "&:hover": {
    backgroundColor: "#4895EF",
  },
});

const AnimeTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#3A0CA3",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "lightgrey",
    },
    "&:hover fieldset": {
      borderColor: "#4CC9F0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4CC9F0",
    },
  },
});

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

  const handleTitleClick = (animeId) => {
    closeModal();
    navigate(`/anime/${animeId}`);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    const user = { username: event.target.value };
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = () => {
    console.log("Username submitted:", username);
    window.open(
      "https://anilist.co/api/v2/oauth/authorize?client_id=19786&response_type=token",
      "_blank"
    );
    setOpen(false);
  };

  const handleHomeClick = () => {
    console.log("Home IconButton clicked");
    window.location.href = "/";
  };

  const handleMangaClick = () => {
    console.log("Manga IconButton clicked");
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
        <Stack
          direction="column"
          className="fixed top-1/2 left-0 -translate-y-1/2 z-50 mx-4 bg-gray-800 p-2 rounded-lg"
          spacing={2}
        >
          {isSignedIn && (
            <Tooltip title="Connect to Anilist" placement="right">
              <IconButton onClick={handleClickOpen}>
                <ConnectIcon className="text-white" />
              </IconButton>
            </Tooltip>
          )}
          <AnimeDialog open={open} onClose={handleClose}>
            <AnimeDialogTitle>Enter AniList Username</AnimeDialogTitle>
            <AnimeDialogContent>
              <AnimeTextField
                autoFocus
                margin="dense"
                id="username"
                label="AniList Username"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleUsernameChange}
              />
            </AnimeDialogContent>
            <DialogActions className="bg-[#9fadbd]">
              <AnimeButton onClick={handleClose}>Cancel</AnimeButton>
              <AnimeButton onClick={handleSubmit}>Submit</AnimeButton>
            </DialogActions>
          </AnimeDialog>
          <Tooltip title="Home" placement="right">
            <IconButton onClick={handleHomeClick}>
              <HomeIcon className="text-white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Coming Soon" placement="right">
            <IconButton onClick={handleMangaClick}>
              <MangaIcon className="text-white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Anime Schedule" placement="right">
            <IconButton onClick={openModal}>
              <ScheduleIcon className="text-white" id="schedule" />
            </IconButton>
          </Tooltip>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
            ref={modalRef}
          >
            <div className="modal-box bg-transparent backdrop-blur-lg">
              <h3 className="font-bold text-lg">Anime Schedule</h3>
              <hr className="mt-2" />
              <div className="py-4">
                <div>
                  <p className="py-2">
                    <strong>Current Date and Time:</strong>{" "}
                    {`${new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      weekday: 'long',
                    }).format(currentDate)} - ${new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    }).format(currentDate)}`}
                  </p>
                </div>
                {schedule.map((anime) => (
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
      )}
      <Tooltip title="Toggle Sidebar" placement="right">
        <div className="fixed top-[90vh] left-0 z-50 -translate-y-1/2 mx-4">
          <IconButton
            onClick={toggleSidebar}
            style={{ backgroundColor: "#212529" }}
          >
            {isOpen ? (
              <ChevronLeftIcon className="text-white" />
            ) : (
              <ChevronRightIcon className="text-white" />
            )}
          </IconButton>
        </div>
      </Tooltip>
    </>
  );
};

export default Sidebar;
