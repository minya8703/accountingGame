import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const JournalEntry = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    debitAccount: '',
    creditAccount: '',
    amount: '',
  });
  const [startDate, setStartDate] = useState(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return monthAgo.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/accounting/journal-entries', {
        params: {
          startDate,
          endDate,
        },
      });
      setEntries(response.data || []);
    } catch (err) {
      console.error('분개장 데이터 조회 중 오류 발생:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      debitAccount: '',
      creditAccount: '',
      amount: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/api/accounting/journal', newEntry);
      handleClose();
      fetchEntries();
    } catch (err) {
      console.error('분개장 데이터 저장 중 오류 발생:', err);
      setError('데이터 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          분개장
        </Typography>
        <Box>
          <Tooltip title="새로고침">
            <IconButton onClick={fetchEntries} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            disabled={loading}
          >
            새 분개
          </Button>
        </Box>
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
                <TableCell>계정과목</TableCell>
                <TableCell align="right">차변</TableCell>
                <TableCell align="right">대변</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.journalNumber}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.accountName}</TableCell>
                    <TableCell align="right">
                      {entry.debitAmount ? entry.debitAmount.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {entry.creditAmount ? entry.creditAmount.toLocaleString() : '-'}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>새 분개 입력</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="date"
              label="날짜"
              type="date"
              value={newEntry.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              name="description"
              label="설명"
              value={newEntry.description}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="debitAccount"
              label="차변계정"
              value={newEntry.debitAccount}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="creditAccount"
              label="대변계정"
              value={newEntry.creditAccount}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="amount"
              label="금액"
              type="number"
              value={newEntry.amount}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalEntry; 