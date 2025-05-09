import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return monthAgo.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [accountCode, setAccountCode] = useState('');

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/accounting/ledger-entries', {
        params: {
          startDate,
          endDate,
          accountCode: accountCode || undefined,
        },
      });
      setEntries(response.data || []);
    } catch (err) {
      console.error('원장 데이터 조회 중 오류 발생:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, accountCode]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          원장
        </Typography>
        <Tooltip title="새로고침">
          <IconButton onClick={fetchEntries} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="시작일"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 200 }}
        />
        <TextField
          label="종료일"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 200 }}
        />
        <TextField
          label="계정과목 코드"
          value={accountCode}
          onChange={(e) => setAccountCode(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button
          variant="contained"
          onClick={fetchEntries}
          disabled={loading}
        >
          조회
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>분개번호</TableCell>
                <TableCell>설명</TableCell>
                <TableCell align="right">차변</TableCell>
                <TableCell align="right">대변</TableCell>
                <TableCell align="right">잔액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.journalNumber}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell align="right">
                      {entry.debitAmount ? entry.debitAmount.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {entry.creditAmount ? entry.creditAmount.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {entry.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Ledger; 