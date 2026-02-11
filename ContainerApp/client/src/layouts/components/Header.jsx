import { useState } from 'react';
import { Box, InputBase, IconButton, Avatar, Typography, Paper, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import { Search, Notifications, ErrorOutline, CheckCircleOutline, InfoOutlined, Circle, Logout } from '@mui/icons-material';
import { useAuth } from '../../features/auth/hooks/useAuth';

const initialNotifications = [
  { id: 1, text: "Контейнер #102 переповнений!", type: "error", time: "5 хв тому", read: false },
  { id: 2, text: "Новий користувач зареєструвався", type: "info", time: "1 година тому", read: false },
  { id: 3, text: "Продукт 'Oil' успішно оновлено", type: "success", time: "2 години тому", read: false },
  { id: 4, text: "Системне оновлення заплановано", type: "warning", time: "1 день тому", read: false },
];

export const Header = () => {

  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!user) return null;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'error': return <ErrorOutline sx={{ color: '#ff5252' }} />;
      case 'success': return <CheckCircleOutline sx={{ color: '#66bb6a' }} />;
      case 'warning': return <InfoOutlined sx={{ color: '#ffa726' }} />;
      default: return <InfoOutlined sx={{ color: '#29b6f6' }} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        py: 2,
        background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)',
        borderBottom: '1px solid #322d3d', 
      }}
    >
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 400,
          bgcolor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: 'none',
          '&:hover': {
             border: '1px solid #bb86fc',
          }
        }}
      >
        <IconButton sx={{ p: '10px', color: '#a0a0a0' }} aria-label="search">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, color: 'white' }}
          placeholder="Search containers, products..."
          inputProps={{ 'aria-label': 'search' }}
        />
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

        <IconButton 
            onClick={handleOpen}
            sx={{
                color: '#a0a0a0',
                bgcolor: open ? 'rgba(187, 134, 252, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: open ? '1px solid #bb86fc' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                p: 1.5,
                transition: 'all 0.3s ease'
            }}
        >
          <Badge badgeContent={unreadCount} color="error">
             <Notifications />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              bgcolor: '#1e1b26',
              color: '#fff',
              border: '1px solid #322d3d',
              width: 360,
              borderRadius: '16px',
              mt: 1.5,
              boxShadow: '0px 10px 40px rgba(0,0,0,0.5)'
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
            <Typography 
                variant="caption" 
                onClick={handleMarkAllAsRead}
                sx={{ 
                    color: '#bb86fc', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                }}
            >
                Mark all as read
            </Typography>
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />

          {notifications.map((item) => (
            <MenuItem 
                key={item.id} 
                onClick={handleClose}
                sx={{ 
                    whiteSpace: 'normal',
                    py: 1.5,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    bgcolor: item.read ? 'transparent' : 'rgba(187, 134, 252, 0.05)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
            >
              <ListItemIcon>
                {getIcon(item.type)}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                secondary={item.time}
                primaryTypographyProps={{ variant: 'body2', sx: { color: '#fff', fontWeight: item.read ? 400 : 600 } }}
                secondaryTypographyProps={{ variant: 'caption', sx: { color: '#a0a0a0' } }}
              />
              {!item.read && (
                 <Circle sx={{ width: 8, height: 8, color: '#bb86fc', ml: 1 }} />
              )}
            </MenuItem>
          ))}

          <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
            <Button size="small" sx={{ color: '#bb86fc', textTransform: 'none' }}>
              View All Notifications
            </Button>
          </Box>
        </Menu>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>

            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold' }}>
              {user.fullName}
            </Typography>

            <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
              {user.email} <span style={{ color: '#bb86fc' }}>({user.role})</span>
            </Typography>
          </Box>

          <IconButton onClick={logout} sx={{ p: 0 }}>
             <Avatar
                sx={{
                    bgcolor: '#bb86fc',
                    width: 42,
                    height: 42,
                    border: '2px solid rgba(255,255,255,0.1)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    transition: '0.2s',
                    '&:hover': { transform: 'scale(1.05)', border: '2px solid #fff' }
                }}
                alt={user.fullName}
                src={user.avatar}
              >
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </Avatar>
          </IconButton>
        </Box>

      </Box>
    </Box>
  );
};