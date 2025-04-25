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
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Login as LoginIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/pizzas"
            startIcon={<RestaurantIcon />}
          >
            피자 목록
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/pizzas/new"
            startIcon={<AddIcon />}
          >
            피자 추가
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/orders"
            startIcon={<ShoppingCartIcon />}
          >
            주문 관리
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/inventory"
            startIcon={<InventoryIcon />}
          >
            재고 관리
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={handleClick}
            startIcon={<CodeIcon />}
          >
            API 테스트
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={RouterLink} to="/api/home" onClick={handleClose}>
              Home API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/auth" onClick={handleClose}>
              Auth API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/pizzas" onClick={handleClose}>
              Pizza API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/users" onClick={handleClose}>
              User API
            </MenuItem>
            <MenuItem component={RouterLink} to="/api/actuator" onClick={handleClose}>
              Actuator
            </MenuItem>
          </Menu>

          <Button
            color="inherit"
            component={RouterLink}
            to="/login"
            startIcon={<LoginIcon />}
          >
            로그인
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 