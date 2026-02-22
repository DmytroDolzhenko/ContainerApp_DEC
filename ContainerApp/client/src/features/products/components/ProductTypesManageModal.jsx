import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, Divider, Paper
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import { productApi } from '../api/productApi';

export const ProductTypesManageModal = ({ open, onClose, onRefresh }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTypes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productApi.getTypes();
      setTypes(data);
    } catch (err) {
      setError('Не вдалося завантажити типи продуктів');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadTypes();
    }
  }, [open]);

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей тип продукту?")) return;

    try {
      await productApi.deleteType(id);
      setTypes(prev => prev.filter(t => (t.id || t.Id) !== id));
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при видаленні. Можливо, тип використовується продуктами.');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{ 
        sx: { 
          bgcolor: '#1e1b26', 
          border: '1px solid #322d3d', 
          borderRadius: '16px' 
        } 
      }}
    >
      <DialogTitle component="div" sx={{ color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Типи продуктів</Typography>
        <IconButton onClick={onClose} sx={{ color: '#a0a0a0' }}><Close /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ minHeight: '300px' }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Paper sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <List sx={{ py: 0 }}>
              {types.length === 0 ? (
                <Typography sx={{ color: '#777', p: 3, textAlign: 'center' }}>
                  Категорій не знайдено
                </Typography>
              ) : (
                types.map((type, index) => (
                  <Box key={type.id || type.Id}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDelete(type.id || type.Id)}
                          sx={{ 
                            color: 'rgba(255, 82, 82, 0.6)', 
                            '&:hover': { color: '#ff5252', bgcolor: 'rgba(255, 82, 82, 0.1)' } 
                          }}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {type.name || type.Name}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < types.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                    )}
                  </Box>
                ))
              )}
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          fullWidth 
          sx={{ color: '#a0a0a0', textTransform: 'none', fontWeight: 'bold' }}
        >
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
};