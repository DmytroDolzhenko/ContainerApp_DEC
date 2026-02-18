import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, Stack } from '@mui/material';
import { Save, ArrowBack, Category } from '@mui/icons-material';
import { productApi } from '../api/productApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ProductTypeCreatePage = () => {
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
      await productApi.createType(name.trim());
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.title || 'Помилка при створенні типу продукту');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ 
            color: '#a0a0a0', 
            alignSelf: 'flex-start', 
            textTransform: 'none', 
            '&:hover': { color: '#fff' } 
          }}
        >
          Назад до списку
        </Button>

        <Paper 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{
            p: 5, 
            borderRadius: '16px',
            bgcolor: '#1e1b26', 
            border: '1px solid #322d3d',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Category sx={{ fontSize: 40, color: '#bb86fc', mb: 1 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
              Новий тип
            </Typography>
            <Typography variant="body2" sx={{ color: '#a0a0a0' }}>
              Додавання нової категорії для товарів
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Назва типу"
            placeholder="Введіть назву..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={commonInputStyles}
            required
            disabled={loading}
            autoFocus
          />

          <Stack spacing={2} sx={{ mt: 5 }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading} 
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} 
              sx={{ 
                bgcolor: '#bb86fc', 
                color: '#000', 
                fontWeight: 'bold', 
                borderRadius: '10px',
                py: 1.5,
                textTransform: 'none',
                '&:hover': { bgcolor: '#9a67ea' } 
              }}
            >
              Зберегти
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)} 
              sx={{ 
                color: '#a0a0a0', 
                borderColor: '#322d3d', 
                borderRadius: '10px', 
                textTransform: 'none', 
                py: 1 
              }}
              disabled={loading}
            >
              Скасувати
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};