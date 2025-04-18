import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Navbar</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-content" />
                    <Navbar.Collapse id="navbar-content">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            {/*<Nav.Link as={Link} to="/regcertinfo">인증서등록</Nav.Link>*/}

                            {/* ✅ NavDropdown 사용 */}
                            {/*<NavDropdown title="인증서" id="navbarDropdown">*/}
                            {/*    <NavDropdown.Item as={Link} to="/regcertinfo">인증서등록</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item as={Link} to="/getcertinfo">인증서조회</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item as={Link} to="/uptcertinfo">인증서변경</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item as={Link} to="/delcertinfo">인증서삭제</NavDropdown.Item>*/}
                            {/*</NavDropdown>*/}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
