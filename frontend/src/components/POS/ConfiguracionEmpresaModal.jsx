//pos/ConfiguracionEmpresaModal.jsx
import React from 'react'
import { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap'
import PosServices from '../../services/PosServices';


function ConfiguracionEmpresaModal({onConfiguracionComplete, onConfiguracionCancelada}){
    const [ mensaje, setMensaje] = useState(null);
    const [ error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo_empresa: '',
    })

    const opciones = [
        {value: 'retail' , label: 'Retail'},
        {value: 'servicios', label: 'Servicios'},
        {value: 'manufactura', label: 'Manufactura'},
        {value: 'distribucion', label : 'Distribucion'},
        {value: 'restaurante', label: 'Restaurante'},
        {value: 'otro', label: 'Otro'}
    ];
    const guardarConfiguracion = async () => {
        setLoading(true);
        try{
            const response = await PosServices.crearEmpresaInicio(formData.nombre, formData.tipo_empresa);
            console.log("[DEBUG] Empresa creada:", response); 
            setMensaje('Configuración guardada con éxito.');
            setError(null);
            const { empresa_configurada, empresa, sucursales } = response;
            setLoading(false);
            setShow(false);

            onConfiguracionComplete(empresa_configurada, empresa, sucursales); // Notificar al componente padre que la configuración se completó
        }catch (error) {
            if (!error.response) {
                setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
                setLoading(false);
                return;
            }   
            setLoading(false);
            let errorMessage = error.response.data.tipo_empresa[0];
            setError( errorMessage || 'Error al guardar la configuración de la empresa');
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
                {mensaje && <div className='alert alert-info'>{mensaje}</div>}
                {error && <div className='alert alert-danger'>{error}</div>}
                <form>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre de la Empresa</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre"
                            name='nombre'
                            placeholder='Mi empresa SA de CV' 
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            required />
                    </div>
                    {/* Tipo de empresa */}
                    <div className='mb-3'>
                        <label htmlFor='tipoEmpresa' className='form-label'>Tipo empresa</label>
                        <select 
                            id='tipoEmpresa' 
                            name='tipo_empresa' 
                            value={formData.tipo_empresa}
                            onChange={(e) => setFormData({...formData, tipo_empresa: e.target.value})}
                            className='form-select' 
                            required>
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