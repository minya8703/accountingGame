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
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const TrialBalance = () => {
  const [trialBalance, setTrialBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return monthAgo.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchTrialBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/accounting/trial-balance-entries', {
        params: {
          startDate,
          endDate,
        },
      });
      setTrialBalance(response.data || []);
    } catch (err) {
      console.error('시산표 데이터 조회 중 오류 발생:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setTrialBalance([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTrialBalance();
  }, [fetchTrialBalance]);

  const totalDebit = trialBalance.reduce((sum, entry) => sum + (entry.debitBalance || 0), 0);
  const totalCredit = trialBalance.reduce((sum, entry) => sum + (entry.creditBalance || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          시산표
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="조회일자"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
          />
          <TextField
            label="~"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
          />
          <Tooltip title="새로고침">
            <IconButton onClick={fetchTrialBalance} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
                <TableCell>계정과목 코드</TableCell>
                <TableCell>계정과목명</TableCell>
                <TableCell align="right">차변잔액</TableCell>
                <TableCell align="right">대변잔액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trialBalance.length > 0 ? (
                <>
                  {trialBalance.map((entry) => (
                    <TableRow key={entry.accountCode}>
                      <TableCell>{entry.accountCode}</TableCell>
                      <TableCell>{entry.accountName}</TableCell>
                      <TableCell align="right">
                        {entry.debitBalance ? entry.debitBalance.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {entry.creditBalance ? entry.creditBalance.toLocaleString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <strong>합계</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalDebit.toLocaleString()}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalCredit.toLocaleString()}</strong>
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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

export default TrialBalance; 