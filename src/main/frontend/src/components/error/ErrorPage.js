import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center text-center">
                <Col md={6}>
                    <h1 className="display-1">404</h1>
                    <h2 className="mb-4">페이지를 찾을 수 없습니다</h2>
                    <p className="mb-4">
                        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
                        아래 버튼을 클릭하여 메인 페이지로 이동해주세요.
                    </p>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => navigate('/')}
                        className="px-4"
                    >
                        메인 페이지로 이동
                    </Button>
                </Col>
            </Row>
            <style>{`
                .display-1 {
                    font-size: 8rem;
                    font-weight: bold;
                    color: #dc3545;
                }
                h2 {
                    color: #343a40;
                }
                p {
                    color: #6c757d;
                    font-size: 1.1rem;
                }
            `}</style>
        </Container>
    );
};

export default ErrorPage; 