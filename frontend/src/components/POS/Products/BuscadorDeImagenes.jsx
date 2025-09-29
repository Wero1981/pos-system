import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, Card, ModalHeader, ModalBody } from 'react-bootstrap';
import { buscarImagenes } from './busquedaImagen';


const BuscadorDeImagenes = ({ show, onHide, onSelectImage, nombreProducto }) => {
    console.log("[DEBUG] BuscadorDeImagenes renderizado con show:", show, "nombreProducto:", nombreProducto);
    const [query, setQuery] = useState(nombreProducto || '');
    const [imagenes, setImagenes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);


    // Manejar la búsqueda de imágenes
    const manejarBusqueda = async (e) => {
        if(!query.trim()) {
            setError("Por favor ingresa un término de búsqueda.");
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const imagenesEncontradas = await buscarImagenes(query);
            setImagenes(imagenesEncontradas);
            if(imagenesEncontradas.length === 0) {
                setError("No se encontraron imágenes para el término proporcionado.");
            }

        }catch (error) {
            setError("Ocurrió un error al buscar imágenes. Inténtalo de nuevo.");

        }finally {
            setCargando(false);
        }
    }

    //Manejar la selección de una imagen
    const manejarSeleccion = (url) => {
        setImagenSeleccionada(url);
    }

    //Manejar la confirmación de la selección
    const manejarConfirmacion = async () => {
        if(imagenSeleccionada) {
            try{
                const response = await fetch(imagenSeleccionada);
                const blob = await response.blob();
                const file = new File([blob], "imagen_producto.jpg", { type: blob.type });
                onSelectImage(imagenSeleccionada, file);
                onHide();
            } catch (error) {
                console.error("Error al seleccionar la imagen:", error);
                setError("Ocurrió un error al seleccionar la imagen. Inténtalo de nuevo.");
            }
        }
    }

    //Manejar el cierre del modal
    const manejarCierre = () => {
        setImagenes([]);
        setQuery(nombreProducto || '');
        setError(null);
        setImagenSeleccionada(null);
        onHide();
    }

    React.useEffect(() => {
            console.log("[DEBUG] useEffect1 show o nombreProducto cambió:", show, nombreProducto, nombreProducto.trim());

        if(show && nombreProducto && nombreProducto.trim()) {
            console.log("[DEBUG] useEffect2 show o nombreProducto cambió:", show, nombreProducto, nombreProducto.trim());

            setQuery(nombreProducto);
            manejarBusqueda();
        }
    }, [show, nombreProducto]);

    return (
        <Modal show={show} onHide={manejarCierre} size="lg">
            <ModalHeader closeButton>
                <Modal.Title>Buscar Imágenes</Modal.Title>
            </ModalHeader>
            <ModalBody>
                {/* Busqueda */}
   
                <Form.Group className='d-flex gap-2'>
                    <Form.Control 
                        type="text" 
                        placeholder="Buscar imágenes..." 
                        value={query} 
                        onChange={e => setQuery(e.target.value)}
                    />
                    <Button 
                        variant="primary" 
                        type="submit"
                        onClick={manejarBusqueda}
                        disabled={cargando}>
                        {cargando ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Buscar"}
                    </Button>
                </Form.Group>

                {/* Error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Resultados de la búsqueda */}
                <Row className="mt-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {imagenes.map((url, index) => (
                        <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                            <Card 
                                className={`h-100 ${imagenSeleccionada === url ? 'border-primary' : ''}`} 
                                onClick={() => manejarSeleccion(url)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Img variant="top" src={url} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </ModalBody>
            <Modal.Footer>
                <Button variant="secondary" onClick={manejarCierre}>Cerrar</Button>
                <Button 
                    variant="primary" 
                    onClick={manejarConfirmacion} 
                    disabled={!imagenSeleccionada}>
                    Confirmar Selección
                </Button>
            </Modal.Footer>
        </Modal>

    );

};


export default BuscadorDeImagenes;