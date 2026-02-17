import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Box, IconButton, Alert, Button,
  Card, CardContent, Typography, Divider, useMediaQuery, useTheme, Grid,
  TablePagination, TextField, MenuItem, FormControl, InputLabel, Select, Menu, Tooltip
} from '@mui/material';
import { MoreHoriz, Add, CalendarToday, FilterList, RestartAlt, Category } from '@mui/icons-material';
import { useProducts } from "../hooks/useProducts";
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { productApi } from '../api/productApi';

export const ProductList = () => {
  const { products, loading, error, refetch } = useProducts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterOpen = Boolean(filterAnchorEl);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterType, setFilterType] = useState('');
  const [filterManufactureDate, setFilterManufactureDate] = useState('');
  const [filterExpirationDate, setFilterExpirationDate] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const handleResetFilters = () => {
    setFilterType('');
    setFilterManufactureDate('');
    setFilterExpirationDate('');
    setPage(0);
  };

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        String(product.id).includes(searchLower)
      );

      const matchesType = filterType === '' || product.productTypeId === Number(filterType);
      
      const matchesManufacture = !filterManufactureDate || product.manufactureDate?.startsWith(filterManufactureDate);

      const matchesExpiration = !filterExpirationDate || (
        product.expirationDate && 
        new Date(product.expirationDate).getTime() >= new Date(filterExpirationDate).getTime()
      );

      return matchesSearch && matchesType && matchesManufacture && matchesExpiration;
    });
  }, [products, searchTerm, filterType, filterManufactureDate, filterExpirationDate]);

  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredProducts?.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const productTypes = useMemo(() => {
    const types = products?.map(p => p.productTypeId) || [];
    return [...new Set(types)];
  }, [products]);


  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error" variant="outlined">{error}</Alert></Box>;

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              textTransform: 'none',
              bgcolor: (filterType || filterManufactureDate || filterExpirationDate) ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
              '&:hover': { borderColor: '#bb86fc', bgcolor: 'rgba(187, 134, 252, 0.05)' }
            }}
          >
            Фільтри {(filterType || filterManufactureDate || filterExpirationDate) ? '•' : ''}
          </Button>

          {(filterType || filterManufactureDate || filterExpirationDate) && (
            <Tooltip title="Скинути фільтри">
              <IconButton onClick={handleResetFilters} sx={{ color: '#ff5252' }}>
                <RestartAlt />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Category />}
            onClick={() => navigate('/product-types/create')}
            sx={{
              color: '#bb86fc',
              borderColor: '#bb86fc',
              fontWeight: 'bold',
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': { borderColor: '#9a67ea', bgcolor: 'rgba(187, 134, 252, 0.05)' }
            }}
          >
            Створити тип
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/products/create')}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            Додати продукт
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={filterAnchorEl}
        open={filterOpen}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: {
            bgcolor: '#1e1b26',
            color: '#fff',
            border: '1px solid #322d3d',
            borderRadius: '16px',
            p: 2,
            minWidth: '280px',
            mt: 1,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, color: '#a0a0a0', fontWeight: 'bold' }}>Параметри фільтрації</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#a0a0a0' }}>Тип продукту</InputLabel>
            <Select
              value={filterType}
              label="Тип продукту"
              onChange={(e) => { setFilterType(e.target.value); setPage(0); }}
              sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value="">Всі типи</MenuItem>
              {productTypes.map(type => <MenuItem key={type} value={type}>Тип {type}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Дата виготовлення"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterManufactureDate}
            onChange={(e) => { setFilterManufactureDate(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />

          <TextField
            label="Придатний після (мін. дата)"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterExpirationDate}
            onChange={(e) => { setFilterExpirationDate(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />

          <Button fullWidth variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold' }}>
            Застосувати
          </Button>
        </Box>
      </Menu>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '380px', mx: 'auto', width: '100%', px: 1 }}>
          {paginatedProducts?.map((row) => (
            <Card key={row.id} sx={{ width: '100%', bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '12px' }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>{row.name}</Typography>
                  <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(row.id); }} sx={{ color: '#a0a0a0', p: 0.5 }}><MoreHoriz fontSize="small" /></IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Box sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>ID: {row.id}</Box>
                  <Box sx={{ bgcolor: '#322d3d', color: '#a0a0a0', px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem' }}>Тип: {row.productTypeId}</Box>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarToday sx={{ fontSize: 12 }} /> Виготовлено</Typography>
                    <Typography variant="caption" sx={{ color: '#fff', display: 'block' }}>{formatDate(row.manufactureDate)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarToday sx={{ fontSize: 12 }} /> Вжити до</Typography>
                    <Typography variant="caption" sx={{ color: '#fff', display: 'block' }}>{formatDate(row.expirationDate)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #322d3d', borderRadius: '16px', background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Назва</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Тип продукту</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Дата виготовлення</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Термін придатності</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Опис</TableCell>
                <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold', pr: 5 }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts?.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
                  <TableCell sx={{ color: '#fff' }}>{row.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>{row.name}</TableCell>
                  <TableCell sx={{ color: '#bb86fc', fontWeight: 'bold' }}>{row.productTypeId}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{formatDate(row.manufactureDate)}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{formatDate(row.expirationDate)}</TableCell>
                  <TableCell sx={{ color: '#a0a0a0', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.description || '—'}</TableCell>
                  <TableCell align="right" sx={{ pr: 4 }}><IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(row.id); }} sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}><MoreHoriz /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Рядків:"
          sx={{
            color: '#a0a0a0',
            border: 'none',
            '& .MuiTablePagination-spacer': { display: 'none' },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { m: 0 },
            '& .MuiTablePagination-toolbar': { justifyContent: 'center', gap: 2 }
          }}
        />
      </Box>

      <ActionMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onEdit={() => { navigate(`/products/edit/${selectedId}`); setAnchorEl(null); }}
        onDelete={async () => { if (window.confirm("Видалити?")) { await productApi.delete(selectedId); refetch(); } setAnchorEl(null); }}
        onDetails={() => { navigate(`/products/${selectedId}`); setAnchorEl(null); }}
      />
    </Box>
  );
};