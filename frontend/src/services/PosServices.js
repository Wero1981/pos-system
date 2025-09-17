//services/PosServices.js

import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/empresas/empresas/";

const PosServices = {
    // Funcion crear empresa Inicio
    async crearEmpresaInicio(nombre, tipo_empresa) {
       
        try {
            const response = await axios.post(`${API_URL}`, {
                nombre,
                tipo_empresa
            }, {
                headers: {
                    
                    'Content-Type': 'application/json',
                    // Agrega aquí otros encabezados si es necesario, como tokens de autenticación
                    Authorization: `Bearer ${localStorage.getItem('access')}`, // Ejemplo de token desde localStorage
                }
            });
        
            return response.data;
        } catch (error) {
            console.error("Error al crear empresa:", error);
            throw error;
        }
    }
};

export default PosServices;
    