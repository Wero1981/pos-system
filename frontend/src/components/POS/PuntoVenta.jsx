import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import HeaderPOS from './Layout/HeaderPOS';
import SidebarPOS from './Layout/SidebarPOS';
import Cart from "./Cart/Cart";
import ProductSearch from "./Products/ProductSearch";
import ProductList from "./Products/ProductList";

function PuntoVenta() {
    const [productos] = useState([
        { name: 'Producto 1', price: 100 },
        { name: 'Producto 2', price: 200 },
        { name: 'Producto 3', price: 300 },
        { name: 'Producto 4', price: 400 },
    ]);

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cartItems]);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
    };

    const handleSearch = (query) => {
        console.log('Searching for:', query);
        // TODO: Implement search functionality
    };

    const onRemoveItem = (itemToRemove) => {
        setCartItems(cartItems.filter(item => item !== itemToRemove));
    };

    const onUpdateQuantity = (itemToUpdate, quantity) => {
        if (quantity < 1) {
            onRemoveItem(itemToUpdate);
        } else {
            setCartItems(cartItems.map(item =>
                item === itemToUpdate ? { ...item, quantity } : item
            ));
        }
    };

    const onAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.name === product.name);
        if (existingItem) {
            onUpdateQuantity(existingItem, existingItem.quantity + 1);
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div className="d-flex">
            <SidebarPOS />
            <div className="flex-grow-1 d-flex flex-column">
                <HeaderPOS onLogout={handleLogout} />
                <Container fluid className="mt-3">
                    <Row>
                        {/* Sección izquierda - carrito */}
                        <Col md={4}>
                            <Card className="mb-3 shadow-sm">
                                <Card.Header>
                                    <h5>Carrito de Compras</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Cart 
                                        cartItems={cartItems}
                                        onRemoveItem={onRemoveItem}
                                        onUpdateQuantity={onUpdateQuantity}
                                    />
                                    <h5 className="text-end mt-3">Total: ${total.toFixed(2)}</h5>
                                    <Button variant="primary" className="w-100 mt-2">Cobrar</Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Sección derecha - productos */}
                        <Col md={8}>
                            <Card className="mb-3 shadow-sm">
                                <Card.Header>
                                    <h5>Búsqueda de Productos</h5>
                                </Card.Header>
                                <Card.Body>
                                    <ProductSearch onSearch={handleSearch} />
                                    <ProductList 
                                        products={productos} 
                                        onAddToCart={onAddToCart}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default PuntoVenta;
