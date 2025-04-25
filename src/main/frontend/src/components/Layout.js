import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={RouterLink} to="/">
              피자 주문 시스템
            </Button>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/pizzas/new">
            피자 등록
          </Button>
          <Button color="inherit" component={RouterLink} to="/orders">
            주문 목록
          </Button>
          <Button color="inherit" component={RouterLink} to="/orders/new">
            주문하기
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 