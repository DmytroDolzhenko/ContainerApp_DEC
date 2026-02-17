import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid as Grid, Alert, MenuItem, CircularProgress } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { userApi } from '../api/usersApi';

const ROLE_MAP_REVERSE = { 'Admin': 1, 'Operator': 2 };
const roles = ['Admin', 'Operator'];

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "#322d3d" },
    "&:hover fieldset": { borderColor: "#bb86fc" },
  },
  "& .MuiInputLabel-root": { color: "#a0a0a0" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#bb86fc" },
};

export const UserCreatePage = () => {
  const navigate = useNavigate();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        surname: formData.surname,
        middlename: formData.middlename,
        email: formData.email,
        role: ROLE_MAP_REVERSE[formData.role],
        isApproved: formData.isApproved
      };

      await userApi.create(payload);
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.title || "Помилка при створенні користувача");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{
        p: 5, width: '100%', maxWidth: '900px', borderRadius: '16px',
        bgcolor: '#1e1b26', border: '1px solid #322d3d'
      }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Новий користувач
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Прізвище" name="surname" value={formData.surname} onChange={handleChange} sx={inputStyles} required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Ім'я" name="name" value={formData.name} onChange={handleChange} sx={inputStyles} required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="По батькові" name="middlename" value={formData.middlename} onChange={handleChange} sx={inputStyles} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} sx={inputStyles} required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Роль" name="role" select value={formData.role} onChange={handleChange} sx={inputStyles}>
              {roles.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/users')}
            sx={{ color: '#a0a0a0', borderColor: '#322d3d', px: 4 }}
            disabled={loading}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', px: 4 }}
          >
            {loading ? 'Створення...' : 'Зберегти'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};