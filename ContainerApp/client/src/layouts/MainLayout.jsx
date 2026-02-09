import { Box, IconButton } from '@mui/material';
import { Notifications, Logout } from '@mui/icons-material';
import { Sidebar } from './components/Sidebar';

export const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f0d15' }}>
      <Sidebar />

      <Box sx={{
        flexGrow: 1,
        m: 2,
        ml: 0,
        bgcolor: '#1e1b26',
        borderRadius: '24px',
        border: '1px solid #322d3d',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <IconButton sx={{ color: '#a0a0a0' }}><Notifications /></IconButton>
          <IconButton sx={{ color: '#a0a0a0' }}><Logout /></IconButton>
        </Box>
        <Box sx={{ p: 4, pt: 0, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};