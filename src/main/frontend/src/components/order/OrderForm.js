import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const OrderForm = () => {
  const [pizzas, setPizzas] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      {
        pizza: pizzas[0],
        size: 'MEDIUM',
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.pizza.basePrice * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        orderItems: orderItems.map(item => ({
          pizza: { id: item.pizza.id },
          size: item.size,
          quantity: item.quantity,
        })),
      };

      await axios.post('http://localhost:8080/api/orders', orderData);
      setOrderItems([]);
      setFormData({
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
      });
    } catch (error) {
      console.error('주문 생성에 실패했습니다:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        주문하기
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="고객 이름"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="전화번호"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="배송 주소"
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
        />

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleAddItem}>
            피자 추가
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>피자</TableCell>
                <TableCell>사이즈</TableCell>
                <TableCell>수량</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={item.pizza.id}
                      onChange={(e) => {
                        const selectedPizza = pizzas.find(p => p.id === e.target.value);
                        handleItemChange(index, 'pizza', selectedPizza);
                      }}
                    >
                      {pizzas.map((pizza) => (
                        <MenuItem key={pizza.id} value={pizza.id}>
                          {pizza.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.size}
                      onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                    >
                      <MenuItem value="SMALL">스몰</MenuItem>
                      <MenuItem value="MEDIUM">미디엄</MenuItem>
                      <MenuItem value="LARGE">라지</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    {(item.pizza.basePrice * item.quantity).toLocaleString()}원
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(index)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            총 금액: {calculateTotal().toLocaleString()}원
          </Typography>
          <Button type="submit" variant="contained" color="primary">
            주문하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderForm; 