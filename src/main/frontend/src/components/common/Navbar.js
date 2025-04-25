import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Navbar = () => {
  const [accountingMenu, setAccountingMenu] = useState(null);

  const handleAccountingMenuOpen = (event) => {
    setAccountingMenu(event.currentTarget);
  };

  const handleAccountingMenuClose = () => {
    setAccountingMenu(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          피자 가게 관리
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/order">
            주문하기
          </Button>
          <Button color="inherit" component={Link} to="/inventory">
            재고 관리
          </Button>
          <Button
            color="inherit"
            onClick={handleAccountingMenuOpen}
            startIcon={<AccountBalanceIcon />}
          >
            회계
          </Button>
          <Menu
            anchorEl={accountingMenu}
            open={Boolean(accountingMenu)}
            onClose={handleAccountingMenuClose}
          >
            <MenuItem 
              component={Link} 
              to="/accounting"
              onClick={handleAccountingMenuClose}
            >
              회계 보고서
            </MenuItem>
            <MenuItem 
              component={Link} 
              to="/accounting/practice"
              onClick={handleAccountingMenuClose}
            >
              회계 연습
            </MenuItem>
          </Menu>
          <Button color="inherit" component={Link} to="/">
            로그인
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 