import React from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';

function ProductList({ products, onAddToCart }) {
    return (
        <Row>
            {products.map((product, index) => (
                <Col md={4} className="mb-2" key={index}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>${product.price}</Card.Text>
                            <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => onAddToCart(product)}
                            >
                                Agregar
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default ProductList;
