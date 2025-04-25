import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Paper,
  Typography,
} from '@mui/material';

const PizzaForm = ({ isDialog, open, handleClose, initialPizza, onSubmit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    costPrice: '',
    description: '',
    imageUrl: '',
    size: 'MEDIUM',
    type: 'CLASSIC',
    preparationTime: '',
    isAvailable: true,
  });

  const fetchPizza = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/pizzas/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('피자 정보를 불러오는데 실패했습니다:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id || initialPizza) {
      if (id) {
        fetchPizza();
      } else {
        setFormData(initialPizza);
      }
    }
  }, [id, initialPizza, fetchPizza]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isDialog) {
        onSubmit(formData);
        handleClose();
      } else {
        if (id) {
          await axios.put(`http://localhost:8080/api/pizzas/${id}`, formData);
        } else {
          await axios.post('http://localhost:8080/api/pizzas', formData);
        }
        navigate('/pizzas');
      }
    } catch (error) {
      console.error('피자 저장에 실패했습니다:', error);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="피자 이름"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="basePrice"
            label="기본 가격"
            type="number"
            value={formData.basePrice}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="costPrice"
            label="원가"
            type="number"
            value={formData.costPrice}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="설명"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="imageUrl"
            label="이미지 URL"
            value={formData.imageUrl}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>크기</InputLabel>
            <Select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            >
              <MenuItem value="SMALL">Small (S)</MenuItem>
              <MenuItem value="MEDIUM">Medium (M)</MenuItem>
              <MenuItem value="LARGE">Large (L)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>종류</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="CLASSIC">클래식</MenuItem>
              <MenuItem value="PREMIUM">프리미엄</MenuItem>
              <MenuItem value="SIGNATURE">시그니처</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="preparationTime"
            label="준비 시간 (분)"
            type="number"
            value={formData.preparationTime}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/pizzas')}>
              취소
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {id ? '수정' : '추가'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );

  if (isDialog) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {initialPizza ? '피자 수정' : '새 피자 추가'}
        </DialogTitle>
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {id ? '피자 수정' : '새 피자 추가'}
      </Typography>
      {formContent}
    </Paper>
  );
};

export default PizzaForm; 