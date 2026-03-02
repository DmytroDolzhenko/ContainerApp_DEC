import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, Chip, LinearProgress,
  CircularProgress, IconButton, Alert,
  Dialog, DialogContent, DialogTitle, Stack
} from '@mui/material';
import {
  Close, Edit, QrCode, CleaningServices,
  Download
} from '@mui/icons-material';
import { containerApi } from '../api/containerApi';

import { useAuth } from '../../auth/hooks/useAuth';

export const ContainerDetailsModal = ({ open, onClose, containerId, onEdit, onRefresh }) => {
  const [container, setContainer] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const loadData = useCallback(async () => {
    if (!containerId) return;
    try {
      setLoading(true);
      const data = await containerApi.getById(containerId);
      setContainer(data);

      const code = data.uniqCode || data.UniqCode;
      if (code) {
        try {
          const qrData = await containerApi.getQr(code);
          setQrCode(qrData);
        } catch { console.log("QR code not found"); }
      }
    } catch (error) {
      console.error("Failed to fetch container", error);
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  useEffect(() => {
    if (open) loadData();
  }, [open, loadData]);

  const handleDownloadQr = () => {
    if (!qrCode) return;
    const blob = new Blob([qrCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${container?.uniqCode || 'container'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClean = async () => {
    if (window.confirm("Очистити контейнер?")) {
      try {
        await containerApi.clean(containerId, {});
        loadData();
        onRefresh();
      } catch { alert("Помилка очищення"); }
    }
  };

  if (!open) return null;

  const name = container?.name || container?.Name;
  const productName = container?.productName || container?.ProductName;
  const capacity = container?.capacity ?? container?.Capacity ?? 0;
  const currentCapacity = container?.currentCapacity ?? container?.CurrentCapacity ?? 0;
  const expirationDate = container?.productExpirationDate || container?.expirationDate;
  const createdAt = container?.createdAt || container?.CreatedAt;

  const getExpirationStatus = () => {
    if (!expirationDate || !productName || productName === "Порожньо") return null;
    const expDate = new Date(expirationDate);
    const diffDays = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: "Протерміновано!", color: "error" };
    if (diffDays <= 5) return { label: `Скоро спортиться! (${diffDays} дн.)`, color: "warning" };
    return { label: `Придатний до: ${expDate.toLocaleDateString('uk-UA')}`, color: "success" };
  };

  const expStatus = getExpirationStatus();
  const fillPercentage = capacity > 0 ? Math.min((currentCapacity / capacity) * 100, 100) : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { bgcolor: '#1e1b26', backgroundImage: 'none', borderRadius: '20px', border: '1px solid #322d3d' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <Typography variant="h6" fontWeight="bold">Деталі контейнера</Typography>
        <IconButton onClick={onClose} sx={{ color: '#a0a0a0' }}><Close /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)', p: 3 }}>
        {loading ? (
          <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress color="secondary" /></Box>
        ) : (
          <Box>
            {expStatus && (
              <Alert severity={expStatus.color} sx={{ mb: 3, borderRadius: '12px' }}>{expStatus.label}</Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>{name}</Typography>
                  <Chip
                    label={container?.containerTypeName || "Без типу"}
                    size="small"
                    sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', fontWeight: 'bold' }} 
                  />
                </Box>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="grey.500">Поточний продукт</Typography>
                    <Typography variant="h6" color={productName ? "#bb86fc" : "grey.700"}>
                      {productName || "Порожньо"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="grey.500">Дата створення</Typography>
                    <Typography variant="body1" color="white">
                      {formatDate(createdAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="white">Заповненість: {currentCapacity} / {capacity} L</Typography>
                      <Typography variant="body2" color="#bb86fc" fontWeight="bold">{fillPercentage.toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={fillPercentage}
                      sx={{ height: 10, borderRadius: 5, bgcolor: '#322d3d', '& .MuiLinearProgress-bar': { bgcolor: fillPercentage > 90 ? '#ff5252' : '#bb86fc' } }} 
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                <Box sx={{
                  p: 2, bgcolor: '#fff', borderRadius: '16px', display: 'inline-block', mb: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}>
                  {qrCode ? (
                    <Box
                      dangerouslySetInnerHTML={{ __html: qrCode }}
                      sx={{ '& svg': { width: '180px', height: '180px', display: 'block' } }}
                    />
                  ) : (
                    <Box sx={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode sx={{ fontSize: 100, color: '#eee' }} />
                    </Box>
                  )}
                </Box>
                <br />
                <Button
                  startIcon={<Download />}
                  variant="outlined"
                  disabled={!qrCode}
                  onClick={handleDownloadQr}
                  sx={{ textTransform: 'none', borderRadius: '8px', color: '#bb86fc', borderColor: '#bb86fc' }}
                >
                  Скачати QR-код
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      {isAdmin && (
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end', bgcolor: '#1e1b26' }}>
        <Button startIcon={<CleaningServices />} color="warning" onClick={handleClean} disabled={loading || currentCapacity === 0}>
          Очистити
        </Button>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() => { onClose(); onEdit(containerId); }}
          sx={{ bgcolor: '#bb86fc', color: '#000', '&:hover': { bgcolor: '#9a67ea' } }}
        >
          Редагувати
        </Button>
      </Box>
      )}
    </Dialog>
  );
};