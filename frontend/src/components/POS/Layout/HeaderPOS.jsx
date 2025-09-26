import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

function HeaderPOS({ nombre_empresa, onLogout, onToggleSidebar, sidebarCollapse }) {
    return (
        <Navbar bg="light" expand="lg" className="mb-3 shadow-sm">
            <Container fluid>
                <Button variant="outline-secondary" onClick={onToggleSidebar} className="me-2">
                    <FontAwesomeIcon icon={faBars} />
                </Button>
                <Navbar.Brand href="#home">{nombre_empresa}</Navbar.Brand>
                <Button variant="outline-danger" onClick={onLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </Button>
            </Container>
        </Navbar>
    );
}

export default HeaderPOS;