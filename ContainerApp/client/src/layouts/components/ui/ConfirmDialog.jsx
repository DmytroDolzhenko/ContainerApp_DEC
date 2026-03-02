import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export const ConfirmDialog = ({ open, title, subtitle, onConfirm, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#1e1b26', borderRadius: '16px', p: 1 } }}>
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#a0a0a0' }}>{subtitle}</Typography>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button onClick={onClose} sx={{ color: '#a0a0a0' }}>Скасувати</Button>
        <Button
          onClick={() => { onConfirm(); onClose(); }}
          variant="contained"
          sx={{ bgcolor: '#ff5252', '&:hover': { bgcolor: '#ff1744' } }}
        >
          Підтвердити
        </Button>
      </DialogActions>
    </Dialog>
  );
};