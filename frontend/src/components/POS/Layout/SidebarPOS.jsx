import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function SidebarPOS() {
    return(
        <div className="bg-light p-3 vh-100 border-end">    
            <h5>Menú</h5>
            <Nav className="flex-column">
                <NavLink to="/pos/ventas" className="nav-link">Ventas</NavLink>
                <NavLink to="/pos/inventario" className="nav-link">Inventario</NavLink>
                <NavLink to="/pos/reportes" className="nav-link">Reportes</NavLink>
                <NavLink to="/pos/configuraciones" className="nav-link">Configuraciones</NavLink>
            </Nav>
        </div>
    );
}

export default SidebarPOS;