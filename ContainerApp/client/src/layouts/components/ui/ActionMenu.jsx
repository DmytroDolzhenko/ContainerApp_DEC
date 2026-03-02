import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export const ActionMenu = ({ anchorEl, open, onClose, onEdit, onDelete, onDetails, children }) => {

const { user } = useAuth();
const isAdmin = user?.role === 'Admin';

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#1e1b26',
          color: '#fff',
          border: '1px solid #322d3d',
          minWidth: '180px',
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.5)'
        }
      }}
    >
      {isAdmin && (
      <MenuItem onClick={onEdit} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
        <ListItemIcon><Edit fontSize="small" sx={{ color: '#a0a0a0' }} /></ListItemIcon>
        <ListItemText>Редагувати</ListItemText>
      </MenuItem>
      )}

      <MenuItem onClick={onDetails} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
        <ListItemIcon><Visibility fontSize="small" sx={{ color: '#a0a0a0' }} /></ListItemIcon>
        <ListItemText>Деталі</ListItemText>
      </MenuItem>

      {children}

      {isAdmin && (
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
      )}

      {isAdmin && (
      <MenuItem onClick={onDelete} sx={{ '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' }, color: '#ff5252' }}>
        <ListItemIcon><Delete fontSize="small" sx={{ color: '#ff5252' }} /></ListItemIcon>
        <ListItemText>Видалити</ListItemText>
      </MenuItem>
      )}
    </Menu>
  );
};