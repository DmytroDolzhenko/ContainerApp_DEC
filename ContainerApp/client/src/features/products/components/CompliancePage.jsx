import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, MenuItem, TextField,
    Alert, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Divider
} from '@mui/material';
import { Add, ArrowRightAlt, Delete } from '@mui/icons-material';
import { containerApi } from '../../../../src/features/containers/api/containerApi';
import { productApi } from '../../../../src/features/products/api/productApi';

export const CompliancePage = () => {
    const [productTypes, setProductTypes] = useState([]);
    const [containerTypes, setContainerTypes] = useState([]);
    const [compliances, setCompliances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ productTypeId: '', containerTypeId: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const loadCompliances = async () => {
        try {
            const response = await productApi.getCompliances?.() || [];
            setCompliances(response);
        } catch (error) {
            console.error("Не вдалося завантажити список відповідностей", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [pTypes, cTypes] = await Promise.all([
                    productApi.getAll(),
                    containerApi.getAll()
                ]);
                setProductTypes(pTypes);
                setContainerTypes(cTypes);
                await loadCompliances();
            } catch (error) {
                setMessage({ type: 'error', text: 'Помилка завантаження даних' });
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            await productApi.createCompliance(formData);
            setMessage({ type: 'success', text: 'Відповідність успішно створена!' });
            setFormData({ productTypeId: '', containerTypeId: '' });
            await loadCompliances();
        } catch {
            setMessage({ type: 'error', text: "Не вдалося створити зв'язок. Можливо, він уже існує." });
        }
    };

    const handleDelete = async (pId, cId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю відповідність?")) return;
        try {
            await productApi.deleteCompliance(pId, cId);
            await loadCompliances();
            setMessage({ type: 'success', text: 'Відповідність видалено' });
        } catch {
            setMessage({ type: 'error', text: 'Помилка при видаленні' });
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Paper sx={{ p: 4, maxWidth: 600, width: '100%', bgcolor: '#1e1b26', color: '#fff' }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#bb86fc' }}>
                        Налаштування відповідності типів
                    </Typography>

                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({type: '', text: ''})}>
                            {message.text}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                select
                                label="Тип продукту"
                                value={formData.productTypeId}
                                onChange={(e) => setFormData({...formData, productTypeId: e.target.value})}
                                fullWidth
                                required
                            >
                                {productTypes.map(type => (
                                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                ))}
                            </TextField>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ArrowRightAlt sx={{ transform: 'rotate(90deg)', fontSize: 40, color: '#bb86fc' }} />
                            </Box>

                            <TextField
                                select
                                label="Тип контейнера"
                                value={formData.containerTypeId}
                                onChange={(e) => setFormData({...formData, containerTypeId: e.target.value})}
                                fullWidth
                                required
                            >
                                {containerTypes.map(type => (
                                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                ))}
                            </TextField>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Add />}
                                sx={{ mt: 2, bgcolor: '#bb86fc', '&:hover': { bgcolor: '#9a67ea' }, fontWeight: 'bold' }}
                            >
                                Додати правило відповідності
                            </Button>
                        </Box>
                    </form>
                </Paper>

                <TableContainer component={Paper} sx={{ maxWidth: 800, bgcolor: '#1e1b26', color: '#fff' }}>
                    <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                        Існуючі правила
                    </Typography>
                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#bb86fc', fontWeight: 'bold' }}>Тип продукту</TableCell>
                                <TableCell align="center" sx={{ color: '#bb86fc' }}></TableCell>
                                <TableCell sx={{ color: '#bb86fc', fontWeight: 'bold' }}>Тип контейнера</TableCell>
                                <TableCell align="right" sx={{ color: '#bb86fc', fontWeight: 'bold' }}>Дії</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {compliances.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#aaa' }}>
                                        Правил ще не створено
                                    </TableCell>
                                </TableRow>
                            ) : (
                                compliances.map((item, index) => (
                                    <TableRow key={`${item.productTypeId}-${item.containerTypeId}-${index}`}>
                                        <TableCell sx={{ color: '#fff' }}>
                                            {item.productTypeName || productTypes.find(t => t.id === item.productTypeId)?.name || item.productTypeId}
                                        </TableCell>
                                        <TableCell align="center">
                                            <ArrowRightAlt sx={{ color: '#555' }} />
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                            {item.containerTypeName || containerTypes.find(t => t.id === item.containerTypeId)?.name || item.containerTypeId}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton 
                                                onClick={() => handleDelete(item.productTypeId, item.containerTypeId)}
                                                sx={{ color: '#ff5252' }}
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
            </Box>
        </Box>
    );
};