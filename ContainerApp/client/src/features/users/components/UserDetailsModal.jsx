import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Grid, Chip, Divider,
  CircularProgress, Alert, Dialog, DialogContent,
  DialogTitle, IconButton, Stack, Avatar
} from '@mui/material';
import { Close, Edit, Email, CalendarToday, VerifiedUser } from '@mui/icons-material';
import { userApi } from '../api/usersApi';

export const UserDetailsModal = ({ open, onClose, userId, onEditClick }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await userApi.getById(userId);
          setUser(data);
        } catch (err) {
          console.error("Failed to fetch user", err);
          setError("Не вдалося завантажити дані користувача.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [open, userId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1e1b26',
          backgroundImage: 'linear-gradient(135deg, #1e1b26 0%, #231e2e 100%)',
          border: '1px solid #322d3d',
          borderRadius: '20px',
          color: '#fff'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose} sx={{ color: '#a0a0a0' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4, pt: 0 }}>
        {loading ? (
          <Box sx={{ py: 5, textAlign: 'center' }}><CircularProgress color="secondary" /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : user ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#bb86fc',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#000',
                  boxShadow: '0 4px 10px rgba(187, 134, 252, 0.3)'
                }}
              >
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {user.fullName}
                </Typography>
                <Chip
                  label={user.role === 1 ? 'Адмін' : 'Оператор'}
                  size="small"
                  sx={{ mt: 1, bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', fontWeight: 'bold' }} 
                />
              </Box>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ color: '#a0a0a0', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Email</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                  {user.email}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ color: '#a0a0a0', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Дата реєстрації</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem' }}>
                  {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('uk-UA') : '—'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <VerifiedUser sx={{ color: '#a0a0a0', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#a0a0a0' }}>User ID</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem' }}>
                  #{user.id}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Edit />}
                onClick={() => onEditClick(user.id)}
                sx={{
                  bgcolor: '#bb86fc',
                  color: '#000',
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#9a67ea' }
                }}
              >
                Редагувати профіль
              </Button>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};