import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Alert, MenuItem, 
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { productApi } from '../../products/api/productApi';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const FillContainerModal = ({ open, onClose, container, onRefresh }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    amount: ''
  });

  useEffect(() => {
    if (open) {
      setLoadingProducts(true);
      productApi.getAll()
        .then(setProducts)
        .catch(() => setError("Не вдалося завантажити список продуктів"))
        .finally(() => setLoadingProducts(false));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.productId || !formData.amount) {
      setError("Будь ласка, заповніть усі поля");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        productId: Number(formData.productId),
        amount: Number(formData.amount)
      };

      await containerApi.fill(container.id, payload);
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.title || 'Помилка заповнення контейнера');
    } finally {
      setIsSubmitting(false);
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
      <DialogTitle sx={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
        Заповнити: {container?.name}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Typography variant="caption" sx={{ color: '#a0a0a0', mb: 2, display: 'block' }}>
            Вільне місце: {container ? container.capacity - container.currentCapacity : 0} L
          </Typography>

          <TextField
            select
            fullWidth
            label="Оберіть продукт"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            sx={{ ...commonInputStyles, mb: 3 }}
            required
            disabled={loadingProducts}
          >
            {loadingProducts ? (
              <MenuItem disabled><CircularProgress size={20} /></MenuItem>
            ) : (
              products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)
            )}
          </TextField>

          <TextField
            fullWidth
            label="Кількість (L)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            sx={commonInputStyles}
            required
            inputProps={{ min: 1, max: container ? container.capacity - container.currentCapacity : 9999 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={onClose} sx={{ color: '#a0a0a0' }}>Скасувати</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            sx={{ bgcolor: '#bb86fc', color: '#000', '&:hover': { bgcolor: '#9a67ea' } }}
          >
            {isSubmitting ? '...' : 'Заповнити'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};