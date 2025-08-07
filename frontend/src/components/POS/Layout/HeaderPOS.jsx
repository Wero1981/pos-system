import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function HeaderPOS({onLogout}) {
    return (
        <Navbar bg="light" expand="lg" className="mb-3 shadow-sm">
            <Container fluid>
                <Navbar.Brand href="#home">POS System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" >
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Inicio</Nav.Link>
                        <Nav.Link href="#features">Características</Nav.Link>
                        <Nav.Link href="#pricing">Precios</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Button variant="outline-danger" onClick={onLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </Button>
            </Container>
        </Navbar>
    );
}

export default HeaderPOS;