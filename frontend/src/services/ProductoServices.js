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
        const response = await axios.get(ENDPOINTS.productos, AUTHHEADER());
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
    }
}


export default ProductosServicesCategorias;