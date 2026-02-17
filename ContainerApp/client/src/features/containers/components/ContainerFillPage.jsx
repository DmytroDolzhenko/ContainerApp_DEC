import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, Alert, MenuItem, CircularProgress } from '@mui/material';
import { containerApi } from '../api/containerApi';
import { productApi } from '../../products/api/productApi';
import { useContainers } from '../hooks/useContainers';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ContainerFillPage = () => {
  const navigate = useNavigate();
  const { containers, loading: loadingContainers } = useContainers();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    containerId: '',
    productId: '',
    amount: ''
  });

  useEffect(() => {
    productApi.getAll()
      .then(setProducts)
      .catch(() => setError("Не вдалося завантажити список продуктів"))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.containerId || !formData.productId || !formData.amount) {
      setError("Будь ласка, заповніть усі поля");
      return;
    }

    setIsSubmitting(true);
    try {
      const containerId = Number(formData.containerId);
      const payload = {
        productId: Number(formData.productId),
        amount: Number(formData.amount)
      };

      await containerApi.fill(containerId, payload);
      navigate('/containers');
    } catch (err) {
      setError(err.response?.data?.title || 'Помилка заповнення контейнера');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingContainers || loadingProducts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ 
        p: 5, width: '100%', maxWidth: '800px', borderRadius: '16px', 
        bgcolor: '#1e1b26', border: '1px solid #322d3d' 
      }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Заповнити контейнер
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Оберіть контейнер"
              name="containerId"
              value={formData.containerId}
              onChange={handleChange}
              sx={commonInputStyles}
              required
            >
              {containers.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} (Вільно: {c.capacity - c.currentCapacity} L)
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Оберіть продукт"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              sx={commonInputStyles}
              required
            >
              {products.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Кількість (L)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              sx={commonInputStyles}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/containers')}
            sx={{ color: '#a0a0a0', borderColor: '#322d3d', px: 4 }}
            disabled={isSubmitting}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              px: 6,
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            {isSubmitting ? 'Заповнення...' : 'Заповнити'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};