import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { keyframes } from '@mui/system';
import JournalEntry from './components/accounting/JournalEntry';
import Ledger from './components/accounting/Ledger';
import TrialBalance from './components/accounting/TrialBalance';
import FinancialStatements from './components/accounting/FinancialStatements';
import Navbar from './components/layout/Navbar';
import PizzaList from './components/pizza/PizzaList';
import PizzaForm from './components/pizza/PizzaForm';
import OrderList from './components/order/OrderList';
import InventoryList from './components/inventory/InventoryList';
import Login from './components/auth/Login';
import ApiTest from './components/api/ApiTest';
import { Box } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      color: '#1976d2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box
          sx={{
            animation: `${fadeIn} 0.5s ease-out`,
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'background.default',
            pt: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<JournalEntry />} />
            <Route path="/accounting/journal" element={<JournalEntry />} />
            <Route path="/accounting/ledger" element={<Ledger />} />
            <Route path="/accounting/trial-balance" element={<TrialBalance />} />
            <Route path="/accounting/financial-statements" element={<FinancialStatements />} />
            <Route path="/pizzas" element={<PizzaList />} />
            <Route path="/pizzas/new" element={<PizzaForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/api/home" element={<ApiTest />} />
            <Route path="/api/auth" element={<ApiTest />} />
            <Route path="/api/pizzas" element={<ApiTest />} />
            <Route path="/api/users" element={<ApiTest />} />
            <Route path="/api/actuator" element={<ApiTest />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 