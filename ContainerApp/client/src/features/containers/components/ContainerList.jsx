import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Box, IconButton,
  MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import { MoreHoriz, CleaningServices } from '@mui/icons-material';
import { useContainers } from '../hooks/useContainers';
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { containerApi } from '../api/containerApi';

export const ContainerList = () => {
  const { containers, loading, refetch } = useContainers();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = () => {
    navigate(`/containers/edit/${selectedId}`); 
    handleMenuClose();
  };

  const handleDetails = () => {
    navigate(`/containers/${selectedId}`); 
    handleMenuClose();
  }

  const handleDelete = async () => {
    if (window.confirm("Ви дійсно хочете видалити цей контейнер?")) {
      try {
        await containerApi.delete(selectedId);
        await refetch();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
    handleMenuClose();
  };

  const handleClear = async () => {
    if (window.confirm("Ви впевнені, що хочете очистити вміст контейнера?")) {
        try {
            // await containerApi.clear(selectedId); 
            console.log(`Контейнер ${selectedId} очищено`);
            await refetch();
        } catch (error) {
            console.error("Помилка очищення", error);
        }
    }
    handleMenuClose();
  };

  const getStatusProps = (current, max) => {
    if (current === 0) return { label: "Empty", color: "default", borderColor: '#444' };
    if (current >= max) return { label: "Full", color: "success", borderColor: '' };
    return { label: "In Use", color: "warning", borderColor: '' };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
            mt: 3, 
            boxShadow: 'none', 
            border: '1px solid #322d3d', 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)' 
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Type ID</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Capacity</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {containers.map((row) => {
               const status = getStatusProps(row.currentCapacity, row.capacity);
               return (
                <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
                   <TableCell sx={{ color: '#fff' }}>{row.id}</TableCell>
                   
                   <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                     {row.name}
                   </TableCell>

                   <TableCell sx={{ color: '#fff' }}>
                     {row.containerTypeId}
                   </TableCell>

                   <TableCell sx={{ color: '#fff' }}>
                     {row.productName || '—'}
                   </TableCell>

                   <TableCell sx={{ color: '#fff' }}>
                     {row.currentCapacity} / {row.capacity} L
                   </TableCell>

                   <TableCell sx={{ color: '#a0a0a0', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.description || '—'}
                   </TableCell>

                   <TableCell>
                    <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderColor: status.borderColor, fontWeight: 'bold' }} 
                    />
                   </TableCell>

                   <TableCell align="right">
                    <IconButton 
                        onClick={(e) => handleMenuClick(e, row.id)} 
                        sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}
                    >
                      <MoreHoriz />
                    </IconButton>
                   </TableCell>
                </TableRow>
               )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <ActionMenu 
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleDetails}
      >
        <MenuItem onClick={handleClear} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
           <ListItemIcon>
              <CleaningServices fontSize="small" sx={{ color: '#ffa726' }} />
           </ListItemIcon>
           <ListItemText>Очистити</ListItemText>
        </MenuItem>
      </ActionMenu>
    </Box>
  );
};