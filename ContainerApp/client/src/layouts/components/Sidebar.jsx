import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Divider } from '@mui/material';
import { Inventory, ShoppingBasket, People, Login, Logout } from '@mui/icons-material';
import { useLocation, Link} from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const sidebarWidth = 240;

const themeConfig = {
  activeColor: '#bb86fc',
  inactiveColor: '#e0e0e0',
  hoverBg: 'rgba(187, 134, 252, 0.08)',
  gradient: 'linear-gradient(180deg, #231e2e 0%, #050505 100%)',
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { text: 'Containers', icon: <Inventory />, path: '/containers' },
    { text: 'Products', icon: <ShoppingBasket />, path: '/products' },
    { text: 'Users', icon: <People />, path: '/users' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: sidebarWidth,
            background: themeConfig.gradient,
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        },
      }}
    >
      <Box sx={{ p: 3, mb: 1 }}>
        <Typography variant="h6" sx={{
            fontWeight: 'bold',
            fontStyle: 'italic',
            background: `linear-gradient(45deg, #fff 30%, ${themeConfig.activeColor} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
        }}>
          ContainerApp
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                m: 1,
                mb: 0.5,
                borderRadius: '12px',
                background: isActive
                    ? `linear-gradient(90deg, rgba(187, 134, 252, 0.15) 0%, rgba(187, 134, 252, 0.05) 100%)` 
                    : 'transparent',
                color: isActive ? themeConfig.activeColor : themeConfig.inactiveColor,
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: themeConfig.hoverBg,
                    color: '#fff',
                    transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon sx={{
                  color: isActive ? themeConfig.activeColor : themeConfig.inactiveColor,
                  minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 400
                }}
              />

              {isActive && (
                 <Box sx={{
                      width: '4px',
                      height: '60%',
                      bgcolor: themeConfig.activeColor,
                      borderRadius: '4px',
                      position: 'absolute',
                      right: '8px'
                 }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2, mx: 1 }} />

        {user ? (
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                color: themeConfig.inactiveColor,
                '&:hover': {
                    backgroundColor: 'rgba(255, 82, 82, 0.1)',
                    color: '#ff5252'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Вийти" />
            </ListItemButton>
        ) : (
            <ListItemButton
              component={Link}
              to="/login"
              sx={{
                borderRadius: '12px',
                color: themeConfig.inactiveColor,
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff'
                }
              }}
            >
              <ListItemIcon sx={{ color: themeConfig.inactiveColor, minWidth: '40px' }}>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Увійти" />
            </ListItemButton>
        )}
      </Box>

    </Drawer>
  );
};