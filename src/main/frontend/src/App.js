import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Inventory from './components/inventory/Inventory';
import OrderForm from './components/order/OrderForm';
import AccountingReport from './components/accounting/AccountingReport';
import AccountingPractice from './components/accounting/AccountingPractice';
import Navbar from './components/common/Navbar';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/accounting" element={<AccountingReport />} />
          <Route path="/accounting/practice" element={<AccountingPractice />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 