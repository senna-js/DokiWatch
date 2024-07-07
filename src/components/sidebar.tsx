import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ConnectIcon from "@mui/icons-material/Link"; // Assuming 'Link' icon is used as 'Connect'
import HomeIcon from "@mui/icons-material/Home"; // Import Home icon
import MangaIcon from "@mui/icons-material/CollectionsBookmark"; // Assuming 'CollectionsBookmark' is used as 'MangaStack'
import Stack from "@mui/material/Stack";

const Sidebar = () => {
  // Step 1: Define the click event handler function
  const handleClick = () => {
    console.log("IconButton clicked");
    // Add your logic here

    window.open(
      "https://anilist.co/api/v2/oauth/authorize?client_id=19753&redirect_uri=https://domainofweeb.netlify.app/&response_type=code",
      "_blank"
    );
  };

    // Define the click event handler function for Home
    const handleHomeClick = () => {
      console.log("Home IconButton clicked");
      // Redirect to the default home page
      window.location.href = '/';
    };

    // Define the click event handler function for Manga Stack
    const handleMangaClick = () => {
      console.log("Manga IconButton clicked");
      // Add your logic here for Manga Stack button
    };

  return (
    <Stack 
      direction="column" // Set direction to column for vertical layout
      className="fixed top-1/2 left-0 -translate-y-1/2 z-50 mx-4 bg-gray-800 p-2 rounded-lg"
      spacing={2} // Adjust spacing between items as needed 
    >
      <Tooltip title="Connect to anilist" placement="right">
        {/* Step 2: Pass the handleClick function to the onClick prop */}
        <IconButton onClick={handleClick}>
          <ConnectIcon className="text-white" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Home" placement="right">
        <IconButton onClick={handleHomeClick}>
          <HomeIcon className="text-white" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Manga Stack" placement="right">
        <IconButton onClick={handleMangaClick}>
          <MangaIcon className="text-white" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default Sidebar;
