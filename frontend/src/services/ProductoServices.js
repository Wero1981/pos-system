import axios from "axios";
const BASE_URL = "http://127.0.0.1:8000/api/";
const ENDPOINTS = {
    categorias: `${BASE_URL}productos/categorias/`,
    productos: `${BASE_URL}productos/productos/`,
}

const AUTHHEADER = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json"
    }
});

//-------- Servicios de Categorias de Productos --------//
const ProductosServicesCategorias = {
    // Obtener todas las categorias de productos
    async obtenerCategorias() {
        const response = await axios.get(ENDPOINTS.categorias, AUTHHEADER());
        return response.data;
    },

    // Crear una nueva categoria de producto
    async crearCategoria(formData) {
        const response = await axios.post(ENDPOINTS.categorias, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            categoria_padre: formData.categoria_padre || null
        }, AUTHHEADER());
        return response.data;
    },

    // Actualizar una categoria de producto
    async actualizarCategoria(id, formData) {
        const response = await axios.put(`${ENDPOINTS.categorias}${id}/`, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            categoria_padre: formData.categoria_padre || null
        }, AUTHHEADER());
        return response.data;
    },

    // Eliminar una categoria de producto
    async eliminarCategoria(id) {
        const response = await axios.delete(`${ENDPOINTS.categorias}${id}/`, AUTHHEADER());
        return response.data;
    },

    async obtenerProductosPorCategoria(categoriaId) {
        const url = categoriaId === 'todas' 
            ? ENDPOINTS.productos 
            : `${ENDPOINTS.productos}?categoria=${categoriaId}`;
        
        console.log("[DEBUG] URL para productos por categoría:", url);
        const response = await axios.get(url, AUTHHEADER());
        console.log("[DEBUG] Respuesta del servidor:", response.data);
        return response.data;
    },

    // ✅ NUEVO: Buscar productos con filtros
    async buscarProductos(filtros = {}) {
        const params = new URLSearchParams();
        
        if (filtros.categoria && filtros.categoria !== "todas") {
            params.append('categoria', filtros.categoria);
        }
        
        if (filtros.search) {
            params.append('search', filtros.search);
        }
        
        if (filtros.limit) {
            params.append('limit', filtros.limit);
        }

        const url = `${ENDPOINTS.productos}buscar/?${params.toString()}`;
        const response = await axios.get(url, AUTHHEADER());
        return response.data.results || response.data;
    },

    // Crear un nuevo producto
    async crearProducto(formData) {
        const response = await axios.post(ENDPOINTS.productos, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            costo: formData.costo,
            precio_venta: formData.precio_venta,
            categoria: formData.categoria_id,
            unidad_medida: formData.unidad_medida,
            imagen_url: formData.imagen_url || null
        }, AUTHHEADER());
        return response.data;
    },

    // Actualizar un producto
    async actualizarProducto(id, formData) {
        const response = await axios.put(`${ENDPOINTS.productos}${id}/`, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            costo: formData.costo,
            precio_venta: formData.precio_venta,
            categoria: formData.categoria_id,
            unidad_medida: formData.unidad_medida,
            imagen_url: formData.imagen_url || null
        }, AUTHHEADER());
        return response.data;
    },

    // Eliminar un producto
    async eliminarProducto(id) {
        const response = await axios.delete(`${ENDPOINTS.productos}${id}/`, AUTHHEADER());
        return response.data;
    }
}


export default ProductosServicesCategorias;