import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <AccountBalanceIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
          >
            회계 게임
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 