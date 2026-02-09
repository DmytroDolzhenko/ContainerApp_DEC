import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { Search, ChevronRight } from '@mui/icons-material';
import { MainLayout } from '../layouts/MainLayout';
import { ContainerList } from '../features/containers/components/ContainerList';

export const HomePage = () => {
  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          Dashboard
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            sx={{
              bgcolor: '#121019',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#a0a0a0' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            endIcon={<ChevronRight />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Action
          </Button>
        </Box>
      </Box>

      <ContainerList />
    </MainLayout>
  );
};