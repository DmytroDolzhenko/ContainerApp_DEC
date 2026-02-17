import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';
import { MenuItem } from '@mui/material';

export const ContainerEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    try {
      setLoading(true);

      const [containerData, typesData] = await Promise.all([
        containerApi.getById(id),
        containerApi.getTypes()
      ]);

      setContainerTypes(typesData);

      setFormData({
        name: containerData.name,
        description: containerData.description || '',
        capacity: containerData.capacity,
        containerTypeName: containerData.containerTypeName
      });
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: name === 'capacity' || name === 'containerTypeId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await containerApi.update(id, formData);
        navigate(`/containers/${id}`);
    } catch (err) {
        console.error(err);
        setError("Помилка при збереженні. Перевірте дані.");
    }
  };

  if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{
        p: 3,
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{
          p: 5,
          width: '100%',
          maxWidth: '900px',
          borderRadius: '16px',
          bgcolor: '#1e1b26',
          border: '1px solid #322d3d'
      }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Редагування контейнера
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                    fullWidth
                    label="Назва"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    sx={commonInputStyles}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                    fullWidth
                    label="Ємність (L)"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    variant="outlined"
                    sx={commonInputStyles}
                    required
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
            <TextField
                select
                fullWidth
                label="TypeName"
                name="containerTypeName"
                value={formData.containerTypeName}
                onChange={handleChange}
                variant="outlined"
                sx={commonInputStyles}
            >
                {containerTypes.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                    {option.name}
                </MenuItem>
                ))}
            </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Опис"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={commonInputStyles}
                />
            </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
            <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/containers')}
                sx={{
                    color: '#a0a0a0',
                    borderColor: '#322d3d',
                    px: 4,
                    '&:hover': { borderColor: '#fff', color: '#fff' }
                }}
            >
                Скасувати
            </Button>
            <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                sx={{
                    bgcolor: '#bb86fc',
                    color: '#000',
                    fontWeight: 'bold',
                    px: 4,
                    '&:hover': { bgcolor: '#9a67ea' }
                }}
            >
                Зберегти
            </Button>
        </Box>
      </Paper>
    </Box>
  );
};