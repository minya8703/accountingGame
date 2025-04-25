import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

const ApiTest = () => {
  const { apiType } = useParams();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiEndpoints = {
    home: {
      url: 'http://localhost:8080/home',
      methods: ['GET'],
    },
    auth: {
      url: 'http://localhost:8080/api/auth',
      methods: ['POST', 'GET'],
    },
    pizzas: {
      url: 'http://localhost:8080/api/pizzas',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    users: {
      url: 'http://localhost:8080/api/users',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    actuator: {
      url: 'http://localhost:8080/actuator',
      methods: ['GET'],
    },
  };

  const handleTest = async (method) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const config = {
        method,
        url: apiEndpoints[apiType].url,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const result = await axios(config);
      setResponse(result.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {apiType.toUpperCase()} API 테스트
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          엔드포인트 정보
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="URL"
              secondary={apiEndpoints[apiType].url}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="지원 메서드"
              secondary={apiEndpoints[apiType].methods.join(', ')}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          API 테스트
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {apiEndpoints[apiType].methods.map((method) => (
            <Button
              key={method}
              variant="contained"
              onClick={() => handleTest(method)}
              disabled={loading}
            >
              {method}
            </Button>
          ))}
        </Box>

        {loading && <Typography>로딩 중...</Typography>}
        
        {error && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'error.light' }}>
            <Typography color="error">에러: {JSON.stringify(error, null, 2)}</Typography>
          </Paper>
        )}

        {response && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.light' }}>
            <Typography>응답:</Typography>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default ApiTest; 