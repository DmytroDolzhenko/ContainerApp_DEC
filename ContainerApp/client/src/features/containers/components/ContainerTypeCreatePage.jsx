import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';

export const ContainerTypeCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Назва типу не може бути порожньою');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await containerApi.createType({ name });
      navigate('/containers'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при створенні типу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '500px', mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ color: '#a0a0a0', textTransform: 'none', '&:hover': { color: '#fff' } }}
        >
          Назад до списку
        </Button>
      </Box>

      <Paper 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{
          p: 4, 
          width: '100%', 
          maxWidth: '500px', 
          borderRadius: '16px',
          bgcolor: '#1e1b26', 
          border: '1px solid #322d3d',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 'bold' }}>
          Створення типу контейнера
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Назва типу"
          placeholder="Наприклад: Єврокуб, Бочка, Пляшка"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          autoFocus
          InputLabelProps={{ sx: { color: '#a0a0a0' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              '&:hover fieldset': { borderColor: '#bb86fc' },
              '&.Mui-focused fieldset': { borderColor: '#bb86fc' },
            }
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button 
            fullWidth
            variant="outlined" 
            onClick={() => navigate(-1)} 
            sx={{ 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.2)', 
              borderRadius: '10px',
              textTransform: 'none'
            }}
          >
            Скасувати
          </Button>
          <Button 
            fullWidth
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{ 
              bgcolor: '#bb86fc', 
              color: '#000', 
              fontWeight: 'bold', 
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#9a67ea' } 
            }}
          >
            Зберегти
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};