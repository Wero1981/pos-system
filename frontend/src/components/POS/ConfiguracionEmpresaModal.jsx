import React from 'react'
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'

function ConfiguracionEmpresaModal({onConfiguracionComplete}){

    const [show, setShow] = useState(true);
    const guardarConfiguracion = () => {
        // Aquí podrías hacer una llamada a la API para guardar la configuración
        setShow(false);
        onConfiguracionComplete(); // Llama a la función pasada como prop para indicar que la configuración se ha completado
    }

    return(
        <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    Configuración inicial requerida
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Por Favor completa la informacion de tu empresa para continuar</p>
                {/* TODO - Formulario de configuracion */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={guardarConfiguracion}>Guardar Configuración</Button>
            </Modal.Footer>

        </Modal>
    );
}

export default ConfiguracionEmpresaModal;