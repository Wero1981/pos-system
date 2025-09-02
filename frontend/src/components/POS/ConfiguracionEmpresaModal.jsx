import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap'


function ConfiguracionEmpresaModal({onConfiguracionComplete, onConfiguracionCancelada}){

    const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo_empresa: '',
    })

    const opciones = [
        {value: 'retails' , label: 'Retail'},
        {value: 'servicios', label: 'Servicios'},
        {value: 'manufactura', label: 'Manufactura'},
        {value: 'distribucion', label : 'Distribucion'},
        {value: 'restaurante', label: 'Restaurante'},
        {value: 'otro', label: 'Otro'}
    ];
    const guardarConfiguracion = async () => {
        setLoading(true);
        // Aquí podrías hacer una llamada a la API para guardar la configuración
        try{
            const response = await axios.post(
                'http://127.0.0.1:8000/api/configuracion/', {
                    // Aquí debes enviar los datos de configuración
                    ...formData
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            if (response.status === 200) {
                setShow(false);
                onConfiguracionComplete(); // Llama a la función pasada como prop para indicar que la configuración se ha completado
            }
        }catch (error) {
            setLoading(false);
        }
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
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre" 
                            placeholder='Mi empresa SA de CV' 
                            value={formData.nombre}
                            required />
                    </div>
                    {/* Tipo de empresa */}
                    <div className='mb-3'>
                        <label htmlFor='tipoEmpresa' className='form-label'>Tipo empresa</label>
                        <select id='tipoEmpresa' value={formData.tipo_empresa} className='form-select' required>
                            <option value=''>Seleccione un tipo</option>
                            {opciones.map(opcion => (
                                <option key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </select>
                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={() => onConfiguracionCancelada()}> 
                    Cancelar
                </Button>
                <Button 
                    variant='primary' 
                    onClick={guardarConfiguracion}
                    disabled={loading}
                    >
                    {loading ? 
                        (
                            <>
                                <Spinner 
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Guardando...
                            </>
                        ) 
                        : 'Guardar Configuración'}
                </Button>
            </Modal.Footer>

        </Modal>
    );
}

export default ConfiguracionEmpresaModal;