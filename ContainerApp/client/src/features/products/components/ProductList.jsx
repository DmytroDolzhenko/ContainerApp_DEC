import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Box, IconButton, Alert
} from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useProducts } from "../hooks/useProducts";
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { productApi } from '../api/productApi';

export const ProductList = () => {
  const { products, loading, error, refetch } = useProducts();

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
    console.log("Edit:", selectedId);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Ви дійсно хочете видалити цей продукт?")) {
      try {
        await productApi.delete(selectedId);
        await refetch();
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Не вдалося видалити продукт");
      }
    }
    handleMenuClose();
  };

  const handleDetails = () => {
     console.log("Details:", selectedId);
     handleMenuClose();
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" variant="outlined">{error}</Alert>
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
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Capacity</TableCell>
              <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products && products.length > 0 ? (
              products.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                  }}
                >
                  <TableCell sx={{ color: '#fff' }}>{row.id}</TableCell>
                  
                  <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>
                    {row.name}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>
                    {row.productTypeId}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>
                    {row.capacity} L
                  </TableCell>

                  <TableCell sx={{ 
                      color: '#a0a0a0', 
                      maxWidth: '200px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                  }}>
                    {row.description || '—'}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Продуктів не знайдено
                </TableCell>
              </TableRow>
            )}
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
      />
    </Box>
  );
};