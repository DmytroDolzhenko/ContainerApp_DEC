import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { productApi } from '../api/productApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ProductCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [error, setError] = useState('');
  const [productTypes, setProductTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productTypeId: '',
    manufactureDate: '',
    expirationDate: ''
  });

  useEffect(() => {
    if (open) {
      const fetchTypes = async () => {
        try {
          setTypesLoading(true);
          const data = await productApi.getTypes();
          setProductTypes(data);
        } catch {
          setError('Не вдалося завантажити типи продуктів');
        } finally {
          setTypesLoading(false);
        }
      };
      fetchTypes();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productTypeId) {
      setError('Будь ласка, виберіть тип продукту');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        typeId: Number(formData.productTypeId),
        manufactureDate: formData.manufactureDate,
        expirationDate: formData.expirationDate
      };

      await productApi.create(payload);
      onRefresh();
      onClose();
      setFormData({ name: '', description: '', productTypeId: '', manufactureDate: '', expirationDate: '' });
    } catch (err) {
      const serverError = err.response?.data?.title || err.response?.data?.message;
      setError(serverError || 'Помилка при створенні продукту');
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
          borderRadius: '16px',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle component="div" sx={{ textAlign: 'center', pt: 3 }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Новий продукт
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5}>
            {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}

            <TextField
              fullWidth
              label="Назва продукту"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={commonInputStyles}
              required
              autoFocus
              autoComplete="off"
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
              disabled={typesLoading}
            >
              {typesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Завантаження...
                </MenuItem>
              ) : (
                productTypes.map((type) => (
                  <MenuItem key={type.id || type.Id} value={type.id || type.Id}>
                    {type.name || type.Name}
                  </MenuItem>
                ))
              )}
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
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              sx={commonInputStyles}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{ color: '#a0a0a0', textTransform: 'none' }}
            disabled={loading}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || typesLoading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'none',
              px: 4,
              borderRadius: '10px',
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