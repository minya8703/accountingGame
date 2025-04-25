import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const AccountingReport = () => {
  const [timeRange, setTimeRange] = useState('DAILY');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/accounting/report?range=${timeRange}`);
      setReport(response.data);
    } catch (error) {
      console.error('회계 보고서를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        회계 보고서
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>보고서 기간</InputLabel>
        <Select
          value={timeRange}
          onChange={handleRangeChange}
          label="보고서 기간"
        >
          <MenuItem value="DAILY">일간</MenuItem>
          <MenuItem value="WEEKLY">주간</MenuItem>
          <MenuItem value="MONTHLY">월간</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                총 매출
              </Typography>
              <Typography variant="h4">
                {report?.totalSales.toLocaleString()}원
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                총 원가
              </Typography>
              <Typography variant="h4">
                {report?.totalCost.toLocaleString()}원
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                총 이익
              </Typography>
              <Typography variant="h4" color="primary">
                {report?.totalProfit.toLocaleString()}원
                ({Math.round(report?.totalProfit / report?.totalSales * 100)}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell align="right">매출</TableCell>
                <TableCell align="right">원가</TableCell>
                <TableCell align="right">이익</TableCell>
                <TableCell align="right">이익률</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report?.dailyReports.map((daily) => (
                <TableRow key={daily.date}>
                  <TableCell>{daily.date}</TableCell>
                  <TableCell align="right">{daily.sales.toLocaleString()}원</TableCell>
                  <TableCell align="right">{daily.cost.toLocaleString()}원</TableCell>
                  <TableCell align="right">{daily.profit.toLocaleString()}원</TableCell>
                  <TableCell align="right">{Math.round(daily.profit / daily.sales * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AccountingReport; 