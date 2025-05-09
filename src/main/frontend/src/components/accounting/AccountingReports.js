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
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const AccountingReports = () => {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/accounting/reports', {
        params: {
          type: reportType,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      });
      setReportData(response.data);
      setError(null);
    } catch (err) {
      setError('보고서 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching report:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        회계 보고서
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>보고서 유형</InputLabel>
              <Select
                value={reportType}
                onChange={handleReportTypeChange}
                label="보고서 유형"
              >
                <MenuItem value="daily">일일 보고서</MenuItem>
                <MenuItem value="weekly">주간 보고서</MenuItem>
                <MenuItem value="monthly">월간 보고서</MenuItem>
                <MenuItem value="yearly">연간 보고서</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              조회
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>매출액</TableCell>
                <TableCell>매출원가</TableCell>
                <TableCell>판매비와관리비</TableCell>
                <TableCell>영업이익</TableCell>
                <TableCell>순이익</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{row.revenue?.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.costOfGoodsSold?.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.sellingAndAdminExpenses?.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.operatingIncome?.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.netIncome?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AccountingReports; 