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
                <form>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre de la Empresa</label>
                        <input type="text" className="form-control" id="nombre" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <input type="text" className="form-control" id="direccion" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input type="tel" className="form-control" id="telefono" required />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={guardarConfiguracion}>Guardar Configuración</Button>
            </Modal.Footer>

        </Modal>
    );
}

export default ConfiguracionEmpresaModal;