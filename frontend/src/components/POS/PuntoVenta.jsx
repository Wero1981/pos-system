import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import HeaderPOS from './Layout/HeaderPOS';
import SidebarPOS from './Layout/SidebarPOS';
import Cart from "./Cart/Cart";
import ProductSearch from "./Products/ProductSearch";
import ProductList from "./Products/ProductList";
import { Outlet } from "react-router-dom";

function PuntoVenta({ dataEmpresa }) {
    const { nombre, tipo_empresa, configurada, id, sucursal_id } = dataEmpresa;
    console.log("[DEBUG] Datos de la empresa en PuntoVenta:", dataEmpresa);
    const [sidebarCollapse, setSidebarCollapse] = useState(true);

    const handleToggleSidebar = () => {
        console.log("[DEBUG] Toggle sidebar");
        setSidebarCollapse(!sidebarCollapse);
    }
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
            <SidebarPOS 
                sucursal={id} 
                sidebarCollapse={sidebarCollapse}
                onToggleSidebar={handleToggleSidebar}
            />
            <div className="flex-grow-1 d-flex flex-column">
                <HeaderPOS 
                    nombre_empresa={nombre} 
                    onLogout={handleLogout}
                    onToggleSidebar={handleToggleSidebar}
                    sidebarCollapse={sidebarCollapse}
                    />
                <Container fluid className="mt-3">
                    <Outlet />
                </Container>
            </div>
        </div>
    );
}

export default PuntoVenta;
