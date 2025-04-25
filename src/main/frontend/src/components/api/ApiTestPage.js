import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ApiTestPage = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const testLoginApi = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await axios.post('/api/auth/login', {
                username: 'test',
                password: 'test123'
            });
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const testRegisterApi = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await axios.post('/api/users/register', null, {
                params: {
                    username: 'test',
                    password: 'test123',
                    role: 'STUDENT'
                }
            });
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const testUsersApi = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await axios.get('/api/users');
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h3" className="text-center">API 테스트</Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                <Button 
                                    variant="primary" 
                                    onClick={testLoginApi}
                                    disabled={loading}
                                >
                                    로그인 API 테스트
                                </Button>
                                <Button 
                                    variant="success" 
                                    onClick={testRegisterApi}
                                    disabled={loading}
                                >
                                    회원가입 API 테스트
                                </Button>
                                <Button 
                                    variant="info" 
                                    onClick={testUsersApi}
                                    disabled={loading}
                                >
                                    사용자 목록 API 테스트
                                </Button>
                            </div>

                            {loading && (
                                <Alert variant="info" className="mt-3">
                                    API 요청 중...
                                </Alert>
                            )}

                            {error && (
                                <Alert variant="danger" className="mt-3">
                                    에러: {JSON.stringify(error)}
                                </Alert>
                            )}

                            {response && (
                                <Alert variant="success" className="mt-3">
                                    응답: {JSON.stringify(response)}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ApiTestPage; 