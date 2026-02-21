import { useEffect, useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, CircularProgress, 
  Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions 
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await containerApi.update(containerId, formData);
      onRefresh(); // Оновлюємо список
      onClose();   // Закриваємо модалку
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
            <>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Назва"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={commonInputStyles}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ємність (L)"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    sx={commonInputStyles}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button 
            onClick={onClose} 
            startIcon={<Cancel />}
            sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}
          >
            Скасувати
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || isSubmitting}
            startIcon={<Save />}
            sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#9a67ea' } }}
          >
            Зберегти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};