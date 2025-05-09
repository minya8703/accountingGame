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
  Tabs,
  Tab,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const FinancialStatements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [balanceSheet, setBalanceSheet] = useState([]);
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return monthAgo.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchFinancialStatements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/accounting/financial-statements-entries', {
        params: {
          startDate,
          endDate,
        },
      });
      setBalanceSheet(response.data.balanceSheet || []);
      setIncomeStatement(response.data.incomeStatement || []);
    } catch (err) {
      console.error('재무제표 데이터 조회 중 오류 발생:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setBalanceSheet([]);
      setIncomeStatement([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchFinancialStatements();
  }, [fetchFinancialStatements]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          재무제표
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
            <IconButton onClick={fetchFinancialStatements} disabled={loading}>
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

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="대차대조표" />
        <Tab label="손익계산서" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>계정과목</TableCell>
                <TableCell align="right">금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeTab === 0 ? (
                balanceSheet.length > 0 ? (
                  balanceSheet.map((item) => (
                    <TableRow key={item.accountCode}>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell align="right">
                        {item.amount.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )
              ) : (
                incomeStatement.length > 0 ? (
                  incomeStatement.map((item) => (
                    <TableRow key={item.accountCode}>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell align="right">
                        {item.amount.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FinancialStatements; 