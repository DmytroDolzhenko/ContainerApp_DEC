import { useState } from 'react';
import {
  Box, TextField, Button, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ContainerTypeCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: ''
  });

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

      onRefresh();
      onClose();
      setFormData({ name: '', capacity: '' });
    } catch (err) {
      console.error("Деталі помилки:", err);
      setError(err.response?.data?.message || 'Помилка при створенні типу');
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