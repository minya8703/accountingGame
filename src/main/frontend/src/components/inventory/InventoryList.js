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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InventoryEditDialog from './InventoryEditDialog';

const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error('재고 데이터를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setInventoryItems(data);
      setError(null);
    } catch (err) {
      console.error('재고 데이터 조회 에러:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      await fetchInventoryItems();
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
      await fetchInventoryItems();
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>데이터를 불러오는 중...</Typography>
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>재료명</TableCell>
              <TableCell align="right">수량</TableCell>
              <TableCell>단위</TableCell>
              <TableCell align="right">단가</TableCell>
              <TableCell align="right">최소 수량</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  재고 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              inventoryItems.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor:
                      item.quantity <= item.minimumQuantity ? '#fff3e0' : 'inherit',
                  }}
                >
                  <TableCell>{item.ingredientName}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell align="right">
                    {item.costPerUnit.toLocaleString()}원
                  </TableCell>
                  <TableCell align="right">{item.minimumQuantity}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
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