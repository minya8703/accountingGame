import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Login as LoginIcon,
  Code as CodeIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [accountingMenuAnchorEl, setAccountingMenuAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountingMenuClick = (event) => {
    setAccountingMenuAnchorEl(event.currentTarget);
  };

  const handleAccountingMenuClose = () => {
    setAccountingMenuAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Tooltip title="회계 관리 메뉴" arrow placement="bottom">
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<AccountBalanceIcon />}
              onClick={handleAccountingMenuClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              회계 관리
            </Button>
          </Tooltip>
          <Menu
            anchorEl={accountingMenuAnchorEl}
            open={Boolean(accountingMenuAnchorEl)}
            onClose={handleAccountingMenuClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <MenuItem 
              component={RouterLink} 
              to="/accounting/journal" 
              onClick={handleAccountingMenuClose}
              sx={{ py: 1.5 }}
            >
              <ReceiptIcon sx={{ mr: 1 }} /> 분개장
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/accounting/ledger" 
              onClick={handleAccountingMenuClose}
              sx={{ py: 1.5 }}
            >
              <TimelineIcon sx={{ mr: 1 }} /> 원장
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/accounting/trial-balance" 
              onClick={handleAccountingMenuClose}
              sx={{ py: 1.5 }}
            >
              <AssessmentIcon sx={{ mr: 1 }} /> 시산표
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/accounting/financial-statements" 
              onClick={handleAccountingMenuClose}
              sx={{ py: 1.5 }}
            >
              <AccountBalanceIcon sx={{ mr: 1 }} /> 재무제표
            </MenuItem>
          </Menu>

          <Tooltip title="피자 메뉴 목록" arrow placement="bottom">
            <Button
              color="inherit"
              component={RouterLink}
              to="/pizzas"
              startIcon={<RestaurantIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              피자 목록
            </Button>
          </Tooltip>

          <Tooltip title="새 피자 메뉴 추가" arrow placement="bottom">
            <Button
              color="inherit"
              component={RouterLink}
              to="/pizzas/new"
              startIcon={<AddIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              피자 추가
            </Button>
          </Tooltip>

          <Tooltip title="주문 관리" arrow placement="bottom">
            <Button
              color="inherit"
              component={RouterLink}
              to="/orders"
              startIcon={<ShoppingCartIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              주문 관리
            </Button>
          </Tooltip>

          <Tooltip title="재고 관리" arrow placement="bottom">
            <Button
              color="inherit"
              component={RouterLink}
              to="/inventory"
              startIcon={<InventoryIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              재고 관리
            </Button>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="API 테스트" arrow placement="bottom">
            <IconButton
              color="inherit"
              onClick={handleClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <MenuItem component={RouterLink} to="/api/home" onClick={handleClose} sx={{ py: 1.5 }}>
              Home API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/auth" onClick={handleClose} sx={{ py: 1.5 }}>
              Auth API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/pizzas" onClick={handleClose} sx={{ py: 1.5 }}>
              Pizza API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/users" onClick={handleClose} sx={{ py: 1.5 }}>
              User API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/actuator" onClick={handleClose} sx={{ py: 1.5 }}>
              Actuator
            </MenuItem>
          </Menu>

          <Tooltip title="로그인" arrow placement="bottom">
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              로그인
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 