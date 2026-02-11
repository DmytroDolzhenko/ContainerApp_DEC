import { Box } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => { 
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f0d15' }}>

      <Sidebar />

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>

        <Header />

        <Box sx={{ 
            p: 4, 
            pt: 2, 
            flexGrow: 1, 
            overflow: 'auto'
        }}>
          <Outlet /> 
        </Box>
      </Box>
    </Box>
  );
};