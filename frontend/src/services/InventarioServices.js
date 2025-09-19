//services/InventarioServices.js

import axios from "axios";
const BASE_URL = "http://127.0.0.1:8000/api/";
const ENDPOINTS = {
    categorias: `${BASE_URL}productos/categorias/`,
    productos: `${BASE_URL}productos/productos/`,
    inventario: `${BASE_URL}productos/inventario/`,
    sucursales: `${BASE_URL}empresas/sucursales/`,
    inventario_sucursal: `${BASE_URL}productos/inventario_sucursal/`
};


const AUTHHEADER = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json"
    }
});

//-------- Servicios de Categorias de Productos --------//
const ProductosServices = {
    // Obtener todas las categorias de productos
    async obtenerCategorias() {
        const response = await axios.get(ENDPOINTS.categorias, AUTHHEADER());
        return response.data;
    },
    // Crear una nueva categoria de producto
    async crearCategoria(nombre, descripcion, sucursal) {
        const response = await axios.post(ENDPOINTS.categorias, {
            nombre,
            descripcion
        }, AUTHHEADER());
        return response.data;
    },
    // Actualizar una categoria de producto
    async actualizarCategoria(id, nombre, descripcion) {
        const response = await axios.put(`${ENDPOINTS.categorias}${id}/`, {
            nombre,
            descripcion
        }, AUTHHEADER());
        return response.data;
    },
    // Eliminar una categoria de producto
    async eliminarCategoria(id) {
        const response = await axios.delete(`${ENDPOINTS.categorias}${id}/`, AUTHHEADER());
        return response.data;
    },

    //-------- Servicios de Productos --------//
    // Obtener todos los productos
    async obtenerProductos() {
        const response = await axios.get(ENDPOINTS.productos, AUTHHEADER());
        return response.data;
    },
    // Crear un nuevo producto
    async crearProducto(nombre, descripcion, precio, categoria_id, stock) {
        const response = await axios.post(ENDPOINTS.productos, {
            nombre,
            descripcion,
            precio,
            categoria_id,
        }, AUTHHEADER());
        return response.data;
    },
    // Actualizar un producto
    async actualizarProducto(id, nombre, descripcion, precio, categoria_id, stock) {
        const response = await axios.put(`${ENDPOINTS.productos}${id}/`, {
            nombre,
            descripcion,
            precio,
            categoria_id,
            stock
        }, AUTHHEADER());
        return response.data;
    },
    // Eliminar un producto
    async eliminarProducto(id) {
        const response = await axios.delete(`${ENDPOINTS.productos}${id}/`, AUTHHEADER());
        return response.data;
    },

    //-------- Servicios de Movimientos de Inventario --------//
    // Obtener todos los movimientos de inventario
    async obtenerMovimientos() {
        const response = await axios.get(ENDPOINTS.inventario, AUTHHEADER());
        return response.data;
    },
    // Crear un nuevo movimiento de inventario
    async crearMovimiento(producto_id, cantidad, tipo_movimiento, descripcion) {
        const response = await axios.post(ENDPOINTS.inventario, {
            producto_id,
            cantidad,
            tipo_movimiento,
            descripcion
        }, AUTHHEADER());
        return response.data;
    },

    // Actualizar un movimiento de inventario
    async actualizarMovimiento(id, producto_id, cantidad, tipo_movimiento, descripcion) {
        const response = await axios.put(`${ENDPOINTS.inventario}${id}/`, {
            producto_id,
            cantidad,
            tipo_movimiento,
            descripcion
        }, AUTHHEADER());
        return response.data;
    },

    // Eliminar un movimiento de inventario
    async eliminarMovimiento(id) {
        const response = await axios.delete(`${ENDPOINTS.inventario}${id}/`, AUTHHEADER());
        return response.data;
    },

    // obtener sucursales
    async obtenerSucursales() {
        const response = await axios.get(ENDPOINTS.sucursales, AUTHHEADER());
        return response.data;
    }

    //obtener inventario por sucursal
    , async obtenerInventarioPorSucursal(sucursalId) {
        const response = await axios.get(`${ENDPOINTS.inventario_sucursal}?sucursal_id=${sucursalId}`, AUTHHEADER());
        return response.data;
    }
};

export default ProductosServices;
