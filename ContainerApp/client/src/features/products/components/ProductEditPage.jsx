import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { productApi } from '../api/productApi';

export const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productTypeId: 1,
    expirationDate: '',
    manufactureDate: '' 
  });

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(id);
        setFormData({
            name: data.name,
            description: data.description || '',
            productTypeId: data.productTypeId,
            // Форматуємо обидві дати
            expirationDate: formatDateForInput(data.expirationDate),
            manufactureDate: formatDateForInput(data.manufactureDate)
        });
      } catch {
        setError("Не вдалося завантажити дані продукту");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await productApi.update(id, formData);
        navigate(`/products/${id}`);
    } catch (err) {
        console.error(err);
        setError("Помилка при збереженні. Перевірте дані.");
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
        color: "#fff",
        "& fieldset": { borderColor: "#322d3d" },
        "&:hover fieldset": { borderColor: "#bb86fc" },
        "&.Mui-disabled fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
        "&.Mui-disabled input": { 
            color: "rgba(255, 255, 255, 0.5)", 
            WebkitTextFillColor: "rgba(255, 255, 255, 0.5)" 
        },
    },
    "& .MuiInputLabel-root": { color: "#a0a0a0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#bb86fc" },
    "& input::-webkit-calendar-picker-indicator": {
        filter: "invert(1)",
        cursor: "pointer"
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
          Редагування продукту
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Назва"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    sx={inputStyles}
                    required
                />
            </Grid>

            <Grid item xs={12} md={6}>
                 <TextField
                    fullWidth
                    label="Type ID"
                    name="productTypeId"
                    type="number"
                    value={formData.productTypeId}
                    onChange={handleChange}
                    variant="outlined"
                    sx={inputStyles}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Дата виготовлення (Auto)"
                    name="manufactureDate"
                    type="date"
                    value={formData.manufactureDate}
                    variant="outlined"
                    disabled
                    sx={inputStyles}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Термін придатності"
                    name="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={inputStyles}
                    required
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Опис"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={inputStyles}
                />
            </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
            <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/products')}
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