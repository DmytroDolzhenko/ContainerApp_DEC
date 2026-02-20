import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Box, IconButton,
  MenuItem, ListItemIcon, ListItemText, Button, Card, CardContent,
  Typography, Divider, useMediaQuery, useTheme, Grid, TablePagination,
  Menu, Tooltip, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, DialogContent, Stack
} from '@mui/material';
import { MoreHoriz, CleaningServices, Add, Inventory, FilterList, RestartAlt, Category, History } from '@mui/icons-material';
import { useContainers } from '../hooks/useContainers';
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { containerApi } from '../api/containerApi';
import { containerHistoryApi } from '../../containerHistory/api/containerHistoryApi';
import { FillContainerModal } from './FillContainerModal'; // Переконайтеся, що файл створено поруч

export const ContainerList = () => {
  const { containers, loading, refetch } = useContainers();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Стейт для фільтрації
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [filterProduct, setFilterProduct] = useState('');

  // Стейт для модального вікна заповнення
  const [fillModalOpen, setFillModalOpen] = useState(false);
  const [containerToFill, setContainerToFill] = useState(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не вказано';
    return new Date(dateString).toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleResetFilters = () => {
    setFilterType('');
    setFilterStatus('all');
    setFilterProduct('');
    setPage(0);
  };

  const getStatusProps = (current, max) => {
    if (current === 0) return { label: "Порожній", color: "default", isEmpty: true };
    if (current >= max) return { label: "Повний", color: "success", isEmpty: false };
    return { label: "У процесі", color: "warning", isEmpty: false };
  };

  const filteredContainers = useMemo(() => {
    return containers?.filter((container) => {
      const name = container.name || container.Name;
      const uniqCode = container.uniqCode || container.UniqCode;
      const productName = container.productName || container.ProductName || '';
      const containerTypeName = container.containerTypeName || container.ContainerTypeName;
      const currentCapacity = container.currentCapacity ?? container.CurrentCapacity ?? 0;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        name?.toLowerCase().includes(searchLower) ||
        uniqCode?.toLowerCase().includes(searchLower) ||
        productName?.toLowerCase().includes(searchLower)
      );

      const matchesType = filterType === '' || containerTypeName === filterType;
      const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'empty' ? currentCapacity === 0 : currentCapacity > 0;
      const matchesProduct = filterProduct === '' || 
        productName.toLowerCase().includes(filterProduct.toLowerCase());

      return matchesSearch && matchesType && matchesStatus && matchesProduct;
    });
  }, [containers, searchTerm, filterType, filterStatus, filterProduct]);

  const paginatedContainers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredContainers?.slice(start, start + rowsPerPage);
  }, [filteredContainers, page, rowsPerPage]);

  const containerTypesList = useMemo(() => {
    const types = containers?.map(c => c.containerTypeName || c.ContainerTypeName).filter(Boolean) || [];
    return [...new Set(types)];
  }, [containers]);

  const handleClear = async (id) => {
    const targetId = id || selectedId;
    if (window.confirm("Очистити вміст контейнера?")) {
      try {
        await containerApi.clean(targetId, {});
        await refetch();
      } catch (error) {
        console.error(error);
      }
    }
    setAnchorEl(null);
  };

  const handleOpenFillModal = (container) => {
    setContainerToFill(container);
    setFillModalOpen(true);
  };

  const handleShowHistory = async () => {
    const id = selectedId;
    setAnchorEl(null);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const data = await containerHistoryApi.getContainerHistory(id);
      setHistoryData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Панель керування */}
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
          {(filterType || filterStatus !== 'all' || filterProduct) && (
            <IconButton onClick={handleResetFilters} sx={{ color: '#ff5252' }}><RestartAlt /></IconButton>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          {!isMobile && (
            <Button
              variant="outlined"
              startIcon={<Category />}
              onClick={() => navigate('/container-types/create')}
              sx={{ color: '#bb86fc', borderColor: '#bb86fc', borderRadius: '10px', textTransform: 'none' }}
            >
              Новий тип
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/containers/create')}
            sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', borderRadius: '10px', textTransform: 'none', '&:hover': { bgcolor: '#9a67ea' } }}
          >
            Додати контейнер
          </Button>
        </Stack>
      </Box>

      {/* Таблиця (Desktop) */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '16px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a0a0a0' }}>Назва / Код</TableCell>
                <TableCell sx={{ color: '#a0a0a0' }}>Тип</TableCell>
                <TableCell sx={{ color: '#a0a0a0' }}>Продукт</TableCell>
                <TableCell sx={{ color: '#a0a0a0' }}>Заповнення</TableCell>
                <TableCell sx={{ color: '#a0a0a0' }}>Статус</TableCell>
                <TableCell sx={{ color: '#a0a0a0' }}>Дата</TableCell>
                <TableCell align="right" sx={{ color: '#a0a0a0' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContainers?.map((row) => {
                const id = row.id ?? row.Id;
                const current = row.currentCapacity ?? row.CurrentCapacity ?? 0;
                const capacity = row.capacity ?? row.Capacity ?? 0;
                const status = getStatusProps(current, capacity);

                return (
                  <TableRow key={id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell>
                      <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{row.name || row.Name}</Typography>
                      <Typography variant="caption" sx={{ color: '#bb86fc' }}>{row.uniqCode || row.UniqCode}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#a0a0a0' }}>{row.containerTypeName || '—'}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{row.productName || '—'}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{current} / {capacity} L</TableCell>
                    <TableCell><Chip label={status.label} color={status.color} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ color: '#777', fontSize: '0.8rem' }}>{formatDate(row.createdAt || row.CreatedAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        {status.isEmpty ? (
                          <Tooltip title="Заповнити">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenFillModal(row)}
                              sx={{ color: '#bb86fc' }}
                            >
                              <Inventory fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Очистити">
                            <IconButton 
                              size="small" 
                              onClick={() => handleClear(id)}
                              sx={{ color: '#ffa726' }}
                            >
                              <CleaningServices fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(id); }} sx={{ color: '#a0a0a0' }}>
                          <MoreHoriz />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Картки (Mobile) */}
      {isMobile && (
        <Stack spacing={2}>
           {paginatedContainers?.map((row) => {
             const id = row.id ?? row.Id;
             const status = getStatusProps(row.currentCapacity ?? 0, row.capacity ?? 0);
             return (
               <Card key={id} sx={{ bgcolor: '#1e1b26', border: '1px solid #322d3d' }}>
                 <CardContent>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{row.name || row.Name}</Typography>
                        <Typography variant="caption" sx={{ color: '#bb86fc' }}>{row.uniqCode || row.UniqCode}</Typography>
                      </Box>
                      <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(id); }} sx={{ color: '#a0a0a0' }}><MoreHoriz /></IconButton>
                   </Box>
                   <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />
                   <Grid container spacing={1}>
                      <Grid item xs={6}><Typography variant="caption" color="grey.500">Продукт</Typography><Typography variant="body2" color="white">{row.productName || '—'}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="grey.500">Об'єм</Typography><Typography variant="body2" color="white">{row.currentCapacity ?? 0}/{row.capacity ?? 0}L</Typography></Grid>
                   </Grid>
                   {status.isEmpty ? (
                     <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<Inventory />} 
                      onClick={() => handleOpenFillModal(row)}
                      sx={{ mt: 2, color: '#bb86fc', borderColor: '#bb86fc', textTransform: 'none' }}
                     >
                       Заповнити
                     </Button>
                   ) : (
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<CleaningServices />} 
                      onClick={() => handleClear(id)}
                      sx={{ mt: 2, color: '#ffa726', borderColor: '#ffa726', textTransform: 'none' }}
                     >
                       Очистити
                     </Button>
                   )}
                 </CardContent>
               </Card>
             );
           })}
        </Stack>
      )}

      <TablePagination
        component="div"
        count={filteredContainers?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        sx={{ color: '#a0a0a0' }}
      />

      {/* Menu Фільтрації */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{ sx: { bgcolor: '#1e1b26', color: '#fff', p: 2, minWidth: '250px', border: '1px solid #322d3d' } }}
      >
        <Stack spacing={2}>
           <Typography variant="subtitle2">Фільтрація</Typography>
           
           <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#777' }}>Тип тари</InputLabel>
              <Select value={filterType} label="Тип тари" onChange={(e) => setFilterType(e.target.value)} sx={{ color: '#fff' }}>
                <MenuItem value="">Всі</MenuItem>
                {containerTypesList.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
           </FormControl>

           <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#777' }}>Стан</InputLabel>
              <Select value={filterStatus} label="Стан" onChange={(e) => setFilterStatus(e.target.value)} sx={{ color: '#fff' }}>
                <MenuItem value="all">Будь-який</MenuItem>
                <MenuItem value="empty">Тільки порожні</MenuItem>
                <MenuItem value="filled">З продуктом</MenuItem>
              </Select>
           </FormControl>

           <TextField 
              label="Пошук продукту"
              size="small"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              placeholder="Введіть назву..."
              sx={{ input: { color: 'white' }, label: { color: '#777' } }}
           />

           <Button variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ bgcolor: '#bb86fc', color: '#000' }}>Застосувати</Button>
        </Stack>
      </Menu>

      <ActionMenu 
        anchorEl={anchorEl} 
        open={open} 
        onClose={() => setAnchorEl(null)} 
        onEdit={() => navigate(`/containers/edit/${selectedId}`)} 
        onDelete={async () => { if(confirm("Видалити?")) { await containerApi.delete(selectedId); refetch(); } setAnchorEl(null); }} 
        onDetails={() => navigate(`/containers/${selectedId}`)}
      >
        <MenuItem onClick={handleShowHistory}>
          <ListItemIcon><History fontSize="small" sx={{ color: '#bb86fc' }} /></ListItemIcon>
          <ListItemText>Історія</ListItemText>
        </MenuItem>
      </ActionMenu>

      {/* Модальне вікно заповнення */}
      <FillContainerModal 
        open={fillModalOpen} 
        onClose={() => setFillModalOpen(false)} 
        container={containerToFill} 
        onRefresh={refetch} 
      />

      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1e1b26', color: '#fff' } }}>
        <DialogTitle>Історія контейнера</DialogTitle>
        <DialogContent>
          {historyLoading ? <CircularProgress size={24} /> : historyData.map(h => (
            <Box key={h.id} sx={{ mb: 2, p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ color: '#bb86fc' }}>{h.action}</Typography>
              <Typography variant="caption" sx={{ color: '#777' }}>{formatDate(h.updatedAt)}</Typography>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};