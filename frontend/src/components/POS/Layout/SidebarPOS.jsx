import React, { useState} from "react";
import { Nav, Collapse } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCog, 
    faChevronDown, 
    faChevronRight,
    faBox,
    faShoppingCart,
    faTags,
    faChartBar
} from '@fortawesome/free-solid-svg-icons';

function SidebarPOS( sidebarCollapse ) {
    const [ configOpen, setConfigOpen ] = useState(false);
  

    return(
        <div 
            
        className="bg-light p-3 vh-100 border-end"
            style={{ minWidth: sidebarCollapse ? '60px' : '200px', transition: 'width 0.3s' }}
            >    
            {!sidebarCollapse &&  <h5 className="mb-3" >Menú</h5> }
            <Nav className="flex-column">
                <NavLink to="/pos/invetarioSucursal" className="nav-link">Inventario Sucursal</NavLink>
                <NavLink to="/pos/ventas" className="nav-link">Ventas</NavLink>
                <NavLink to="/pos/inventario" className="nav-link">Catalogos</NavLink>
                <NavLink to="/pos/reportes" className="nav-link">Reportes</NavLink>
                {/* Configuracion con submenu */}
                <div>
                    <button
                        className="btn btn-link nav-link text-start w-100 d-flex justify-content-between align-items-center"
                        onClick={() => setConfigOpen(!configOpen)}
                        style = {{ textDecoration: 'none', border: 'none', background: 'none'}}
                    >
                        <span>
                            <FontAwesomeIcon icon={faCog} className="me-2" />
                            Configuracion
                        </span>
                        <FontAwesomeIcon icon={configOpen ? faChevronDown : faChevronRight} />
                    </button>
                    <Collapse in={configOpen}>
                        {/* Submenu items */}
                        { /*Generales */}
                        <div>
                            <NavLink to="/pos/configuraciones/generales" className="nav-link">Generales</NavLink>
                        
                            <NavLink to="/pos/configuraciones/agregar-usuario" className="nav-link">Agregar Usuario</NavLink>
                       
                            <NavLink to="/pos/configuraciones/agregar-sucursal" className="nav-link">Agregar Sucursal</NavLink>
                        </div>
                    </Collapse>
                </div>
                <NavLink to="/pos/configuraciones" className="nav-link">Configuraciones</NavLink>
                
            </Nav>
        </div>
    );
}

export default SidebarPOS;