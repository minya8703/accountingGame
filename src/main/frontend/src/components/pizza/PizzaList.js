import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const PizzaList = () => {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/pizzas');
      setPizzas(response.data);
    } catch (err) {
      setError('피자 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching pizzas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 피자를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/pizzas/${id}`);
        setPizzas(pizzas.filter(pizza => pizza.id !== id));
      } catch (err) {
        console.error('Error deleting pizza:', err);
      }
    }
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">피자 메뉴 관리</Typography>
        <Box>
          <Tooltip title="목록 새로고침">
            <IconButton onClick={fetchPizzas} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/pizzas/new')}
          >
            새 피자 추가
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>설명</TableCell>
              <TableCell>가격</TableCell>
              <TableCell>재고</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pizzas.map((pizza) => (
              <TableRow key={pizza.id}>
                <TableCell>{pizza.name}</TableCell>
                <TableCell>{pizza.description}</TableCell>
                <TableCell>{pizza.price.toLocaleString()}원</TableCell>
                <TableCell>{pizza.stock}</TableCell>
                <TableCell>
                  <Tooltip title="삭제">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(pizza.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PizzaList;