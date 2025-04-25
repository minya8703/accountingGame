import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';

const InventoryEditDialog = ({ open, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    ingredientName: '',
    quantity: '',
    unit: '',
    costPerUnit: '',
    minimumQuantity: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        costPerUnit: item.costPerUnit,
        minimumQuantity: item.minimumQuantity,
      });
    } else {
      setFormData({
        ingredientName: '',
        quantity: '',
        unit: '',
        costPerUnit: '',
        minimumQuantity: '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      costPerUnit: Number(formData.costPerUnit),
      minimumQuantity: Number(formData.minimumQuantity),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {item ? '재고 항목 수정' : '새 재고 항목 추가'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="ingredientName"
                label="재료명"
                value={formData.ingredientName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="quantity"
                label="수량"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="unit"
                label="단위"
                value={formData.unit}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="costPerUnit"
                label="단가"
                type="number"
                value={formData.costPerUnit}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="minimumQuantity"
                label="최소 수량"
                type="number"
                value={formData.minimumQuantity}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained">
            저장
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InventoryEditDialog; 