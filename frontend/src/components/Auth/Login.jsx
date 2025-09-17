import React, { useState } from 'react';
import AuthServices from '../../services/AuthServices';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function LoginForm ({onLogin }){
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const procesarDatos = e => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const hadleSubmit = async (e) =>{
        e.preventDefault();
              
        try{
            const response = await AuthServices.login(formData.username, formData.password);
            console.log("[DEBUG] Respuesta del login:", response);
            const { access, refresh, empresa_configurada, empresa } = response;
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
                
            // Notificar al componente padre que el inicio de sesión fue exitoso
            onLogin(empresa_configurada, empresa);

        }catch (error) {
            alert("Error en el inicio de sesión. Verifica tus credenciales.");
        }
    }

    return(
        <Container>
            <Row className = "justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2>Iniciar sesión</h2>
                    <Form onSubmit={hadleSubmit}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={procesarDatos}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={procesarDatos}
                            />
                        </Form.Group>
                        <Button className='btn btn-primary' type="submit">Entrar</Button>
                    </Form>
                    <Form.Text className="mt-3">
                        No tienes una cuenta? <Link to="/register">Registrate</Link>
                    </Form.Text>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginForm;