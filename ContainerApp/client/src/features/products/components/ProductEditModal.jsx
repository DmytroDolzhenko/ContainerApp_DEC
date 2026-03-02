import { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, MenuItem
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { productApi } from '../api/productApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ProductEditModal = ({ open, onClose, productId, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productTypeId: '',
    expirationDate: '',
    manufactureDate: '' 
  });

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };

  useEffect(() => {
    if (open && productId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [productData, typesData] = await Promise.all([
            productApi.getById(productId),
            productApi.getTypes()
          ]);

          setProductTypes(typesData);
          setFormData({
            name: productData.name,
            description: productData.description || '',
            productTypeId: productData.productTypeId,
            expirationDate: formatDateForInput(productData.expirationDate),
            manufactureDate: formatDateForInput(productData.manufactureDate)
          });
        } catch {
          setError("Не вдалося завантажити дані");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const dataToSend = {
      ...formData,
      description: formData.description.trim() === '' ? null : formData.description
    };

    await productApi.update(productId, dataToSend);
    onRefresh();
    onClose();
  } catch (err) {
    console.error("API Error details:", err.response?.data);
    setError("Помилка при збереженні. Можливо, опис занадто короткий?");
  }
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { 
          bgcolor: '#1e1b26', 
          backgroundImage: 'none', 
          borderRadius: '16px', 
          border: '1px solid #322d3d' 
        } 
      }}
    >
      <DialogTitle component="div" sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', pt: 3 }}>
        <Typography variant="h5" fontWeight="bold">Редагування продукту</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                label="Назва"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={commonInputStyles}
                required
              />

              <TextField
                select
                fullWidth
                label="Тип продукту"
                name="productTypeId"
                value={formData.productTypeId}
                onChange={handleChange}
                sx={commonInputStyles}
                required
              >
                {productTypes.map((type) => (
                  <MenuItem key={type.id || type.Id} value={type.id || type.Id}>
                    {type.name || type.Name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Дата виготовлення"
                name="manufactureDate"
                type="date"
                value={formData.manufactureDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={commonInputStyles}
                required
              />

              <TextField
                fullWidth
                label="Термін придатності"
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={commonInputStyles}
                required
              />

              <TextField
                fullWidth
                label="Опис"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                sx={commonInputStyles}
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{
              color: '#a0a0a0',
              borderColor: '#322d3d',
              textTransform: 'none',
              flex: 1,
              '&:hover': { borderColor: '#fff', color: '#fff' }
            }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'none',
              flex: 1,
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            Зберегти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};