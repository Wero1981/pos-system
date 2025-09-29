import axios from "axios";

const API_KEY ="pALqCxh5twka2DAdRZvmdablGafnsPhS18PoowapsdzAhXDelDSO9Ec4"

const buscarImagenes = async (query) => {
    console.log("[DEBUG] Buscar imágenes con término:", query);
    try {
        const response = await axios.get("https://api.pexels.com/v1/search", {
            headers: {
                Authorization: API_KEY
            },
            params: {
                query,
                per_page: 10
            }
        });

        // Devuelceun array de URLS  de imagenes
        const imagenes = response.data.photos.map(photo => photo.src.medium);
        return imagenes;
    } catch (error) {
        console.error("Error al buscar imágenes:", error);
        return [];
    }
};

export { buscarImagenes };