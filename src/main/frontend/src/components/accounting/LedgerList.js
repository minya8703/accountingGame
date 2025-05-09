import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const LedgerList = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldCatalog, setFieldCatalog] = useState([
    { field: 'date', headerName: '날짜', width: 120 },
    { field: 'journalNumber', headerName: '분개번호', width: 100 },
    { field: 'description', headerName: '적요', width: 200 },
    { field: 'debitAmount', headerName: '차변', width: 120, align: 'right' },
    { field: 'creditAmount', headerName: '대변', width: 120, align: 'right' },
    { field: 'balance', headerName: '잔액', width: 120, align: 'right' },
  ]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchLedgerEntries(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounting/accounts');
      setAccounts(response.data);
      setLoading(false);
    } catch (err) {
      setError('계정 목록을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
      console.error('Error fetching accounts:', err);
    }
  };

  const fetchLedgerEntries = async (accountId) => {
    try {
      const response = await axios.get(`/api/accounting/ledger/${accountId}`);
      setLedgerEntries(response.data);
    } catch (err) {
      setError('원장 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching ledger entries:', err);
    }
  };

  const refreshFieldCatalog = () => {
    setFieldCatalog([
      { field: 'date', headerName: '날짜', width: 120 },
      { field: 'journalNumber', headerName: '분개번호', width: 100 },
      { field: 'description', headerName: '적요', width: 200 },
      { field: 'debitAmount', headerName: '차변', width: 120, align: 'right' },
      { field: 'creditAmount', headerName: '대변', width: 120, align: 'right' },
      { field: 'balance', headerName: '잔액', width: 120, align: 'right' },
    ]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          원장
        </Typography>
        <Tooltip title="필드 카탈로그 새로고침">
          <IconButton onClick={refreshFieldCatalog}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>계정 선택</InputLabel>
        <Select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          label="계정 선택"
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.code} - {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedAccount && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {fieldCatalog.map((field) => (
                  <TableCell
                    key={field.field}
                    align={field.align || 'left'}
                    style={{ width: field.width }}
                  >
                    {field.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ledgerEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.journalNumber}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell align="right">{entry.debitAmount?.toLocaleString()}</TableCell>
                  <TableCell align="right">{entry.creditAmount?.toLocaleString()}</TableCell>
                  <TableCell align="right">{entry.balance?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LedgerList; 