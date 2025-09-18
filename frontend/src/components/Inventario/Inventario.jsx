import React, { useEffect, useState } from "react";
import ProductosServices from "../../services/InventarioServices";
import {useTable} from '@tanstack/react-table';
import { Table, Button, Modal, Form, Spinner, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

function Inventario( sucursales) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '' });
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const sucursalesData = sucursales.sucursales || [];
    const [ sucursalSeleccionada, setSucursalSeleccionada] = useState('');

    //----- Estado para el modal de categoría -----
    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    console.log("[DEBUG] Sucursales en Inventario:", sucursalesData.length);

    return(
        <>
            <div className="container-fluid mt-3">
                {/* Mostrar sucursales */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Sucursal</Form.Label>
                            <Form.Select
                                value={sucursalSeleccionada}
                                onChange={(e) => setSucursalSeleccionada(e.target.value)}
                            >
                                <option value="">***Seleccione una sucursal***</option>
                                {sucursalesData.map((sucursal) => (
                                    <option key={sucursal.id} value={sucursal.id}>
                                        {sucursal.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
               <Row>
                {/* Categorias */}
                <Col md={3} className="border-end">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Categorías</h5>
                        <Button size="sm" className="ms-2" onClick={() => setShowCategoriaModal(true)}>
                            +
                        </Button>
                    </div>
                    <ListGroup>
                        {categorias.map(cat => (
                            <ListGroup.Item
                                key={cat.id}
                                active={categoriaSeleccionada === cat.id}
                                onClick={() => setCategoriaSeleccionada(cat.id)}
                                action
                            >
                                {cat.nombre}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

               </Row>
            </div>

            { /* Modal para agregar categoría */}
            <Modal show={showCategoriaModal} onHide={() => setShowCategoriaModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nueva Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Nombre de la Categoría</Form.Label>
                            <Form.Control
                                value={nuevaCategoria.nombre}
                                onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">   
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                value={nuevaCategoria.descripcion}
                                onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
                            />
                        </Form.Group>
                        {/* ID sucursal oculto */}
                        <Form.Group className="mb-2" style={{ display: 'none' }}>
                            <Form.Label>ID Sucursal</Form.Label>
                            <Form.Control
                                value={nuevaCategoria.sucursal_id}
                                onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, sucursal_id: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCategoriaModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary">
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Inventario;