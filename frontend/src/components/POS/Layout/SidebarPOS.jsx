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
import '../../../cssPropios/SIdebar.css';

function SidebarPOS({ scursal, sidebarCollapse, onToggleSidebar }) {
  const [configOpen, setConfigOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const shouldShowExpanded = !sidebarCollapse || isHover;

  return (
    <div
      className={`sidebar ${shouldShowExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={`sidebar-logo d-flex justify-content-center align-items-center ${
          shouldShowExpanded ? "expanded" : "collapsed"
        }`}
      >
        <h6 className="m-0">
          {shouldShowExpanded ? "Punto de venta" : "P"}
        </h6>
      </div>
      <Nav className="flex-column">
        <NavLink to="/pos/inventarioSucursal" className="nav-link d-flex align-items-center">
          <FontAwesomeIcon icon={faBox} className="me-2" />
          <span>Inventario</span>
        </NavLink>

        <NavLink to="/pos/ventas" className="nav-link d-flex align-items-center">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          <span>Ventas</span>
        </NavLink>

        <NavLink to="/pos/catalogo" className="nav-link d-flex align-items-center">
          <FontAwesomeIcon icon={faTags} className="me-2" />
          <span>Catálogos</span>
        </NavLink>

        <NavLink to="/pos/reportes" className="nav-link d-flex align-items-center">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          <span>Reportes</span>
        </NavLink>

        <div>
            <button
                className="btn btn-link nav-link text-start w-100 d-flex justify-content-between align-items-center"
                onClick={() => setConfigOpen(!configOpen)}
                style={{ textDecoration: "none", border: "none", background: "none" }}
                >
                <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faWrench} className="me-2" />
                    <span>Configuración</span>
                </div>
                {shouldShowExpanded && (
                    <FontAwesomeIcon icon={configOpen ? faChevronDown : faChevronRight} />
                )}
            </button>

          <Collapse in={configOpen}>
            <div className="ms-3 sidebar-submenu">
              <NavLink to="/pos/configuraciones/generales" className="nav-link">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                <span>Generales</span>
              </NavLink>

              <NavLink to="/pos/configuraciones/agregar-usuario" className="nav-link">
                <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                <span>Agregar Usuario</span>
              </NavLink>

              <NavLink to="/pos/configuraciones/agregar-sucursal" className="nav-link">
                <FontAwesomeIcon icon={faStore} className="me-2" />
                <span>Agregar Sucursal</span>
              </NavLink>
            </div>
          </Collapse>
        </div>
      </Nav>
    </div>
  );
}


export default SidebarPOS;