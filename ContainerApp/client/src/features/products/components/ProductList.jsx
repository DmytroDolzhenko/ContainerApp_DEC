import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Box, IconButton,
  MenuItem, Button, Card, CardContent,
  Typography, Divider, useMediaQuery, useTheme, Grid, TablePagination,
  Menu, FormControl, InputLabel, Select, TextField, Stack, Tooltip
} from '@mui/material';
import { MoreHoriz, Add, FilterList, RestartAlt, Category, Settings } from '@mui/icons-material';
import { useProducts } from "../hooks/useProducts";
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { productApi } from '../api/productApi';
import { ProductTypeCreateModal } from './ProductTypeCreateModal';
import { ProductTypesManageModal } from './ProductTypesManageModal';
import { ProductEditModal } from './ProductEditModal';
import { ProductCreateModal } from './ProductCreateModal';
import { ProductDetailsModal } from './ProductDetailsModal';
import { useAuth } from '../../auth/hooks/useAuth';


export const ProductList = () => {
  const { products, loading, refetch } = useProducts();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [manageTypesOpen, setManageTypesOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [productIdToEdit, setProductIdToEdit] = useState(null);
  const [productIdToView, setProductIdToView] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterType, setFilterType] = useState('');
  const [filterManufactureDate, setFilterManufactureDate] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Не вказано';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleResetFilters = () => {
    setFilterType('');
    setFilterManufactureDate('');
    setPage(0);
  };

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const name = product.name || '';
      const productTypeName = product.productTypeName || '';
      const manufactureDate = product.manufactureDate || '';

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );

      const matchesType = filterType === '' || productTypeName === filterType;
      const matchesDate = !filterManufactureDate || manufactureDate.startsWith(filterManufactureDate);

      return matchesSearch && matchesType && matchesDate;
    });
  }, [products, searchTerm, filterType, filterManufactureDate]);

  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredProducts?.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const productTypesList = useMemo(() => {
    const types = products?.map(p => p.productTypeName).filter(Boolean) || [];
    return [...new Set(types)];
  }, [products]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', textTransform: 'none' }}
          >
            Фільтри
          </Button>
          {(filterType || filterManufactureDate) && (
            <IconButton onClick={handleResetFilters} sx={{ color: '#ff5252' }}><RestartAlt /></IconButton>
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          {!isMobile && isAdmin && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Керування типами">
                <IconButton
                  onClick={() => setManageTypesOpen(true)}
                  sx={{ color: '#bb86fc', border: '1px solid rgba(187, 134, 252, 0.3)', borderRadius: '10px' }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                startIcon={<Category />}
                onClick={() => setTypeModalOpen(true)}
                sx={{ color: '#bb86fc', borderColor: '#bb86fc', borderRadius: '10px', textTransform: 'none' }}
              >
                Новий тип
              </Button>
            </Stack>
          )}
          {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', borderRadius: '10px', textTransform: 'none', '&:hover': { bgcolor: '#9a67ea' } }}
          >
            Додати продукт
          </Button>
          )}
        </Stack>
      </Box>

      {!isMobile && (
        <TableContainer component={Paper} sx={{ bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '16px', background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Назва / Тип</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Виготовлено</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Вжити до</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Опис</TableCell>
                <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold', pr: 2 }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts?.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{row.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#bb86fc' }}>{row.productTypeName || 'Без типу'}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{formatDate(row.manufactureDate)}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{formatDate(row.expirationDate)}</TableCell>
                  <TableCell sx={{ color: '#a0a0a0', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.description || '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(row.id); }} sx={{ color: '#a0a0a0' }}>
                        <MoreHoriz />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isMobile && (
        <Stack spacing={2}>
           {paginatedProducts?.map((row) => (
             <Card key={row.id} sx={{ bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '12px' }}>
               <CardContent>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{row.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#bb86fc' }}>{row.productTypeName || 'Без типу'}</Typography>
                    </Box>
                    <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(row.id); }} sx={{ color: '#a0a0a0' }}><MoreHoriz /></IconButton>
                 </Box>
                 <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />
                 <Grid container spacing={1}>
                    <Grid item xs={6}><Typography variant="caption" color="grey.500">Виготовлено</Typography><Typography variant="body2" color="white">{formatDate(row.manufactureDate)}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="grey.500">Вжити до</Typography><Typography variant="body2" color="white">{formatDate(row.expirationDate)}</Typography></Grid>
                 </Grid>
               </CardContent>
             </Card>
           ))}
        </Stack>
      )}

      <TablePagination
        component="div"
        count={filteredProducts?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        sx={{ color: '#a0a0a0' }}
        labelRowsPerPage="Рядків:"
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{ sx: { bgcolor: '#1e1b26', color: '#fff', p: 2, minWidth: '250px', border: '1px solid #322d3d', borderRadius: '16px' } }}
      >
        <Stack spacing={2}>
           <Typography variant="subtitle2" fontWeight="bold">Фільтрація</Typography>
           <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#777' }}>Тип продукту</InputLabel>
              <Select value={filterType} label="Тип продукту" onChange={(e) => setFilterType(e.target.value)} sx={{ color: '#fff' }}>
                <MenuItem value="">Всі</MenuItem>
                {productTypesList.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
           </FormControl>
           <TextField
            label="Дата виготовлення"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterManufactureDate}
            onChange={(e) => setFilterManufactureDate(e.target.value)}
            sx={{ '& input': { color: '#fff' }, '& .MuiInputLabel-root': { color: '#777' } }}
          />
           <Button variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold' }}>Застосувати</Button>
        </Stack>
      </Menu>

      <ActionMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onEdit={() => {
          setProductIdToEdit(selectedId);
          setEditModalOpen(true);
          setAnchorEl(null);
        }}
        onDelete={async () => {
          if(window.confirm("Видалити цей продукт?")) {
            try {
              await productApi.delete(selectedId);
              if (typeof refetch === 'function') {
                await refetch();
              }
            } catch (err) {
              console.error("Помилка видалення:", err);
              alert("Не вдалося видалити продукт.");
            }
          }
          setAnchorEl(null);
        }}
        onDetails={() => {
          setProductIdToView(selectedId);
          setDetailsModalOpen(true);
          setAnchorEl(null);
        }}
      />

      <ProductCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onRefresh={refetch}
      />

      <ProductTypeCreateModal
        open={typeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        onRefresh={refetch}
      />

      <ProductTypesManageModal
        open={manageTypesOpen}
        onClose={() => setManageTypesOpen(false)}
        onRefresh={refetch}
      />

      <ProductEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        productId={productIdToEdit}
        onRefresh={refetch}
      />

      <ProductDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        productId={productIdToView}
        onEditClick={(id) => {
          setDetailsModalOpen(false);
          setProductIdToEdit(id);
          setEditModalOpen(true);
        }}
      />
    </Box>
  );
};