import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, Alert, CircularProgress, MenuItem } from '@mui/material';
import { Save } from '@mui/icons-material';
import { productApi } from '../api/productApi';

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "#322d3d" },
    "&:hover fieldset": { borderColor: "#bb86fc" },
    "&.Mui-focused fieldset": { borderColor: "#bb86fc" },
  },
  "& .MuiInputLabel-root": { color: "#a0a0a0" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#bb86fc" },
  "& .MuiSelect-icon": { color: "#a0a0a0" },
  "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" }
};

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [error, setError] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productTypeId: '',
    expirationDate: ''
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setTypesLoading(true);
        const data = await productApi.getTypes();
        setProductTypes(data);
      } catch (err) {
        console.error("Помилка завантаження типів:", err);
        setError('Не вдалося завантажити типи продуктів');
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
    if (!formData.productTypeId) {
      setError('Будь ласка, виберіть тип продукту');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        typeId: Number(formData.productTypeId), 
        expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null
      };
      
      await productApi.create(payload);
      navigate('/products');
    } catch (err) {
      const serverError = err.response?.data?.title || err.response?.data?.message;
      setError(serverError || 'Помилка при створенні продукту');
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
          Новий продукт
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Назва" 
              name="name" 
              value={formData.name}
              onChange={handleChange} 
              sx={inputStyles} 
              required 
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Тип продукту"
              name="productTypeId"
              value={formData.productTypeId}
              onChange={handleChange}
              sx={inputStyles}
              required
              disabled={typesLoading}
            >
              {typesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Завантаження типів...
                </MenuItem>
              ) : (
                productTypes.map((type) => (
                  <MenuItem key={type.id || type.Id} value={type.id || type.Id}>
                    {type.name || type.Name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Термін придатності" 
              name="expirationDate" 
              type="date" 
              value={formData.expirationDate}
              onChange={handleChange} 
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
              multiline 
              rows={4} 
              value={formData.description}
              onChange={handleChange} 
              sx={inputStyles} 
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
          <Button 
            variant="outlined" 
            disabled={loading}
            onClick={() => navigate('/products')} 
            sx={{ color: '#a0a0a0', borderColor: '#322d3d', px: 4, borderRadius: '10px' }}
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
              px: 4,
              borderRadius: '10px',
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