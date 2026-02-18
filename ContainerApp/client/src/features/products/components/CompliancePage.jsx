import React, { useState, useEffect} from 'react';
import {
    Box, Paper, Typography, Button, MenuItem, TextField,
    Alert, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    Chip, Stack, Card
} from '@mui/material';
import { Add, Delete, SwapHoriz, AdminPanelSettings, Category } from '@mui/icons-material';
import { containerApi } from '../../../../src/features/containers/api/containerApi';
import { productApi } from '../../../../src/features/products/api/productApi';

export const CompliancePage = () => {
    const [productTypes, setProductTypes] = useState([]);
    const [containerTypes, setContainerTypes] = useState([]);
    const [compliances, setCompliances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState({ productTypeId: '', containerTypeId: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const loadCompliances = async () => {
        try {
            const response = await productApi.getCompliances?.() || [];
            setCompliances(response);
        } catch (error) {
            console.error("Помилка завантаження відповідностей", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Викликаємо API для отримання саме ТИПІВ
                const [pTypes, cTypes] = await Promise.all([
                    productApi.getTypes?.() || [], 
                    containerApi.getTypes?.() || []
                ]);
                setProductTypes(pTypes);
                setContainerTypes(cTypes);
                await loadCompliances();
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Функції для пошуку назви за ID (щоб в таблиці не було пусто)
    const getProductTypeName = (id) => {
        const type = productTypes.find(t => (t.id || t.Id) === id);
        return type ? (type.name || type.Name) : `Тип #${id}`;
    };

    const getContainerTypeName = (id) => {
        const type = containerTypes.find(t => (t.id || t.Id) === id);
        return type ? (type.name || type.Name) : `Тип #${id}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await productApi.createCompliance(formData);
            setMessage({ type: 'success', text: 'Відповідність додана' });
            setFormData({ productTypeId: '', containerTypeId: '' });
            await loadCompliances();
        } catch {
            setMessage({ type: 'error', text: 'Помилка (можливо, вже існує)' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (pId, cId) => {
        if (!window.confirm("Видалити це правило?")) return;
        try {
            await productApi.deleteCompliance(pId, cId);
            await loadCompliances();
        } catch {
            setMessage({ type: 'error', text: 'Не вдалося видалити' });
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress color="secondary" />
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
            <Stack spacing={4} sx={{ width: '100%', maxWidth: '1000px' }}>
                
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ bgcolor: '#bb86fc', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                        <AdminPanelSettings sx={{ color: '#000' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: '-0.5px' }}>
                            Матриця відповідності
                        </Typography>
                        <Typography sx={{ color: '#777' }}>
                            Керування дозволами для завантаження продуктів у контейнери
                        </Typography>
                    </Box>
                </Box>

                {/* Форма створення (Широкі поля) */}
                <Card sx={{ 
                    p: 4, 
                    bgcolor: '#1e1b26', 
                    border: '1px solid #322d3d', 
                    borderRadius: '20px',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0))'
                }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Оберіть тип продукту"
                                    value={formData.productTypeId}
                                    onChange={(e) => setFormData({...formData, productTypeId: e.target.value})}
                                    required
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: '12px' }, 
                                        '& .MuiInputLabel-root': { color: '#a0a0a0' } 
                                    }}
                                >
                                    {productTypes.map(type => (
                                        <MenuItem key={type.id || type.Id} value={type.id || type.Id}>{type.name || type.Name}</MenuItem>
                                    ))}
                                </TextField>

                                <SwapHoriz sx={{ color: '#322d3d', fontSize: 40, display: { xs: 'none', md: 'block' } }} />

                                <TextField
                                    select
                                    fullWidth
                                    label="Оберіть тип контейнера"
                                    value={formData.containerTypeId}
                                    onChange={(e) => setFormData({...formData, containerTypeId: e.target.value})}
                                    required
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: '12px' }, 
                                        '& .MuiInputLabel-root': { color: '#a0a0a0' } 
                                    }}
                                >
                                    {containerTypes.map(type => (
                                        <MenuItem key={type.id || type.Id} value={type.id || type.Id}>{type.name || type.Name}</MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            {message.text && (
                                <Alert variant="filled" severity={message.type} sx={{ borderRadius: '10px' }}>
                                    {message.text}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={actionLoading}
                                startIcon={!actionLoading && <Add />}
                                sx={{ 
                                    bgcolor: '#bb86fc', 
                                    color: '#000', 
                                    fontWeight: 'bold', 
                                    py: 2, 
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    '&:hover': { bgcolor: '#9a67ea' }
                                }}
                            >
                                {actionLoading ? <CircularProgress size={26} /> : 'Створити нове правило'}
                            </Button>
                        </Stack>
                    </form>
                </Card>

                {/* Таблиця з даними */}
                <TableContainer component={Paper} sx={{ 
                    bgcolor: '#1e1b26', 
                    border: '1px solid #322d3d', 
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#777', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Тип продукту</TableCell>
                                <TableCell sx={{ color: '#777', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Тип контейнера</TableCell>
                                <TableCell align="right" sx={{ color: '#777', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Керування</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {compliances.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                        <Typography sx={{ color: '#444', fontStyle: 'italic' }}>Список відповідностей порожній</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                compliances.map((item, index) => (
                                    <TableRow key={index} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.05)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Category sx={{ color: '#bb86fc', fontSize: 18 }} />
                                                <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                                                    {item.productTypeName || getProductTypeName(item.productTypeId)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.containerTypeName || getContainerTypeName(item.containerTypeId)} 
                                                variant="outlined"
                                                sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#a0a0a0', borderRadius: '8px' }} 
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton 
                                                onClick={() => handleDelete(item.productTypeId, item.containerTypeId)} 
                                                sx={{ 
                                                    color: 'rgba(255, 82, 82, 0.5)', 
                                                    '&:hover': { color: '#ff5252', bgcolor: 'rgba(255, 82, 82, 0.1)' } 
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </Box>
    );
};