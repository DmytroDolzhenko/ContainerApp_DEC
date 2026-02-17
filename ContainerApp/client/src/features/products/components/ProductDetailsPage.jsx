import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Chip, Divider, CircularProgress, Alert } from '@mui/material';
import { ArrowBack, Edit, Event, EventAvailable } from '@mui/icons-material';
import { productApi } from '../api/productApi';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("Не вдалося завантажити продукт.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;
  
  if (error) return (
    <Box sx={{ p: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>Назад до списку</Button>
    </Box>
  );

  if (!product) return <Typography sx={{ color: 'white', p: 5 }}>Продукт не знайдено</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/products')}
          sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}
        >
          Назад
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          onClick={() => navigate(`/products/edit/${id}`)}
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {product.name}
            </Typography>
            <Chip 
                label={`Type ID: ${product.productTypeId}`} 
                sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', fontWeight: 'bold' }} 
            />
          </Box>
          
          <Typography variant="body2" sx={{ color: '#a0a0a0', mb: 0.5 }}>Опис:</Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6, fontSize: '1.1rem' }}>
            {product.description || "Опис відсутній"}
          </Typography>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ color: '#a0a0a0', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Дата виготовлення</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
                    {formatDate(product.manufactureDate)}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventAvailable sx={{ color: '#a0a0a0', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Термін придатності</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff5252' }}>
                    {formatDate(product.expirationDate)}
                </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: '#a0a0a0' }}>Product ID: #{product.id}</Typography>
          </Box>

      </Paper>
    </Box>
  );
};