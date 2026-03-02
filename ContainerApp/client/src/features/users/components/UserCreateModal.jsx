import { useState } from 'react';
import {
  Typography, TextField, Button, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Grid, IconButton, InputAdornment
} from '@mui/material';
import { Save, Cancel, Visibility, VisibilityOff } from '@mui/icons-material';
import { authApi } from '../../auth/api/registerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';


export const UserCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    middlename: '',
    email: '',
    password: '',
    role: 'Operator'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        middlename: formData.middlename.trim()
      };

      await authApi.register(payload);

      if (typeof onRefresh === 'function') onRefresh();
      onClose();

      setFormData({
        name: '', surname: '', middlename: '',
        email: '', password: '', role: 'Operator'
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.title || err.response?.data?.message || "Помилка при реєстрації користувача");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1e1b26',
          border: '1px solid #322d3d',
          borderRadius: '20px',
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle component="div" sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Новий користувач
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 4 }}>
          <Stack spacing={2.5}>
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Прізвище"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  sx={commonInputStyles}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ім'я"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  sx={commonInputStyles}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="По батькові"
              name="middlename"
              value={formData.middlename}
              onChange={handleChange}
              sx={commonInputStyles}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={commonInputStyles}
              required
            />

            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              sx={commonInputStyles}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#a0a0a0' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 4, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{
              color: '#a0a0a0',
              borderColor: '#322d3d',
              px: 4,
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': { borderColor: '#fff', color: '#fff' }
            }}
            disabled={loading}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              px: 4,
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            {loading ? 'Реєстрація...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};