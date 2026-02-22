import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Grid
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { userApi } from '../api/usersApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

const ROLE_MAP_REVERSE = { 'Admin': 1, 'Operator': 2 };
const roles = ['Admin', 'Operator'];

export const UserCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    middlename: '',
    email: '',
    role: 'Operator',
    isApproved: true
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
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        middlename: formData.middlename.trim(),
        email: formData.email.trim(),
        role: ROLE_MAP_REVERSE[formData.role],
        isApproved: formData.isApproved
      };

      await userApi.create(payload);
      if (typeof onRefresh === 'function') onRefresh();
      onClose();
      setFormData({
        name: '', surname: '', middlename: '',
        email: '', role: 'Operator', isApproved: true
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.title || "Помилка при створенні користувача");
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
              label="Роль"
              name="role"
              select
              value={formData.role}
              onChange={handleChange}
              sx={commonInputStyles}
            >
              {roles.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
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
            {loading ? 'Створення...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};