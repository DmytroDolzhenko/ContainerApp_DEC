import { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, MenuItem, Grid
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { userApi } from '../api/usersApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

const ROLE_MAP = { 1: 'Admin', 2: 'Operator' };
const ROLE_MAP_REVERSE = { 'Admin': 1, 'Operator': 2 };
const roles = ['Admin', 'Operator'];

export const UserEditModal = ({ open, onClose, userId, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [initialRole, setInitialRole] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    middlename: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          setError('');
          const data = await userApi.getById(userId);
          const currentRole = ROLE_MAP[data.role] || 'Operator';

          setFormData({
            name: data.name || '',
            surname: data.surname || '',
            middlename: data.middlename || '',
            email: data.email || '',
            role: currentRole
          });
          setInitialRole(currentRole);
        } catch (err) {
          setError("Не вдалося завантажити дані користувача");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [open, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const userPayload = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        middlename: formData.middlename.trim(),
        email: formData.email.trim()
      };

      // 1. Оновлення основних даних
      await userApi.update(userId, userPayload);

      // 2. Оновлення ролі, якщо вона змінилася
      if (formData.role !== initialRole) {
        await userApi.changeRole(userId, { 
          newRole: ROLE_MAP_REVERSE[formData.role] 
        });
      }

      if (typeof onRefresh === 'function') onRefresh();
      onClose();
    } catch (err) {
      console.error("Помилка при збереженні:", err.response?.data);
      setError(err.response?.data?.title || "Помилка при збереженні даних.");
    } finally {
      setSubmitting(false);
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
          backgroundImage: 'none', 
          borderRadius: '20px', 
          border: '1px solid #322d3d' 
        } 
      }}
    >
      <DialogTitle component="div" sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Редагування
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
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
          )}
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
            disabled={submitting}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || loading}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
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
            {submitting ? 'Збереження...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};