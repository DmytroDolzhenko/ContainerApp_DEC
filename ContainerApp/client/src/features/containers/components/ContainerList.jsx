import {
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Checkbox, Chip, CircularProgress, Box 
} from '@mui/material';
import { useContainers } from '../hooks/useContainers';

export const ContainerList = () => {
  const { containers, loading } = useContainers();

  // 1. Використовуємо 'loading' для відображення спінера
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'none', border: '1px solid #322d3d', background: 'transparent' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"><Checkbox /></TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Desc</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {containers.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.containerTypeId}</TableCell>
              <TableCell>{row.productName || '—'}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.currentCapacity} / {row.capacity} L</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                <Chip
                  label={row.currentCapacity > 0 ? "Active" : "Empty"} 
                  color={row.currentCapacity > 0 ? "primary" : "default"}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: row.currentCapacity > 0 ? '' : '#444' }}
                />
              </TableCell>
            </TableRow>
          ))}
          {/* 2. Обробка порожнього списку */}
          {containers.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                Контейнерів не знайдено
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};