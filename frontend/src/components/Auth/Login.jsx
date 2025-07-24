import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
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
        // Aquí podrías hacer una llamada a la API para autenticar al usuario        
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/user/token/', {
                username: formData.username,
                password: formData.password
            });
            response.then(res => {
                if (res.status === 200) {
                    localStorage.setItem('access', res.data.access);
                    localStorage.setItem('refresh', res.data.refresh);
                    onLogin(); // Llama a la función onLogin pasada como prop
                    
                }
            }).catch(error => {
                console.error('Error al iniciar sesión:', error);
                alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            });
        }catch (error) {

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