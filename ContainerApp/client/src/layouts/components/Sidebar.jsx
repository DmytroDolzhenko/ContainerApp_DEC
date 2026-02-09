import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Inventory, ShoppingBasket, History, People } from '@mui/icons-material';

const sidebarWidth = 240;

export const Sidebar = () => {
  const menuItems = [
    { text: 'Containers', icon: <Inventory />, active: true },
    { text: 'Products', icon: <ShoppingBasket /> },
    { text: 'History', icon: <History /> },
    { text: 'Users', icon: <People /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        '& .MuiDrawer-paper': { width: sidebarWidth, backgroundColor: '#1e1b26', borderRight: '1px solid #322d3d' },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
          ContainerApp
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            sx={{
              m: 1,
              borderRadius: 2,
              backgroundColor: item.active ? 'rgba(187, 134, 252, 0.15)' : 'transparent',
              color: item.active ? '#bb86fc' : 'inherit'
            }}
          >
            <ListItemIcon sx={{ color: item.active ? '#bb86fc' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};