import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Divider, useMediaQuery, useTheme } from '@mui/material';
import { Inventory, ShoppingBasket, People, Logout } from '@mui/icons-material';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const sidebarWidth = 240;

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Перевірка чи це мобільний/планшет

  const menuItems = [
    { text: 'Containers', icon: <Inventory />, path: '/containers' },
    { text: 'Products', icon: <ShoppingBasket />, path: '/products' },
    { text: 'Users', icon: <People />, path: '/users' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #231e2e 0%, #050505 100%)' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#bb86fc', fontStyle: 'italic' }}>
          ContainerApp
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={isMobile ? onMobileClose : null}
            sx={{
              m: 1, borderRadius: '12px',
              color: location.pathname === item.path ? '#bb86fc' : '#e0e0e0',
              bgcolor: location.pathname === item.path ? 'rgba(187, 134, 252, 0.08)' : 'transparent'
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        <ListItemButton onClick={logout} sx={{ borderRadius: '12px', color: '#ff5252' }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}><Logout /></ListItemIcon>
          <ListItemText primary="Вийти" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Мобільний варіант (висувний) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: sidebarWidth, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Десктопний варіант (завжди зліва) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: sidebarWidth, bgcolor: '#050505', borderRight: '1px solid #322d3d' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};