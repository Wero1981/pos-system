import React from "react";
import { Container, Row, Col, Card, Button, Form} from 'react-bootstrap'

function PuntoVenta(){
    return(
        <Container fluid className="mt-3">
            <Row>
                {/*Seccion izquierda: lista de productos / busqudeda */}
                <Col md={8}>
                    <Card className="mb-3 shadow-sm">
                        <Card.Header>Búsqueda de Productos</Card.Header>
                        <Card.Body>
                            <Form.Control type="text" placeholder="Buscar Productos" />
                            <div className="mt-3">
                                {/* Lista Simulada de productos */}
                                <Row>
                                    <Col md={4} className="mb-2">
                                        <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>Producto 1</Card.Title>
                                                    <Card.Text>$50.00</Card.Text>
                                                    <Button variant="success" size="sm">Agregar</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4} className="mb-2">
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>Producto 2</Card.Title>
                                                    <Card.Text>$49.00</Card.Text>
                                                    <Button variant="success" size="sm">Agregar</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4} className="mb-2">
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>Producto 3</Card.Title>
                                                    <Card.Text>$80.00</Card.Text>
                                                    <Button variant="success" size="sm">Agregar</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Sección derecha Carrito y cobro */}
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Header>
                            Carrito
                        </Card.Header>
                        <Card.Body>
                            { /* Lista de Productos Agregados */}
                            <ul className="list-group mb-3">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Producto 1
                                    <span>$50.00</span>
                                </li>
                                 <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Producto 2
                                    <span>$49.00</span>
                                </li>
                                 <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Producto 3
                                    <span>$80.00</span>
                                </li>
                            </ul>

                            <h5 className="text-end"> Total: $179</h5>
                            <button variant="primary" className="w-100 mt-3">Cobrar</button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PuntoVenta;