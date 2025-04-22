import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">회계 게임</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-content" />
                    <Navbar.Collapse id="navbar-content">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/home">홈</Nav.Link>
                            <Nav.Link as={Link} to="/register">회원가입</Nav.Link>
                            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                            
                            {/* API 메뉴 드롭다운 */}
                            <NavDropdown title="API 메뉴" id="api-dropdown">
                                <NavDropdown.Item as={Link} to="/api/auth/login">로그인 API</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/api/users/register">회원가입 API</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/api/users">사용자 목록 API</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
