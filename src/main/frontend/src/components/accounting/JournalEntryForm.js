import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    IconButton,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const JournalEntryForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        date: new Date(),
        description: '',
        details: [
            {
                accountId: '',
                debitAmount: 0,
                creditAmount: 0,
                description: ''
            }
        ]
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('/api/accounting/accounts');
            setAccounts(response.data);
        } catch (err) {
            setError('계정 목록을 불러오는 중 오류가 발생했습니다.');
            console.error('Error fetching accounts:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            // 차변과 대변 금액이 같은지 확인
            const totalDebit = formData.details.reduce((sum, detail) => sum + (detail.debitAmount || 0), 0);
            const totalCredit = formData.details.reduce((sum, detail) => sum + (detail.creditAmount || 0), 0);

            if (totalDebit !== totalCredit) {
                throw new Error('차변과 대변의 금액이 일치하지 않습니다.');
            }

            await axios.post('/api/accounting/journal', formData);
            navigate('/accounting/journal');
        } catch (err) {
            setError(err.response?.data?.message || err.message || '분개 등록 중 오류가 발생했습니다.');
            console.error('Error creating journal entry:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDetail = () => {
        setFormData({
            ...formData,
            details: [
                ...formData.details,
                {
                    accountId: '',
                    debitAmount: 0,
                    creditAmount: 0,
                    description: ''
                }
            ]
        });
    };

    const handleRemoveDetail = (index) => {
        setFormData({
            ...formData,
            details: formData.details.filter((_, i) => i !== index)
        });
    };

    const handleDetailChange = (index, field, value) => {
        const newDetails = [...formData.details];
        newDetails[index] = {
            ...newDetails[index],
            [field]: value
        };
        setFormData({
            ...formData,
            details: newDetails
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    새 분개 등록
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="분개일자"
                                    value={formData.date}
                                    onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="설명"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Grid>

                        {formData.details.map((detail, index) => (
                            <Grid item xs={12} key={index}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <TextField
                                        select
                                        label="계정"
                                        value={detail.accountId}
                                        onChange={(e) => handleDetailChange(index, 'accountId', e.target.value)}
                                        sx={{ flex: 2 }}
                                        required
                                    >
                                        {accounts.map((account) => (
                                            <MenuItem key={account.id} value={account.id}>
                                                {account.code} - {account.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        type="number"
                                        label="차변금액"
                                        value={detail.debitAmount}
                                        onChange={(e) => handleDetailChange(index, 'debitAmount', Number(e.target.value))}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        type="number"
                                        label="대변금액"
                                        value={detail.creditAmount}
                                        onChange={(e) => handleDetailChange(index, 'creditAmount', Number(e.target.value))}
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        label="상세설명"
                                        value={detail.description}
                                        onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                                        sx={{ flex: 2 }}
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveDetail(index)}
                                        disabled={formData.details.length === 1}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddDetail}
                                sx={{ mr: 2 }}
                            >
                                분개 상세 추가
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : '저장'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default JournalEntryForm; 