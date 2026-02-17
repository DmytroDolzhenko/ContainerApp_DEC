import { useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Outlet } from 'react-router-dom';

const sidebarWidth = 240;

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          ml: { md: `${sidebarWidth}px` },
          minHeight: '100vh',
          bgcolor: '#0f0c14',
        }}
      >
        <Header onMenuClick={handleDrawerToggle} />

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};