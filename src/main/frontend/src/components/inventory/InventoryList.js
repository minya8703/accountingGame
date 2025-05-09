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
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InventoryEditDialog from './InventoryEditDialog';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/inventory');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '재고 목록을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
      console.error('재고 목록 조회 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 재고 항목을 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('재고 항목 삭제에 실패했습니다.');
      await fetchInventory();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (item) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const url = item.id ? `/api/inventory/${item.id}` : '/api/inventory';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error('재고 항목 저장에 실패했습니다.');
      await fetchInventory();
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>재고 목록을 불러오는 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchInventory}>
          다시 시도
        </Button>
      </Box>
    );
  }

  if (inventory.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          등록된 재고가 없습니다.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          재고 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          재고 추가
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>재고 ID</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>단위</TableCell>
              <TableCell>최소 수량</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.minimumQuantity}</TableCell>
                <TableCell align="center">
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

      <InventoryEditDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        item={selectedItem}
      />
    </Box>
  );
};

export default InventoryList; 