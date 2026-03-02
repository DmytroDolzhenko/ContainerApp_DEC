import { useState } from 'react';
import {
  Typography, TextField, Button, Alert,
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Stack
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { productApi } from '../api/productApi';
import { commonInputStyles } from '../../../assets/styles/inputStyles';

export const ProductTypeCreateModal = ({ open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Назва типу не може бути порожньою');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productApi.createType(trimmedName);
      if (typeof onRefresh === 'function') onRefresh();
      onClose();
      setName('');
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.title || err.response.data?.message || 'Помилка сервера';
        setError(errorMessage);
      } else {
        if (typeof onRefresh === 'function') onRefresh();
        onClose();
        setName('');
      }
    } finally {
      setLoading(false);
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
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle component="div" sx={{ textAlign: 'center', pb: 1, pt: 3 }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Новий тип продукту
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Назва типу"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              sx={commonInputStyles}
              required
              disabled={loading}
              autoFocus
              autoComplete="off"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{ color: '#a0a0a0', textTransform: 'none' }}
            disabled={loading}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'none',
              px: 4,
              borderRadius: '10px',
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            {loading ? 'Збереження...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};