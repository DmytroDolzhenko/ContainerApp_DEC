import { useEffect, useState } from 'react';
import {
  Box, TextField, Button, CircularProgress,
  Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ContainerEditModal = ({ open, onClose, containerId, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [containerTypes, setContainerTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 0,
    containerTypeName: ''
  });

  useEffect(() => {
    const loadData = async () => {
      if (!containerId || !open) return;
      try {
        setLoading(true);
        setError('');
        const [containerData, typesData] = await Promise.all([
          containerApi.getById(containerId),
          containerApi.getTypes()
        ]);

        setContainerTypes(typesData);
        setFormData({
          name: containerData.name || '',
          description: containerData.description || '',
          capacity: containerData.capacity || 0,
          containerTypeName: containerData.containerTypeName || ''
        });
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити дані для редагування");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [containerId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'containerTypeName') {
      const selectedType = containerTypes.find(t => t.name === value);
      setFormData(prev => ({
        ...prev,
        containerTypeName: value,
        capacity: selectedType?.capacity || selectedType?.Capacity || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await containerApi.update(containerId, formData);
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Помилка при збереженні. Перевірте дані.");
    } finally {
      setIsSubmitting(false);
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
        Редагування контейнера
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress color="secondary" /></Box>
          ) : (
            <Stack spacing={3}>
              {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}

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
                label="Тип тари"
                name="containerTypeName"
                value={formData.containerTypeName}
                onChange={handleChange}
                sx={commonInputStyles}
                required
              >
                {containerTypes.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Ємність (L)"
                value={formData.capacity ? `${formData.capacity} L` : '—'}
                InputProps={{ readOnly: true }}
                sx={{
                  ...commonInputStyles,
                  '& .MuiInputBase-input': { color: '#bb86fc', fontWeight: 'bold' }
                }}
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

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button
            onClick={onClose}
            startIcon={<Cancel />}
            sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' }, textTransform: 'none' }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting}
            startIcon={<Save />}
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