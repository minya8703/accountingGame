import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PizzaList = () => {
  const [pizzas, setPizzas] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>피자 목록</Typography>
      <Grid container spacing={3}>
        {pizzas.map((pizza) => (
          <Grid item xs={12} sm={6} md={4} key={pizza.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={pizza.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={pizza.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {pizza.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pizza.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  {pizza.basePrice.toLocaleString()}원
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/orders/new')}
                >
                  주문하기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PizzaList; 