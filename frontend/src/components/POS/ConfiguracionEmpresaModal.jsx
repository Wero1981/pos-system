import React from 'react'
import { Modal, Button } from 'react-bootstrap'

function ConfiguracionEmpresaModal(){
    return(
        <Modal show="true" backdrop="static" keyboard={false}>
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
                <Button variant='primary'>Guardar Configuración</Button>
            </Modal.Footer>

        </Modal>
    );
}

export default ConfiguracionEmpresaModal;