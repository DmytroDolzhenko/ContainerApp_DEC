import { useEffect, useState } from 'react';
import { Box, InputBase, IconButton, Avatar, Typography, Paper, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Search, Notifications, ErrorOutline, CheckCircleOutline, InfoOutlined, Circle, Menu as MenuIcon } from '@mui/icons-material';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { containerApi } from '../../features/containers/api/containerApi';

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const searchAllowedRoutes = ['/containers', '/products', '/users'];
  const showSearch = searchAllowedRoutes.includes(location.pathname);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
  try {
    const data = await containerApi.getExpired();

    const mapped = (data || []).map(c => ({
      id: `expired-${c.id}`,
      containerId: c.id,
      text: `Контейнер "${c.name}": перевірте термін придатності!`,
      type: 'warning',
      time: 'Увага',
      read: false
    }));

    setNotifications(mapped);
  } catch (error) {
    console.error("Помилка завантаження сповіщень:", error);
  }
};
      fetchNotifications();
    }
  }, [user]);

  if (!user) return null;

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { search: value } : {});
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
    px: { xs: 2, md: 4 },
    py: 1.5,
    background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)',
    borderBottom: '1px solid #322d3d',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    width: '100%', // Залиш 100%
    boxSizing: 'border-box', // Обов'язково
    left: 0, // Додай це
  }}
>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ color: '#fff', mr: { xs: 1, md: 2 }, display: { md: 'none' }, flexShrink: 0 }}
        >
          <MenuIcon />
        </IconButton>

        {showSearch && (
          <Box
            sx={{
              width: { xs: 0, sm: 250, md: 400 },
              display: { xs: 'none', sm: 'block' },
              mr: 2,
              flexShrink: 1,
              minWidth: 0
            }}
          >
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: 'none',
              }}
            >
              <IconButton sx={{ p: { xs: 0.5, md: 1 }, color: '#a0a0a0' }}>
                <Search size="small" />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'white', fontSize: '0.9rem' }}
                placeholder="Пошук..."
                value={searchParams.get('search') || ''}
                onChange={handleSearchChange}
              />
            </Paper>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 }, flexShrink: 0 }}>
        <IconButton
          onClick={handleOpen}
          sx={{
            color: '#a0a0a0',
            bgcolor: open ? 'rgba(187, 134, 252, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            p: { xs: 0.8, sm: 1.2 }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications fontSize="small" />
          </Badge>
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {user.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#a0a0a0', whiteSpace: 'nowrap' }}>
              {user.role}
            </Typography>
          </Box>
          <IconButton onClick={logout} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: '#bb86fc',
                width: { xs: 34, sm: 40 },
                height: { xs: 34, sm: 40 },
                border: '2px solid rgba(255,255,255,0.1)',
                fontSize: '0.85rem'
              }}
              src={user.avatar}
            >
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        PaperProps={{
          sx: {
            bgcolor: '#1e1b26',
            color: '#fff',
            border: '1px solid #322d3d',
            width: { xs: '280px', sm: 360 },
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: '16px',
            mt: 1.5,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Сповіщення</Typography>
          <Typography
            variant="caption"
            onClick={handleMarkAllAsRead}
            sx={{ color: '#bb86fc', cursor: 'pointer' }}
          >
            Позначити як прочитані
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <MenuItem key={item.id} onClick={() => { if (item.containerId) navigate(`/containers/${item.containerId}`); handleClose(); }}>
                <ListItemIcon sx={{ minWidth: '35px' }}>{getIcon(item.type)}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  secondary={item.time}
                  primaryTypographyProps={{ variant: 'body2', sx: { color: '#fff', whiteSpace: 'normal' } }}
                />
              </MenuItem>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}><Typography variant="body2" color="#a0a0a0">Немає сповіщень</Typography></Box>
          )}
        </Box>
      </Menu>
    </Box>
  );
};