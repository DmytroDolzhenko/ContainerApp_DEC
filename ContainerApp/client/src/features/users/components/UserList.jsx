import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Box, IconButton, Alert, Chip, Button,
  Card, CardContent, Typography, Divider, useMediaQuery, useTheme, Grid,
  TablePagination, TextField, MenuItem, FormControl, InputLabel, Select, Menu, Tooltip
} from '@mui/material';
import { MoreHoriz, Add, FilterList, RestartAlt, CalendarToday } from '@mui/icons-material';
import { useUsers } from "../hooks/useUsers";
import { ActionMenu } from '../../../layouts/components/ui/ActionMenu';
import { userApi } from '../api/usersApi';

export const UserList = () => {
  const { users, loading, error, refetch } = useUsers();
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

  const [filterRole, setFilterRole] = useState('');
  const [filterRegDate, setFilterRegDate] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = () => {
    navigate(`/users/edit/${selectedId}`);
    handleMenuClose();
  };

  const handleDetails = () => {
    navigate(`/users/${selectedId}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Ви дійсно хочете видалити цього користувача?")) {
      try {
        await userApi.delete(selectedId);
        await refetch();
      } catch (err) {
        console.error("Failed to delete user", err);
        alert("Не вдалося видалити користувача");
      }
    }
    handleMenuClose();
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
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        String(user.id).includes(searchLower)
      );

      const matchesRole = filterRole === '' || user.role === filterRole;
      
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

  const roles = useMemo(() => {
    const uniqueRoles = users?.map(u => u.role).filter(Boolean) || [];
    return [...new Set(uniqueRoles)];
  }, [users]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress color="primary" /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error" variant="outlined">{error}</Alert></Box>;

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
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/users/create')}
          sx={{
            bgcolor: '#bb86fc',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#9a67ea' }
          }}
        >
          Створити користувача
        </Button>
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
            <InputLabel sx={{ color: '#a0a0a0' }}>Роль</InputLabel>
            <Select
              value={filterRole}
              label="Роль"
              onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
              sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value="">Всі ролі</MenuItem>
              {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Зареєстрований після"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterRegDate}
            onChange={(e) => { setFilterRegDate(e.target.value); setPage(0); }}
            sx={{ '& input': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '& .MuiInputLabel-root': { color: '#a0a0a0' } }}
          />

          <Button fullWidth variant="contained" onClick={() => setFilterAnchorEl(null)} sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', mt: 1 }}>
            Застосувати
          </Button>
        </Box>
      </Menu>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '380px', mx: 'auto', width: '100%', px: 1, boxSizing: 'border-box' }}>
          {paginatedUsers?.map((row) => (
            <Card key={row.id} sx={{ width: '100%', bgcolor: '#1e1b26', border: '1px solid #322d3d', borderRadius: '12px', boxSizing: 'border-box' }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>{row.fullName}</Typography>
                  <IconButton onClick={(e) => handleMenuClick(e, row.id)} sx={{ color: '#a0a0a0', p: 0.5, mt: -0.5 }}><MoreHoriz fontSize="small" /></IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: '#a0a0a0', mb: 1.5 }}>{row.email}</Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Chip label={row.role} size="small" variant="outlined" sx={{ color: '#bb86fc', borderColor: '#bb86fc', height: '20px', fontSize: '0.65rem' }} />
                  <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#777', px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem' }}>ID: {row.id}</Box>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1.5 }} />
                
                <Typography variant="caption" sx={{ color: '#777', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 12 }} /> Реєстрація: {formatDate(row.registrationDate)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #322d3d', borderRadius: '16px', background: 'linear-gradient(135deg, #231e2e 0%, #050505 100%)', overflow: 'hidden' }}>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '60px' }}>ID</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '25%' }}>Повне ім'я</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '30%' }}>Email</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '120px' }}>Роль</TableCell>
                <TableCell sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '150px' }}>Зареєстровано</TableCell>
                <TableCell align="right" sx={{ color: '#a0a0a0', fontWeight: 'bold', width: '80px', pr: 5 }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers?.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
                  <TableCell sx={{ color: '#fff' }}>{row.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.fullName}</TableCell>
                  <TableCell sx={{ color: '#a0a0a0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.email}</TableCell>
                  <TableCell>
                    <Chip label={row.role} size="small" variant="outlined" sx={{ color: '#bb86fc', borderColor: '#bb86fc' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{formatDate(row.registrationDate)}</TableCell>
                  <TableCell align="right" sx={{ pr: 4 }}>
                    <IconButton onClick={(e) => handleMenuClick(e, row.id)} sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' } }}>
                      <MoreHoriz />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '100%' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Рядків:"
          sx={{
            color: '#a0a0a0',
            border: 'none',
            '& .MuiTablePagination-spacer': { display: 'none' },
            '& .MuiTablePagination-toolbar': { justifyContent: 'center', gap: 2 }
          }}
        />
      </Box>

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