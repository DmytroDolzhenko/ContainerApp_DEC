import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton, Divider, Paper
} from '@mui/material';
import { Delete, Category, Close } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';

export const ContainerTypesManageModal = ({ open, onClose, onRefresh }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTypes = async () => {
    try {
      setLoading(true);
      const data = await containerApi.getTypes();
      setTypes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadTypes();
  }, [open]);

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей тип? Це може вплинути на існуючі контейнери.")) return;

    try {
      await containerApi.deleteType(id);
      setTypes(types.filter(t => (t.id || t.Id) !== id));
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при видаленні. Можливо, цей тип використовується.');
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
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Керування типами тари
        <IconButton onClick={onClose} sx={{ color: '#a0a0a0' }}><Close /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ minHeight: '300px' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress color="secondary" /></Box>
        ) : (
          <Paper sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <List>
              {types.length === 0 ? (
                <Typography sx={{ color: '#777', p: 3, textAlign: 'center' }}>Список типів порожній</Typography>
              ) : (
                types.map((type, index) => (
                  <Box key={type.id || type.Id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(type.id || type.Id)}
                          sx={{ color: 'rgba(255, 82, 82, 0.6)', '&:hover': { color: '#ff5252' } }}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={<Typography sx={{ color: '#fff', fontWeight: 500 }}>{type.name || type.Name}</Typography>}
                        secondary={<Typography variant="caption" sx={{ color: '#bb86fc' }}>Місткість: {type.capacity || type.Capacity} L</Typography>}
                      />
                    </ListItem>
                    {index < types.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                  </Box>
                ))
              )}
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} fullWidth sx={{ color: '#a0a0a0', textTransform: 'none' }}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
};