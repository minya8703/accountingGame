import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    ingredientName: '',
    quantity: 0,
    unit: '',
    minimumQuantity: 0,
    costPerUnit: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/inventory');
      setInventory(response.data);
    } catch (error) {
      console.error('재고 목록을 불러오는데 실패했습니다:', error);
      setError('재고 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`http://localhost:8080/api/inventory/${editingItem.id}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/inventory', formData);
      }
      setEditingItem(null);
      setFormData({
        ingredientName: '',
        quantity: 0,
        unit: '',
        minimumQuantity: 0,
        costPerUnit: 0
      });
      fetchInventory();
    } catch (error) {
      console.error('재고 저장에 실패했습니다:', error);
      setError('재고 저장에 실패했습니다.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ingredientName: item.ingredientName,
      quantity: item.quantity,
      unit: item.unit,
      minimumQuantity: item.minimumQuantity,
      costPerUnit: item.costPerUnit
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 재고 항목을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/inventory/${id}`);
        fetchInventory();
      } catch (error) {
        console.error('재고 삭제에 실패했습니다:', error);
        setError('재고 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        재고 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingItem ? '재고 수정' : '새 재고 추가'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="재료명"
            name="ingredientName"
            value={formData.ingredientName}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="수량"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="단위"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="최소 수량"
            name="minimumQuantity"
            type="number"
            value={formData.minimumQuantity}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="단위당 가격"
            name="costPerUnit"
            type="number"
            value={formData.costPerUnit}
            onChange={handleInputChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            {editingItem ? '수정' : '추가'}
          </Button>
          {editingItem && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  ingredientName: '',
                  quantity: 0,
                  unit: '',
                  minimumQuantity: 0,
                  costPerUnit: 0
                });
              }}
            >
              취소
            </Button>
          )}
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>재료명</TableCell>
              <TableCell align="right">현재 수량</TableCell>
              <TableCell>단위</TableCell>
              <TableCell align="right">최소 수량</TableCell>
              <TableCell align="right">단위당 가격</TableCell>
              <TableCell align="right">총 가치</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.ingredientName}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell align="right">{item.minimumQuantity}</TableCell>
                <TableCell align="right">₩{item.costPerUnit.toLocaleString()}</TableCell>
                <TableCell align="right">₩{(item.quantity * item.costPerUnit).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryList; 