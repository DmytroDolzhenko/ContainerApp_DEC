import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, Alert, CircularProgress, MenuItem } from '@mui/material';
import { Save } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ContainerCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [error, setError] = useState('');
  const [containerTypes, setContainerTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    uniqCode: '',
    containerTypeId: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        containerTypeId: Number(formData.containerTypeId),
        capacity: Number(formData.capacity)
      };
      await containerApi.create(payload);
      navigate('/containers');
    } catch (err) {
      setError(err.response?.data?.title || 'Помилка при створенні контейнера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{
        p: 5, width: '100%', maxWidth: '600px', borderRadius: '16px',
        bgcolor: '#1e1b26', border: '1px solid #322d3d'
      }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Новий контейнер
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container direction="column" spacing={3}>
          <Grid item>
            <TextField fullWidth label="Назва" name="name" value={formData.name} onChange={handleChange} sx={commonInputStyles} required />
          </Grid>
          
          <Grid item>
            <TextField fullWidth label="Унікальний код" name="uniqCode" value={formData.uniqCode} onChange={handleChange} sx={commonInputStyles} required />
          </Grid>
          
          <Grid item>
            <TextField
              select
              fullWidth
              label="Тип контейнера"
              name="containerTypeId"
              value={formData.containerTypeId}
              onChange={handleChange}
              sx={{
                ...commonInputStyles,
                '& .MuiSelect-select': { py: 2 } // Розширення поля по вертикалі
              }}
              required
              disabled={typesLoading}
            >
              {typesLoading ? (
                <MenuItem disabled>Завантаження типів...</MenuItem>
              ) : (
                containerTypes.map((type) => (
                  <MenuItem key={type.id || type.Id} value={type.id || type.Id}>
                    {type.name || type.Name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>
          
          <Grid item>
            <TextField fullWidth label="Місткість (L)" name="capacity" type="number" value={formData.capacity} onChange={handleChange} sx={commonInputStyles} required />
          </Grid>
          
          <Grid item>
            <TextField fullWidth label="Опис" name="description" multiline rows={3} value={formData.description} onChange={handleChange} sx={commonInputStyles} />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/containers')} 
            sx={{ color: '#a0a0a0', borderColor: '#322d3d', px: 4, borderRadius: '10px' }}
            disabled={loading}
          >
            Скасувати
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || typesLoading} 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} 
            sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', px: 4, borderRadius: '10px', '&:hover': { bgcolor: '#9a67ea' } }}
          >
            Зберегти
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};