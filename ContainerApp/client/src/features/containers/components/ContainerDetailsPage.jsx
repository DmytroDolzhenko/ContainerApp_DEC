import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, Grid, Chip, LinearProgress,
  CircularProgress, Divider, IconButton, Tooltip, Alert
} from '@mui/material';
import { ArrowBack, Edit, QrCode, CleaningServices, WaterDrop, WarningAmber, EventAvailable } from '@mui/icons-material';
import { containerApi } from '../api/containerApi';

export const ContainerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [container, setContainer] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await containerApi.getById(id);
      setContainer(data);

      const code = data.uniqCode || data.UniqCode;
      if (code) {
        try {
          const qrData = await containerApi.getQr(code);
          setQrCode(qrData);
        } catch {
          console.log("QR code not found");
        }
      }
    } catch (error) {
      console.error("Failed to fetch container", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClean = async () => {
    if (window.confirm("Очистити контейнер?")) {
      try {
        await containerApi.clean(id, {});
        loadData();
      } catch {
        alert("Помилка очищення");
      }
    }
  };

  const handleFill = async () => {
    try {
      await containerApi.fill(id, {
        productId: container.productId || container.ProductId,
        amount: container.capacity || container.Capacity
      });
      loadData();
    } catch {
      alert("Помилка заповнення");
    }
  };

  if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!container) return <Typography sx={{ color: 'white', p: 5 }}>Контейнер не знайдено</Typography>;

  const name = container.name || container.Name;
  const containerTypeName = container.containerTypeName || container.ContainerTypeName || "Без типу";
  const productName = container.productName || container.ProductName;
  const createdAt = container.createdAt || container.CreatedAt || container.registrationDate || container.RegistrationDate;
  const capacity = container.capacity ?? container.Capacity;
  const currentCapacity = container.currentCapacity ?? container.CurrentCapacity;
  const description = container.description || container.Description;
  const expirationDate = container.productExpirationDate || container.expirationDate || container.ExpirationDate;

  const getExpirationStatus = () => {
    if (!expirationDate || !productName || productName === "Порожньо") return null;

    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: "Протерміновано!", color: "error", icon: <WarningAmber /> };
    if (diffDays <= 5) return { label: `Контейнер скоро спортиться! (залишилось ${diffDays} дн.)`, color: "warning", icon: <WarningAmber /> };
    return { label: `Придатний до: ${expDate.toLocaleDateString('uk-UA')}`, color: "success", icon: <EventAvailable /> };
  };

  const expStatus = getExpirationStatus();
  const fillPercentage = capacity > 0 ? Math.min((currentCapacity / capacity) * 100, 100) : 0;

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/containers')}
          sx={{ color: '#a0a0a0', '&:hover': { color: '#fff' }, textTransform: 'none' }}
        >
          Назад до списку
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="warning" startIcon={<CleaningServices />} onClick={handleClean} sx={{ borderRadius: '10px' }}>
            Очистити
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/containers/edit/${id}`)}
            sx={{ bgcolor: '#bb86fc', color: '#000', fontWeight: 'bold', borderRadius: '10px', '&:hover': { bgcolor: '#9a67ea' } }}
          >
            Редагувати
          </Button>
        </Box>
      </Box>

      {expStatus && (
        <Alert 
          severity={expStatus.color} 
          icon={expStatus.icon}
          sx={{ mb: 3, borderRadius: '12px', fontWeight: 'bold' }}
        >
          {expStatus.label}
        </Alert>
      )}

      <Paper sx={{
          p: 4,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e1b26 0%, #231e2e 100%)',
          border: '1px solid #322d3d',
          color: '#fff'
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {name}
                </Typography>
                <Chip
                    label={containerTypeName}
                    sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', color: '#bb86fc', fontWeight: 'bold' }}
                />
            </Box>

            <Typography variant="body2" sx={{ color: '#a0a0a0', mb: 1 }}>Опис:</Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {description || "Опис відсутній"}
            </Typography>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Продукт</Typography>
                    <Typography variant="h6" sx={{ color: productName ? '#fff' : '#555' }}>
                      {productName || "Порожньо"}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>Дата створення</Typography>
                    <Typography variant="body1">
                    {createdAt ? formatDate(createdAt) : '—'}
                    </Typography>
                </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
             <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Заповненість</Typography>
                    <Tooltip title="Заповнити повністю">
                        <IconButton size="small" onClick={handleFill} sx={{ color: '#29b6f6' }}>
                            <WaterDrop />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>{currentCapacity} L</Typography>
                    <Typography variant="body2" sx={{ color: '#a0a0a0' }}>макс. {capacity} L</Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={fillPercentage}
                    sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: fillPercentage > 90 ? '#ff5252' : '#bb86fc'
                        }
                    }}
                />
                <Typography sx={{ mt: 1, textAlign: 'right', color: '#bb86fc', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {fillPercentage.toFixed(1)}%
                </Typography>
             </Paper>
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: 'flex-start' }}>
            {qrCode ? (
              <Box sx={{
                p: 1.5,
                bgcolor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                maxWidth: '180px',
                width: '100%',
                '& svg': { width: '100%', height: 'auto', display: 'block' }
              }}
              dangerouslySetInnerHTML={{ __html: qrCode }}
              />
            ) : (
              <Box sx={{
                p: 3,
                border: '2px dashed #322d3d',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '180px',
                aspectRatio: '1/1'
              }}>
                <QrCode sx={{ fontSize: 40, color: '#322d3d', mb: 1 }} />
                <Typography variant="caption" sx={{ color: '#a0a0a0' }}>QR відсутній</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};