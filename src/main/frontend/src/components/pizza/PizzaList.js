import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const PizzaList = () => {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pizzas');
      setPizzas(response.data);
    } catch (error) {
      console.error('피자 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 피자를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/pizzas/${id}`);
        setPizzas(pizzas.filter(pizza => pizza.id !== id));
      } catch (error) {
        console.error('피자 삭제에 실패했습니다:', error);
      }
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/pizzas/${id}/availability`);
      setPizzas(pizzas.map(pizza => 
        pizza.id === id ? response.data : pizza
      ));
    } catch (error) {
      console.error('피자 상태 변경에 실패했습니다:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Typography variant="h4">피자 메뉴 관리</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/pizzas/new')}
        >
          새 피자 추가
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>종류</TableCell>
              <TableCell>크기</TableCell>
              <TableCell align="right">기본가격</TableCell>
              <TableCell align="right">원가</TableCell>
              <TableCell>준비시간</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pizzas.map((pizza) => (
              <TableRow key={pizza.id}>
                <TableCell>
                  <img 
                    src={pizza.imageUrl} 
                    alt={pizza.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{pizza.name}</TableCell>
                <TableCell>{pizza.type}</TableCell>
                <TableCell>{pizza.size}</TableCell>
                <TableCell align="right">
                  {pizza.basePrice ? pizza.basePrice.toLocaleString() : '0'}원
                </TableCell>
                <TableCell align="right">
                  {pizza.costPrice ? pizza.costPrice.toLocaleString() : '0'}원
                </TableCell>
                <TableCell>{pizza.preparationTime}분</TableCell>
                <TableCell>
                  <Button
                    variant={pizza.isAvailable ? "contained" : "outlined"}
                    color={pizza.isAvailable ? "success" : "error"}
                    size="small"
                    onClick={() => toggleAvailability(pizza.id)}
                  >
                    {pizza.isAvailable ? "판매중" : "판매중지"}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => navigate(`/pizzas/${pizza.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(pizza.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PizzaList;