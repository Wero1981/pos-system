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
    faChartBar,
    //wrench
    faWrench,
    faUserPlus,
    faStore
} from '@fortawesome/free-solid-svg-icons';

function SidebarPOS( { scursal, sidebarCollapse, onToggleSidebar } ) {
    console.log("[]DEBUG] SidebarPOS - sidebarCollapse:", sidebarCollapse , " type"); 
    const [ configOpen, setConfigOpen ] = useState(false);
  

    return(
        <div      
        className="bg-light p-3 vh-100 border-end"
            style={{ 
                Width: sidebarCollapse ? '60px' : '200px'
                , transition: 'width 0.3s ease'
                , minWidth: sidebarCollapse ? '60px' : '200px'
                , overflowX: 'hidden'
             }}
        >    
            {!sidebarCollapse &&  <h5 className="mb-3" >Menú</h5> }
            <Nav className="flex-column">
                <NavLink to="/pos/invetarioSucursal" 
                        className="nav-link d-flex align-items-center"
                        title={sidebarCollapse ? 'Inventario Sucursal' : ''}
                        >
                        <FontAwesomeIcon icon={faBox} className="me-2" />
                        {!sidebarCollapse &&<span>Inventario Sucursal</span>}  {/* Espacio entre el icono y el texto */}
                     
                </NavLink>
                <NavLink to="/pos/ventas" 
                        className="nav-link d-flex align-items-center"
                        title={sidebarCollapse ? 'Ventas' : ''}
                        >
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        {!sidebarCollapse &&<span>Ventas</span>}
                        
                </NavLink>
                <NavLink to="/pos/inventario" 
                        className="nav-link d-flex align-items-center"
                        title={sidebarCollapse ? 'Catalogos' : ''}
                        >
                        <FontAwesomeIcon icon={faTags} className="me-2" />
                        {!sidebarCollapse &&<span>Catalogos</span>}
                        
                </NavLink>
                <NavLink to="/pos/reportes" 
                        className="nav-link d-flex align-items-center"
                        title={sidebarCollapse ? 'Reportes' : ''}
                        >
                        <FontAwesomeIcon icon={faChartBar} className="me-2" />
                        {!sidebarCollapse &&<span>Reportes</span>}
                        
                </NavLink>
                {/* Configuracion con submenu */}
                <div>
                    <button
                        className="btn btn-link nav-link text-start w-100 d-flex justify-content-between align-items-center"
                        onClick={() => setConfigOpen(!configOpen)}
                        style = {{ textDecoration: 'none', border: 'none', background: 'none'}}
                    >
                        <span>
                            <FontAwesomeIcon icon={faWrench} className="me-2" />
                        </span>
                        <FontAwesomeIcon icon={configOpen ? faChevronDown : faChevronRight} />
                    </button>
                    <Collapse in={configOpen}>
                        {/* Submenu items */}
                        { /*Generales */}
                        <div className="ms-3">
                            <NavLink 
                                to="/pos/configuraciones/generales" 
                                className="nav-link">
                                    <FontAwesomeIcon icon={faCog} className="me-2" />
                                    Generales
                            </NavLink>
                        
                            <NavLink 
                                to="/pos/configuraciones/agregar-usuario" 
                                className="nav-link">
                                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                                    Agregar Usuario
                            </NavLink>
                       
                            <NavLink 
                                to="/pos/configuraciones/agregar-sucursal" 
                                className="nav-link">
                                    <FontAwesomeIcon icon={faStore} className="me-2" />
                                    Agregar Sucursal
                            </NavLink>
                        </div>
                    </Collapse>
                </div> 
            </Nav>
        </div>
    );
}

export default SidebarPOS;