import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Chip, Divider, CircularProgress, Alert, Avatar } from '@mui/material';
import { ArrowBack, Edit, Email, CalendarToday, VerifiedUser } from '@mui/icons-material';
import { userApi } from '../api/usersApi';

export const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.getById(id);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setError("Не вдалося завантажити дані користувача.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  if (error) return (
    <Box sx={{ p: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/users')} sx={{ mt: 2 }}>Назад до списку</Button>
    </Box>
  );

  if (!user) return <Typography sx={{ color: 'white', p: 5 }}>Користувача не знайдено</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/users')}
          sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}
        >
          Назад
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/users/edit/${id}`)}
          sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#9a67ea' } }}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{
          p: 5,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e1b26 0%, #231e2e 100%)',
          border: '1px solid #322d3d',
          color: '#fff'
      }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: '#bb86fc', fontSize: '2rem', fontWeight: 'bold', color: '#000' }}
              >
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </Avatar>
              <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {user.fullName}
                  </Typography>
                  <Chip
                      label={user.role}
                      size="small"
                      sx={{ mt: 1, bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', fontWeight: 'bold' }} 
                  />
              </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ color: '#a0a0a0', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Email</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                    {user.email}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ color: '#a0a0a0', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Дата реєстрації</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                    {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('uk-UA') : '—'}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <VerifiedUser sx={{ color: '#a0a0a0', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>User ID</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                    #{user.id}
                </Typography>
            </Grid>
          </Grid>

      </Paper>
    </Box>
  );
};