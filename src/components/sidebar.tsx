import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ConnectIcon from "@mui/icons-material/Link"; // Assuming 'Link' icon is used as 'Connect'
import Box from "@mui/material/Box";

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

  return (
    <Box className="fixed top-1/2 left-0 -translate-y-1/2 z-50 mx-4 bg-gray-800 p-2 rounded-lg">
      <Tooltip title="Connect to anilist" placement="right">
        {/* Step 2: Pass the handleClick function to the onClick prop */}
        <IconButton onClick={handleClick}>
          <ConnectIcon className="text-white" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Sidebar;
