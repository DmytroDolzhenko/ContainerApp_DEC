import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Search, KeyboardArrowRight, Notifications, Logout } from '@mui/icons-material';
import { Sidebar } from '../layouts/components/Sidebar';
import { ContainerList } from '../features/containers/components/ContainerList';

const ContainersPage = () => {
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      bgcolor: '#0f0d15',
      overflow: 'hidden'
    }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}
      >
        <Box sx={{
          flexGrow: 1,
          m: 2,
          bgcolor: '#1e1b26',
          borderRadius: '24px',
          border: '1px solid #322d3d',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>

          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <IconButton sx={{ color: '#a0a0a0' }}><Notifications fontSize="small" /></IconButton>
            <IconButton sx={{ color: '#a0a0a0' }}><Logout fontSize="small" /></IconButton>
          </Box>

          <Box sx={{ p: 4, pt: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                Dashboard
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" sx={{ color: '#a0a0a0' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: '#121019',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    width: 250
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<KeyboardArrowRight />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid #444',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Action
                </Button>
              </Box>
            </Box>
            <ContainerList />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContainersPage;