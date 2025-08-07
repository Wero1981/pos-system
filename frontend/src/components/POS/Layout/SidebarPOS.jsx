import React from "react";
import { Nav } from "react-bootstrap";

function SidebarPOS() {
    return(
        <div className="bg-light p-3 vh-100 border-end">    
            <h5>Menú</h5>
            <Nav className="flex-column">
                <Nav.Link href="#">Ventas</Nav.Link>
                <Nav.Link href="#">Inventario</Nav.Link>
                <Nav.Link href="#">Reportes</Nav.Link>
                <Nav.Link href="#">Configuraciones</Nav.Link>
            </Nav>
        </div>
    );
}

export default SidebarPOS;