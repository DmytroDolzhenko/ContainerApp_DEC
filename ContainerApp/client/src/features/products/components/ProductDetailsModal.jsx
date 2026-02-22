import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Grid, Chip, Divider, 
  CircularProgress, Alert, Dialog, DialogContent, 
  DialogTitle, IconButton, Stack
} from '@mui/material';
import { Close, Edit, Event, EventAvailable } from '@mui/icons-material';
import { productApi } from '../api/productApi';

export const ProductDetailsModal = ({ open, onClose, productId, onEditClick }) => {
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
    if (open && productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await productApi.getById(productId);
          setProduct(data);
        } catch {
          setError("Не вдалося завантажити продукт.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [open, productId]);

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
        ) : product ? (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {product.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={product.productTypeName || `ID: ${product.productTypeId}`} 
                  sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', fontWeight: 'bold' }} 
                />
              </Stack>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#a0a0a0', mb: 0.5 }}>Опис:</Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
              {product.description || "Опис відсутній"}
            </Typography>
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Event sx={{ color: '#a0a0a0', mr: 1, fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#a0a0a0', textTransform: 'uppercase' }}>Дата виготовлення</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatDate(product.manufactureDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventAvailable sx={{ color: '#a0a0a0', mr: 1, fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#a0a0a0', textTransform: 'uppercase' }}>Вжити до</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5252' }}>
                  {formatDate(product.expirationDate)}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#555' }}>ID: #{product.id}</Typography>
              <Button 
                variant="contained" 
                startIcon={<Edit />}
                onClick={() => onEditClick(product.id)}
                sx={{ 
                  bgcolor: '#bb86fc', 
                  color: '#000', 
                  fontWeight: 'bold', 
                  borderRadius: '10px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#9a67ea' } 
                }}
              >
                Редагувати
              </Button>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};