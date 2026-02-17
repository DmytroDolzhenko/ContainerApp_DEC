import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Box, IconButton,
  MenuItem, ListItemIcon, ListItemText, Button, Card, CardContent,
  Typography, Divider, useMediaQuery, useTheme, Grid, TablePagination,
  Menu, Tooltip, FormControl, InputLabel, Select, TextField
} from '@mui/material';
import { MoreHoriz, CleaningServices, Add, Inventory, FilterList, RestartAlt, CalendarToday, Person, Storage } from '@mui/icons-material';
import { useContainers } from '../hooks/useContainers';
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { containerApi } from '../api/containerApi';

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
  const filterOpen = Boolean(filterAnchorEl);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterType, setFilterType] = useState('');
  const [filterCreatedAt, setFilterCreatedAt] = useState('');
  const [filterCreatedBy, setFilterCreatedBy] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleResetFilters = () => {
    setFilterType('');
    setFilterCreatedAt('');
    setFilterCreatedBy('');
    setFilterCapacity('');
    setPage(0);
  };

  const getStatusProps = (current, max) => {
    if (current === 0) return { label: "Порожній", color: "default", borderColor: '#444' };
    if (current >= max) return { label: "Повний", color: "success", borderColor: '' };
    return { label: "У процесі", color: "warning", borderColor: '' };
  };

  const filteredContainers = useMemo(() => {
    return containers?.filter((container) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        container.name?.toLowerCase().includes(searchLower) ||
        container.uniqCode?.toLowerCase().includes(searchLower) ||
        container.productName?.toLowerCase().includes(searchLower)
      );

      const matchesType = filterType === '' || container.containerTypeId === Number(filterType);
      const matchesCreatedBy = filterCreatedBy === '' || container.lastModifiedBy?.toLowerCase().includes(filterCreatedBy.toLowerCase());
      const matchesDate = !filterCreatedAt || container.createdAt?.startsWith(filterCreatedAt);
      const matchesCapacity = !filterCapacity || container.capacity >= Number(filterCapacity);

      return matchesSearch && matchesType && matchesCreatedBy && matchesDate && matchesCapacity;
    });
  }, [containers, searchTerm, filterType, filterCreatedBy, filterCreatedAt, filterCapacity]);

  const paginatedContainers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredContainers?.slice(start, start + rowsPerPage);
  }, [filteredContainers, page, rowsPerPage]);

  const containerTypes = useMemo(() => {
    const types = containers?.map(c => c.containerTypeId) || [];
    return [...new Set(types)];
  }, [containers]);

  const handleClear = async () => {
    if (window.confirm("Ви впевнені, що хочете очистити вміст контейнера?")) {
      try {
        await containerApi.clean(selectedId, {});
        await refetch();
      } catch (error) {
        console.error("Помилка очищення", error);
      }
    }
    setAnchorEl(null);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
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
              bgcolor: (filterType || filterCreatedAt || filterCreatedBy || filterCapacity) ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
              '&:hover': { borderColor: '#bb86fc', bgcolor: 'rgba(187, 134, 252, 0.05)' }
            }}
          >
            Фільтри {(filterType || filterCreatedAt || filterCreatedBy || filterCapacity) ? '•' : ''}
          </Button>

          {(filterType || filterCreatedAt || filterCreatedBy || filterCapacity) && (
            <Tooltip title="Скинути фільтри">
              <IconButton onClick={handleResetFilters} sx={{ color: '#ff5252' }}>
                <RestartAlt />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isMobile && (
            <Button
              variant="outlined"
              startIcon={<Inventory />}
              onClick={() => navigate('/containers/fill')}
              sx={{
                color: '#bb86fc',
                borderColor: '#bb86fc',
                fontWeight: 'bold',
                borderRadius: '10px',
                textTransform: 'none',
              }}
            >
              Заповнити
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/containers/create')}
            sx={{
              bgcolor: '#bb86fc',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '10px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#9a67ea' }
            }}
          >
            Додати контейнер
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#a0a0a0' }}>Тип контейнера</InputLabel>
            <Select
              value={filterType}
              label="Тип контейнера"
              onChange={(e) => { setFilterType(e.target.value); setPage(0); }}
              sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value="">Всі типи</MenuItem>
              {containerTypes.map(type => <MenuItem key={type} value={type}>Тип {type}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Дата створення"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterCreatedAt}
            onChange={(e) => { setFilterCreatedAt(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />

          <TextField
            label="Хто створив"
            fullWidth
            size="small"
            placeholder="Ім'я користувача..."
            value={filterCreatedBy}
            onChange={(e) => { setFilterCreatedBy(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />

          <TextField
            label="Мін. Об'єм (L)"
            type="number"
            fullWidth
            size="small"
            value={filterCapacity}
            onChange={(e) => { setFilterCapacity(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />

          <Button fullWidth variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold' }}>
            Застосувати
          </Button>
        </Box>
      </Menu>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', mx: 'auto', width: '100%', px: 1, boxSizing: 'border-box' }}>
          {paginatedContainers?.map((row) => {
            const status = getStatusProps(row.currentCapacity, row.capacity);
            return (
              <Card key={row.id} sx={{ width: '100%', bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '12px', boxSizing: 'border-box' }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>{row.name}</Typography>
                    <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(row.id); }} sx={{ color: '#a0a0a0', p: 0.5 }}><MoreHoriz fontSize="small" /></IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>{row.uniqCode}</Box>
                    <Box sx={{ bgcolor: '#322d3d', color: '#a0a0a0', px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem' }}>Тип: {row.containerTypeId}</Box>
                    <Chip label={status.label} color={status.color} size="small" variant="outlined" sx={{ height: '20px', fontSize: '0.65rem' }} />
                  </Box>
                  
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />
                  
                  <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#a0a0a0', display: 'block' }}>Продукт</Typography>
                      <Typography variant="body2" sx={{ color: '#fff' }}>{row.productName || '—'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#a0a0a0', display: 'block' }}>Місткість</Typography>
                      <Typography variant="body2" sx={{ color: '#fff' }}>{row.currentCapacity} / {row.capacity} L</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1, borderRadius: '8px' }}>
                    <Typography variant="caption" sx={{ color: '#777', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 10 }} /> Створено: {formatDate(row.createdAt)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#777', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Person sx={{ fontSize: 10 }} /> Ред: {row.lastModifiedBy || 'System'} • {formatDate(row.lastModifiedAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #322d3d', borderRadius: '16px', background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)', overflow: 'hidden' }}>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '50px' }}>ID</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '120px' }}>Назва</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '100px' }}>Код</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '100px' }}>Тип</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '120px' }}>Продукт</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '100px' }}>Об'єм</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '100px' }}>Статус</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '140px' }}>Створено</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '100px' }}>Редактор</TableCell>
                <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '60px', pr: 2 }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContainers?.map((row) => {
                const status = getStatusProps(row.currentCapacity, row.capacity);
                return (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
                    <TableCell sx={{ color: '#fff' }}>{row.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                    <TableCell sx={{ color: '#bb86fc', fontFamily: 'monospace' }}>{row.uniqCode}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{row.containerTypeId}</TableCell>
                    <TableCell sx={{ color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.productName || '—'}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{row.currentCapacity}/{row.capacity}L</TableCell>
                    <TableCell><Chip label={status.label} color={status.color} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ color: '#a0a0a0', fontSize: '0.75rem' }}>{formatDate(row.createdAt)}</TableCell>
                    <TableCell sx={{ color: '#a0a0a0', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.lastModifiedBy || '—'}</TableCell>
                    <TableCell align="right" sx={{ pr: 1 }}>
                      <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(row.id); }} sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}>
                        <MoreHoriz />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '100%' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredContainers?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Рядків:"
          sx={{
            color: '#a0a0a0',
            border: 'none',
            '& .MuiTablePagination-spacer': { display: 'none' },
            '& .MuiTablePagination-toolbar': { justifyContent: 'center', gap: 2 }
          }}
        />
      </Box>

      <ActionMenu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} onEdit={() => { navigate(`/containers/edit/${selectedId}`); setAnchorEl(null); }} onDelete={async () => { if (window.confirm("Видалити?")) { await containerApi.delete(selectedId); refetch(); } setAnchorEl(null); }} onDetails={() => { navigate(`/containers/${selectedId}`); setAnchorEl(null); }}>
        <MenuItem onClick={handleClear} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
          <ListItemIcon><CleaningServices fontSize="small" sx={{ color: '#ffa726' }} /></ListItemIcon>
          <ListItemText>Очистити</ListItemText>
        </MenuItem>
      </ActionMenu>
    </Box>
  );
};