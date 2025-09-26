import React, { useEffect,  useState } from "react";
import { Table } from "@tanstack/react-table";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import Inventario from "./Inventario";

function InventarioSucursal() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch("/api/productos");
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchProductos();
    }, []);

    if (cargando) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Inventario Sucursal</h2>
            <ul>
                {productos.map(producto => (
                    <li key={producto.id}>{producto.nombre}</li>
                ))}
            </ul>
        </div>
    );
}

export default InventarioSucursal;
