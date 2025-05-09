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
  Typography,
  Chip,
  Box,
  Tabs,
  Tab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      setError('주문 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'PREPARING': return 'primary';
      case 'READY': return 'success';
      case 'DELIVERING': return 'secondary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return '접수 대기';
      case 'CONFIRMED': return '확인 완료';
      case 'PREPARING': return '준비 중';
      case 'READY': return '준비 완료';
      case 'DELIVERING': return '배달 중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
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
        <Typography variant="h4">주문 관리</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/orders/new')}
        >
          새 주문
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedStatus}
          onChange={(e, newValue) => {
            setSelectedStatus(newValue);
            setPage(0);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="전체" value="ALL" />
          <Tab label="접수 대기" value="PENDING" />
          <Tab label="확인 완료" value="CONFIRMED" />
          <Tab label="준비 중" value="PREPARING" />
          <Tab label="준비 완료" value="READY" />
          <Tab label="배달 중" value="DELIVERING" />
          <Tab label="완료" value="COMPLETED" />
          <Tab label="취소" value="CANCELLED" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>주문 번호</TableCell>
              <TableCell>주문 시간</TableCell>
              <TableCell>고객명</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>총액</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .filter(order => selectedStatus === 'ALL' || order.status === selectedStatus)
              .slice(page * 10, (page + 1) * 10)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell>{order.totalAmount.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(order)}
                      >
                        상세보기
                      </Button>
                      {order.status === 'PENDING' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                        >
                          확인
                        </Button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleStatusChange(order.id, 'PREPARING')}
                        >
                          준비 시작
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleStatusChange(order.id, 'READY')}
                        >
                          준비 완료
                        </Button>
                      )}
                      {order.status === 'READY' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleStatusChange(order.id, 'DELIVERING')}
                        >
                          배달 시작
                        </Button>
                      )}
                      {order.status === 'DELIVERING' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                        >
                          배달 완료
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(orders.length / 10)}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          color="primary"
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>주문 상세 정보</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <List>
              <ListItem>
                <ListItemText
                  primary="주문 번호"
                  secondary={selectedOrder.id}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="주문 시간"
                  secondary={new Date(selectedOrder.orderDate).toLocaleString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="고객 정보"
                  secondary={`${selectedOrder.customerName} (${selectedOrder.customerPhone})`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="배송지"
                  secondary={selectedOrder.deliveryAddress}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="주문 항목"
                  secondary={
                    <List>
                      {selectedOrder.orderItems.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={`${item.pizza.name} (${item.size}) x ${item.quantity}`}
                            secondary={`${item.price.toLocaleString()}원`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="총 주문 금액"
                  secondary={`${selectedOrder.totalAmount.toLocaleString()}원`}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList; 