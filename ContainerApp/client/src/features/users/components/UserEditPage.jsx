import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, CircularProgress, Alert, MenuItem } from '@mui/material';
import { userApi } from '../api/usersApi';

const ROLE_MAP = { 1: 'Admin', 2: 'Operator' };
const ROLE_MAP_REVERSE = { 'Admin': 1, 'Operator': 2 };
const roles = ['Admin', 'Operator'];

export const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    const fetchUser = async () => {
      try {
        const data = await userApi.getById(id);
        const currentRole = ROLE_MAP[data.role] || 'Operator';

        setFormData({
            name: data.name || '',
            surname: data.surname || '',
            middlename: data.middlename || '',
            email: data.email || '',
            role: currentRole
        });
        setInitialRole(currentRole);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const userPayload = {
            name: formData.name,
            surname: formData.surname,
            middlename: formData.middlename,
            email: formData.email
        };
        await userApi.update(id, userPayload);

        if (formData.role !== initialRole) {
            await userApi.changeRole(id, { 
                newRole: ROLE_MAP_REVERSE[formData.role] 
            });
        }

        navigate(`/users/${id}`);
    } catch (err) {
        console.error("Помилка:", err.response?.data);
        setError(err.response?.data?.title || "Помилка при збереженні. Перевірте консоль.");
    }
  };

  if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3, minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 5, width: '100%', maxWidth: '900px', borderRadius: '16px', bgcolor: '#1e1b26', border: '1px solid #322d3d' }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Редагування користувача
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <TextField fullWidth label="Прізвище" name="surname" value={formData.surname} onChange={handleChange} variant="outlined" sx={inputStyles} required />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField fullWidth label="Ім'я" name="name" value={formData.name} onChange={handleChange} variant="outlined" sx={inputStyles} required />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField fullWidth label="По батькові" name="middlename" value={formData.middlename} onChange={handleChange} variant="outlined" sx={inputStyles} />
            </Grid>

            <Grid item xs={12} md={8}>
                <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} variant="outlined" sx={inputStyles} required />
            </Grid>

            <Grid item xs={12} md={4}>
                 <TextField fullWidth label="Роль" name="role" select value={formData.role} onChange={handleChange} variant="outlined" sx={inputStyles}>
                    {roles.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
            <Button variant="outlined" onClick={() => navigate('/users')} sx={{ color: '#a0a0a0', borderColor: '#322d3d', px: 4 }}>
                Скасувати
            </Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', px: 4 }}>
                Зберегти
            </Button>
        </Box>
      </Paper>
    </Box>
  );
};
// винести в окермий компонент
const inputStyles = {
    "& .MuiOutlinedInput-root": {
        color: "#fff",
        "& fieldset": { borderColor: "#322d3d" },
        "&:hover fieldset": { borderColor: "#bb86fc" },
    },
    "& .MuiInputLabel-root": { color: "#a0a0a0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#bb86fc" },
};