//services/AuthServices.js

import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/user/";

const AuthServices = {
    // Función para iniciar sesión
    async login(username, password) {
        const response = await axios.post(`${API_URL}token/`, {
        username,
        password,
        });
        if (response.data.access) {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        }
        return response.data;
    },

    // Función para registrar un nuevo usuario
    async register(username, email, password, password2) {
        try {
            const response = await axios.post(`${API_URL}auth/registration/`, {
                username,
                email,
                password1: password,
                password2: password2
            });
            return response.data;
        } catch (error) {
            console.error("[DEBUG] Error en registro:", error.request.responseText);
            throw error;
        }
    },

    //Funcion login google
    async loginWithGoogle(token) {
        const response = await axios.post(`${API_URL}/google/`, {
            token,
        });
        if (response.data.access) {
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
        }
        return response.data;
    },
    // Función para verificar si un nombre de usuario ya existe
    async checkUsernameExists(username) {
        const response = await axios.post(`${API_URL}usuarios/check-username/`, {
            username
        });
        return response.data.exists;
    },
    // Función para verificar si un email ya existe
    async checkEmailExists(email) {
        const response = await axios.post(`${API_URL}usuarios/check-email/`, {
            email
        });
        return response.data.exists;
    },

    // Función para cerrar sesión
    logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    },

    // Función para obtener el token de acceso
    getAccessToken() {
        return localStorage.getItem("access");
    },
    
};

export default AuthServices;
