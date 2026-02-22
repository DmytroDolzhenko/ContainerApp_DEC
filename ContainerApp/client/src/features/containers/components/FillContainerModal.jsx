import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert, MenuItem,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, List, ListItem, ListItemText, IconButton
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { productApi } from '../../products/api/productApi';
import { containerApi } from '../api/containerApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';
import { productTypeApi } from '../../productTypes/api/productTypeApi';

export const FillContainerModal = ({ open, onClose, container, onRefresh }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rules, setRules] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [loadingRules, setLoadingRules] = useState(false);

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    amount: ''
  });

  useEffect(() => {
    if (open && container) {
      setLoadingProducts(true);
      setLoadingRules(true);

      Promise.all([
        productApi.getAll(),
        productTypeApi.getAll(),
        containerApi.getRules(container.id)
      ])
        .then(([prods, types, currentRules]) => {
          setProducts(prods);
          setProductTypes(types);
          setRules(currentRules);
        })
        .catch(() => setError("Не вдалося завантажити дані"))
        .finally(() => {
          setLoadingProducts(false);
          setLoadingRules(false);
        });
    }
  }, [open, container]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRule = async () => {
    if (!selectedTypeId) return;
    try {
      await containerApi.addRule(container.id, { productTypeId: Number(selectedTypeId) });
      const updatedRules = await containerApi.getRules(container.id);
      setRules(updatedRules);
      setSelectedTypeId('');
    } catch {
      setError("Помилка при додаванні правила");
    }
  };

  const handleRemoveRule = async (ruleId) => {
    try {
      await containerApi.removeRule(container.id, ruleId);
      setRules(rules.filter(r => r.id !== ruleId));
    } catch {
      setError("Помилка при видаленні правила");
    }
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
            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
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

          <Divider sx={{ my: 3, bgcolor: '#322d3d' }} />

          {/* СЕКЦІЯ КЕРУВАННЯ ПРАВИЛАМИ */}
          <Typography variant="subtitle2" sx={{ color: '#bb86fc', mb: 2 }}>
            Обмеження контейнера
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Дозволити тип"
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              sx={commonInputStyles}
            >
              {productTypes
                .filter(type => !rules.some(r => r.productTypeId === type.id))
                .map(type => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
            </TextField>
            <IconButton onClick={handleAddRule} disabled={!selectedTypeId} sx={{ color: '#bb86fc' }}>
              <AddCircleIcon />
            </IconButton>
          </Box>

          {loadingRules ? (
            <CircularProgress size={24} sx={{ display: 'block', mx: 'auto' }} />
          ) : (
            <List dense sx={{ bgcolor: '#16141d', borderRadius: '8px', maxHeight: '150px', overflow: 'auto' }}>
              {rules.length === 0 ? (
                <Typography variant="caption" sx={{ color: '#707070', p: 1, display: 'block', textAlign: 'center' }}>
                  Немає обмежень (дозволено все)
                </Typography>
              ) : (
                rules.map((rule) => (
                  <ListItem
                    key={rule.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveRule(rule.id)} sx={{ color: '#cf6679' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={rule.productTypeForRule?.name || `Тип #${rule.productTypeId}`} 
                      primaryTypographyProps={{ sx: { color: '#fff', fontSize: '0.85rem' } }}
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
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