import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ConnectIcon from '@mui/icons-material/Link'; // Assuming 'Link' icon is used as 'Connect'
import Box from '@mui/material/Box';

const Sidebar = () => {
  return (
    // Add mx-4 for horizontal margins, bg-[color] for background color
    <Box className="fixed top-1/2 left-0 -translate-y-1/2 z-50 mx-4 bg-gray-800 p-2 rounded-lg">
      <Tooltip title="Connect to anilist" placement="right">
        <IconButton>
          <ConnectIcon className="text-white" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Sidebar;