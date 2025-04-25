import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, page]);

  const fetchOrders = async () => {
    try {
      const response = selectedStatus === 'ALL'
        ? await axios.get(`http://localhost:8080/api/orders?page=${page - 1}&size=${rowsPerPage}`)
        : await axios.get(`http://localhost:8080/api/orders/status/${selectedStatus}?page=${page - 1}&size=${rowsPerPage}`);
      setOrders(response.data.content);
    } catch (error) {
      console.error('주문 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('주문 상태 변경에 실패했습니다:', error);
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm('정말로 이 주문을 취소하시겠습니까?')) {
      try {
        await axios.post(`http://localhost:8080/api/orders/${orderId}/cancel`);
        fetchOrders();
      } catch (error) {
        console.error('주문 취소에 실패했습니다:', error);
      }
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
            setPage(1);
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerPhone}</TableCell>
                <TableCell>{order.totalAmount.toLocaleString()}원</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(order.status.statusName)}
                    color={getStatusColor(order.status.statusName)}
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
                    {order.status.statusName === 'PENDING' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                      >
                        확인
                      </Button>
                    )}
                    {order.status.statusName === 'CONFIRMED' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'PREPARING')}
                      >
                        준비 시작
                      </Button>
                    )}
                    {order.status.statusName === 'PREPARING' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'READY')}
                      >
                        준비 완료
                      </Button>
                    )}
                    {order.status.statusName === 'READY' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'DELIVERING')}
                      >
                        배달 시작
                      </Button>
                    )}
                    {order.status.statusName === 'DELIVERING' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                      >
                        배달 완료
                      </Button>
                    )}
                    {['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status.statusName) && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(order.id)}
                      >
                        취소
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
          count={10}
          page={page}
          onChange={(e, value) => setPage(value)}
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
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  판매가: {item.price.toLocaleString()}원
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  원가: {item.cost.toLocaleString()}원
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  이익: {(item.price - item.cost).toLocaleString()}원
                                  (이익률: {Math.round((item.price - item.cost) / item.price * 100)}%)
                                </Typography>
                              </Box>
                            }
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
                  secondary={
                    <Box>
                      <Typography variant="body1">
                        판매가: {selectedOrder.totalAmount.toLocaleString()}원
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        총 원가: {selectedOrder.orderItems.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}원
                      </Typography>
                      <Typography variant="h6" color="primary">
                        총 이익: {
                          (selectedOrder.totalAmount - 
                          selectedOrder.orderItems.reduce((sum, item) => sum + item.cost, 0))
                          .toLocaleString()
                        }원
                        (이익률: {
                          Math.round(
                            (selectedOrder.totalAmount - 
                            selectedOrder.orderItems.reduce((sum, item) => sum + item.cost, 0)) / 
                            selectedOrder.totalAmount * 100
                          )
                        }%)
                      </Typography>
                    </Box>
                  }
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