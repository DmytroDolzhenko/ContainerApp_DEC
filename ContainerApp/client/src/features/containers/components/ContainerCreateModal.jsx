import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert, 
  CircularProgress, MenuItem, Dialog, DialogTitle, 
  DialogContent, DialogActions, Stack
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ContainerCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [error, setError] = useState('');
  const [containerTypes, setContainerTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    containerTypeId: '',
    description: ''
  });

  const [selectedTypeCapacity, setSelectedTypeCapacity] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchTypes = async () => {
        try {
          setTypesLoading(true);
          const data = await containerApi.getTypes();
          setContainerTypes(data);
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

    if (name === 'containerTypeId') {
      const type = containerTypes.find(t => (t.id || t.Id) === value);
      setSelectedTypeCapacity(type?.capacity || type?.Capacity || 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        containerTypeId: Number(formData.containerTypeId),
        capacity: Number(selectedTypeCapacity)
      };

      await containerApi.create(payload);
      onRefresh();
      onClose();
      setFormData({ name: '', containerTypeId: '', description: '' });
      setSelectedTypeCapacity(null);
    } catch (err) {
      setError(err.response?.data?.title || 'Помилка при створенні контейнера');
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
      PaperProps={{ sx: { bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', pt: 3 }}>
        Додати новий контейнер
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}

            <TextField
              fullWidth
              label="Назва (маркування)"
              name="name"
              placeholder="Напр: Контейнер №104"
              value={formData.name}
              onChange={handleChange}
              sx={commonInputStyles}
              required
            />

            <TextField
              select
              fullWidth
              label="Тип контейнера"
              name="containerTypeId"
              value={formData.containerTypeId}
              onChange={handleChange}
              sx={commonInputStyles}
              required
              disabled={typesLoading}
            >
              {typesLoading ? (
                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
              ) : (
                containerTypes.map((type) => (
                  <MenuItem key={type.id || type.Id} value={type.id || type.Id}>
                    {type.name || type.Name}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              fullWidth
              label="Місткість"
              value={selectedTypeCapacity !== null ? `${selectedTypeCapacity} L` : '—'}
              InputProps={{ readOnly: true }}
              sx={{ 
                ...commonInputStyles,
                '& .MuiInputBase-input': { color: '#bb86fc', fontWeight: 'bold' }
              }}
              helperText="Визначається типом"
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
              placeholder="Додаткова інформація"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={onClose} 
            startIcon={<Cancel />}
            sx={{ color: '#a0a0a0', textTransform: 'none' }}
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