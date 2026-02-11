import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Box, Chip, Alert
} from '@mui/material';
import { useContainerHistories } from "../hooks/useContainerHistories";

export const ContainerHistoryList = () => {
  const { containerHistories, loading, error } = useContainerHistories();

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
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        boxShadow: 'none',
        border: '1px solid #322d3d',
        background: 'transparent'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#a0a0a0' }}>ID</TableCell>
            <TableCell sx={{ color: '#a0a0a0' }}>Action</TableCell>
            <TableCell sx={{ color: '#a0a0a0' }}>Container ID</TableCell>
            <TableCell sx={{ color: '#a0a0a0' }}>Product ID</TableCell>
            <TableCell sx={{ color: '#a0a0a0' }}>User ID</TableCell>
            <TableCell sx={{ color: '#a0a0a0' }}>Date & Time</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {containerHistories && containerHistories.length > 0 ? (
            containerHistories.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                }}
              >
                <TableCell>{row.id}</TableCell>

                <TableCell>
                  <Chip
                    label={row.action}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell sx={{ color: '#fff' }}>{row.containerId}</TableCell>
                <TableCell>{row.productId || '—'}</TableCell>
                <TableCell>{row.userId}</TableCell>

                <TableCell sx={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                  {new Date(row.updatedAt).toLocaleString('uk-UA')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                Історія порожня
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};