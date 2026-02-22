import { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Chip, OutlinedInput, Select, FormControl, InputLabel, Stack
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';
import { productApi } from '../../products/api/productApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ContainerTypeCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    allowedProductTypeIds: []
  });

  useEffect(() => {
    if (open) {
      productApi.getTypes()
        .then(setProductTypes)
        .catch(() => setError("Не вдалося завантажити типи продуктів"));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.capacity) {
      setError('Заповніть назву та ємність');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await containerApi.createType({ 
        name: formData.name, 
        capacity: Number(formData.capacity) 
      });

      const allTypes = await containerApi.getTypes();

      const realType = allTypes
        .filter(t => (t.name || t.Name) === formData.name)
        .sort((a, b) => (b.id || b.Id) - (a.id || a.Id))[0];

      const newTypeId = realType?.id || realType?.Id;

      if (!newTypeId) {
        throw new Error("Не вдалося визначити ID створеного типу для запису сумісностей.");
      }

      if (formData.allowedProductTypeIds.length > 0) {
        const compliancePromises = formData.allowedProductTypeIds.map(pTypeId => 
          productApi.createCompliance({
            productTypeId: Number(pTypeId),
            containerTypeId: Number(newTypeId)
          })
        );
        
        await Promise.all(compliancePromises);
      }

      onRefresh();
      onClose();
      setFormData({ name: '', capacity: '', allowedProductTypeIds: [] });
    } catch (err) {
      console.error("Деталі помилки:", err);
      setError(err.message || 'Помилка при створенні');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{ sx: { bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', pt: 3 }}>
        Новий тип тари
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}

            <TextField
              fullWidth
              label="Назва типу"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={commonInputStyles}
              required
            />

            <TextField
              fullWidth
              label="Стандартна ємність (L)"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              sx={commonInputStyles}
              required
            />

            <FormControl fullWidth sx={commonInputStyles}>
              <InputLabel sx={{ color: '#a0a0a0' }}>Сумісні типи продуктів</InputLabel>
              <Select
                multiple
                name="allowedProductTypeIds"
                value={formData.allowedProductTypeIds}
                onChange={handleChange}
                input={<OutlinedInput label="Сумісні типи продуктів" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const type = productTypes.find(t => (t.id || t.Id) === value);
                      return (
                        <Chip 
                          key={value} 
                          label={type?.name || type?.Name || value} 
                          sx={{ bgcolor: '#bb86fc', color: '#000', height: 24, fontWeight: 'bold' }}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={{ PaperProps: { sx: { bgcolor: '#1e1b26', border: '1px solid #322d3d' } } }}
              >
                {productTypes.map((type) => (
                  <MenuItem 
                    key={type.id || type.Id} 
                    value={type.id || type.Id} 
                    sx={{ 
                      color: '#fff',
                      '&.Mui-selected': { bgcolor: 'rgba(187, 134, 252, 0.2)' },
                      '&.Mui-selected:hover': { bgcolor: 'rgba(187, 134, 252, 0.3)' }
                    }}
                  >
                    {type.name || type.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={onClose} sx={{ color: '#a0a0a0', textTransform: 'none' }}>Скасувати</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{ 
              bgcolor: '#bb86fc', 
              color: '#000', 
              fontWeight: 'bold', 
              textTransform: 'none', 
              px: 4,
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            {loading ? 'Збереження...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};