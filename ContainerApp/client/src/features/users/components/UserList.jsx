import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Box, IconButton, Alert, Chip, Button,
  Card, CardContent, Typography, Divider, useMediaQuery, useTheme,
  TablePagination, TextField, MenuItem, FormControl, InputLabel, Select, Menu, Tooltip, Stack
} from '@mui/material';
import { MoreHoriz, Add, FilterList, RestartAlt, CalendarToday } from '@mui/icons-material';
import { useUsers } from "../hooks/useUsers";
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { userApi } from '../api/usersApi';

import { UserCreateModal } from './UserCreateModal';
import { UserEditModal } from './UserEditModal';
import { UserDetailsModal } from './UserDetailsModal';

export const UserList = () => {
  const { users, loading, error, refetch } = useUsers();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [userIdToView, setUserIdToView] = useState(null);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterRole, setFilterRole] = useState('');
  const [filterRegDate, setFilterRegDate] = useState('');

  const roleMap = { 1: 'Адмін', 2: 'Оператор' };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  // Функції пагінації
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleResetFilters = () => {
    setFilterRole('');
    setFilterRegDate('');
    setPage(0);
  };

  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
      const matchesRole = filterRole === '' || user.role === Number(filterRole);
      const matchesDate = !filterRegDate || (
        user.registrationDate && 
        new Date(user.registrationDate).getTime() >= new Date(filterRegDate).getTime()
      );
      return matchesSearch && matchesRole && matchesDate;
    });
  }, [users, searchTerm, filterRole, filterRegDate]);

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredUsers?.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const rolesList = useMemo(() => {
    const uniqueRoles = users?.map(u => u.role).filter(r => r !== undefined && r !== null) || [];
    return [...new Set(uniqueRoles)];
  }, [users]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress color="primary" /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error" variant="outlined">{error}</Alert></Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              textTransform: 'none',
              bgcolor: (filterRole || filterRegDate) ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
              '&:hover': { borderColor: '#bb86fc', bgcolor: 'rgba(187, 134, 252, 0.05)' }
            }}
          >
            Фільтри {(filterRole || filterRegDate) ? '•' : ''}
          </Button>

          {(filterRole || filterRegDate) && (
            <Tooltip title="Скинути фільтри">
              <IconButton onClick={handleResetFilters} sx={{ color: '#ff5252' }}>
                <RestartAlt />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold',
            borderRadius: '10px', textTransform: 'none', '&:hover': { bgcolor: '#9a67ea' }
          }}
        >
          Додати користувача
        </Button>
      </Box>

      {!isMobile ? (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #322d3d', borderRadius: '16px', background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)', overflow: 'hidden' }}>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '30%' }}>Користувач / Email</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '150px' }}>Роль</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '150px' }}>Зареєстровано</TableCell>
                <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '80px', pr: 2 }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers?.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
                  <TableCell>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{row.fullName}</Typography>
                    <Typography variant="caption" sx={{ color: '#bb86fc' }}>{row.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={roleMap[row.role] || row.role} size="small" variant="outlined" sx={{ color: '#bb86fc', borderColor: '#bb86fc' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{formatDate(row.registrationDate)}</TableCell>
                  <TableCell align="right" sx={{ pr: 1 }}>
                    <IconButton onClick={(e) => handleMenuClick(e, row.id)} sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}>
                      <MoreHoriz />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Stack spacing={2}>
          {paginatedUsers?.map((row) => (
            <Card key={row.id} sx={{ bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '12px' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>{row.fullName}</Typography>
                    <Typography variant="caption" sx={{ color: '#bb86fc' }}>{row.email}</Typography>
                  </Box>
                  <IconButton onClick={(e) => handleMenuClick(e, row.id)} sx={{ color: '#a0a0a0', p: 0.5 }}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Chip label={roleMap[row.role] || row.role} size="small" variant="outlined" sx={{ color: '#bb86fc', borderColor: '#bb86fc', height: '20px', fontSize: '0.65rem' }} />
                  <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#777', px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem' }}>ID: {row.id}</Box>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />
                <Typography variant="caption" sx={{ color: '#777', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 12 }} /> Реєстрація: {formatDate(row.registrationDate)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Рядків:"
          sx={{ color: '#a0a0a0', border: 'none' }}
        />
      </Box>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{ sx: { bgcolor: '#1e1b26', color: '#fff', p: 2, minWidth: '250px', border: '1px solid #322d3d', borderRadius: '16px' } }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle2" sx={{ color: '#a0a0a0', fontWeight: 'bold' }}>Фільтрація</Typography>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#a0a0a0' }}>Роль</InputLabel>
            <Select
              value={filterRole} label="Роль"
              onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
              sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value="">Всі ролі</MenuItem>
              {rolesList.map(role => <MenuItem key={role} value={role}>{roleMap[role] || role}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Зареєстрований після" type="date" fullWidth size="small"
            InputLabelProps={{ shrink: true }}
            value={filterRegDate}
            onChange={(e) => { setFilterRegDate(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />
          <Button fullWidth variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold' }}>
            Застосувати
          </Button>
        </Stack>
      </Menu>

      <ActionMenu
        anchorEl={anchorEl} open={open} onClose={handleMenuClose}
        onEdit={() => { setEditModalOpen(true); handleMenuClose(); }}
        onDelete={async () => {
          if (window.confirm("Видалити цього користувача?")) {
            try { await userApi.delete(selectedId); refetch(); } 
            catch (err) { console.error(err); alert("Помилка видалення"); }
          }
          handleMenuClose();
        }}
        onDetails={() => { setUserIdToView(selectedId); setDetailsModalOpen(true); handleMenuClose(); }}
      />

      <UserCreateModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onRefresh={refetch} />
      <UserEditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} userId={selectedId} onRefresh={refetch} />
      <UserDetailsModal 
        open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} 
        userId={userIdToView}
        onEditClick={(id) => { setDetailsModalOpen(false); setSelectedId(id); setEditModalOpen(true); }}
      />
    </Box>
  );
};