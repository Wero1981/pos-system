import React, { useState } from 'react';
import AuthServices from '../../services/AuthServices';
import {Form, Button, Alert, Card, Container, Spinner} from 'react-bootstrap';
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
    const[loading, setLoading] = useState(false);

    const handleChange= e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const checkUsername = async e => {
        if(!form.username) return;
        try {
            const res = await AuthServices.checkUsernameExists(form.username);
            if (res) {
                setError('El nombre de usuario ya está en uso');
                console.log("[DEBUG] EL USUARIO YA EXISTE");
            } else {
                setError(null);
                console.log("[DEBUG] EL USUARIO NO EXISTE");
            }
            
        } catch (err) {
            setError('Error al verificar el nombre de usuario');
        }
    }
    const checkEmail = async e => {
        if(!form.email) return;
        try {
            const res = await AuthServices.checkEmailExists(form.email);
            if (res) {
                setError('El email ya está en uso');
                console.log("[DEBUG] EL EMAIL YA EXISTE");
            } else {
                setError(null);
                console.log("[DEBUG] EL EMAIL NO EXISTE");
            }
        } catch (err) {
            setError('Error al verificar el email');
        }
          
    }   

    const handleSubmit = async e => {
        setLoading(true);
        e.preventDefault();
        setError(null);
        setMensaje(null);
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if(form.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
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
         const res = await AuthServices.register(username, email, form.password, form.confirmPassword);
         console.log(res);
         if(res && res.data && res.data.message){
            setMensaje( res.data.message);
         }else if(res.access){
            localStorage.setItem('access', res.access);
            localStorage.setItem('refresh', res.refresh);
            let empresaConfigurada = res.empresa_configurada;

            console.log("[DEBUG] Empresa configurada (desde register):", empresaConfigurada);
            onRegisterSuccess(empresaConfigurada);
                  
         }

        }catch(err){
            console.log(err);
            const resMessage = err.response && err.response.data
            ? err.response.data.password1 || err.response.data.non_field_errors  || err.response.data.username
            : err.message;
            console.log("[DEBUG] ERROR EN REGISTRO resMessage: ", resMessage);
           let mensaje;
           if(typeof resMessage === 'object'){
              if(resMessage.length > 1){
                mensaje = resMessage.join(' ');
              } else {
                mensaje = resMessage[0];
              }
            
           }
           setError(mensaje || resMessage);
        }
        finally{
            setLoading(false);
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

                    <Button variant="primary" type="submit" className='mt-2'>
                        {loading ? (
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
                            ) : 
                                "Registrar"
                            }
                    </Button>
                </Form>
                <Form.Text className="mt-3">
                    Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                </Form.Text>
            
            </Card>
        </Container>
    );
}

export default Register;
