import React, { useState } from 'react';

import axios from 'axios';
import {Form, Button, Alert, Card, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Register({onRegisterSuccess}){
    const[form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const[ mensaje, setMensaje] = useState(null);
    const[error, setError] = useState(null);
    //const[loading, setLoading] = useState(false);

    const handleChange= e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const checkUsername = async e => {
        if(!form.username) return;
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/user/registro/check-username/", {
                username: form.username
            });
            if (res.data.exists) {
                setError('El nombre de usuario ya está en uso');
            } else {
                setError(null);
            }
        } catch (err) {
            setError('Error al verificar el nombre de usuario');
        }
    }
    const checkEmail = async e => {
        if(!form.email) return;
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/user/registro/check-email/", {
                email: form.email
            });
            if (res.data.exists) {
                setError('El email ya está en uso');
            } else {
                setError(null);
            }
        } catch (err) {
            setError('Error al verificar el email');
        }
    }   

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setMensaje(null);
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        let username = form.username;
        username = username.trim();
        
        if (username.length < 5) {
            setError('El nombre de usuario debe tener al menos 5 caracteres');
            return;
        }
        let email = form.email;
        if (!email.includes('@')) {
            setError('El correo electrónico no es válido');
            return;
        }

        try{
         const res = await axios.post('http://127.0.0.1:8000/api/user/registro/', 
            {
                username: form.username,
                email: form.email,
                password: form.password
            }
         );
         setMensaje( res.data.message);
         onRegisterSuccess();

        }catch(err){
            setError(err.response.data.errors || 'Error al registrar el usuario');
           if(err.response.data.errors.username){
                setError(err.response.data.errors.username[0]);
            }
            if(err.response.data.errors.email){
                setError(err.response.data.errors.email[0]);
            }
           
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-sm">
                <h3 className="mb-4">Registro de Usuario</h3>
                {mensaje && <Alert variant="success">{mensaje}</Alert>}
                {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className='mb-3'>
                        <Form.Label>Nombre de Usuario</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="username" 
                            value={form.username} 
                            onChange={handleChange}
                            onBlur={checkUsername}
                            required />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className='mb-3'>
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange}
                            onBlur={checkEmail}
                            required />
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="password" 
                            value={form.password} 
                            onChange={handleChange} 
                            required />
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="confirmPassword" 
                            value={form.confirmPassword} 
                            onChange={handleChange} 
                            required />
                    </Form.Group>

                    <Button variant="primary" type="submit">Registrar</Button>
                </Form>
                <Form.Text className="mt-3">
                    Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                </Form.Text>
            
            </Card>
        </Container>
    );
}

export default Register;
